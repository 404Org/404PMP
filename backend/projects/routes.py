from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from projects.models import Project
from marshmallow import ValidationError
from bson import ObjectId
from users.models import UserService
from notifications.models import Notification

projects = Blueprint("projects", __name__)

@projects.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        # Convert team member IDs to full user details
        team_member_details = []
        for member_id in data.get('team_members', []):
            user = UserService.get_user_by_id(member_id)
            if user:
                team_member_details.append({
                    'user_id': str(user['_id']),
                    'email': user['email'],
                    'name': user['name']
                })
        
        # Get project manager details
        pm_id = data.get('project_manager')
        if pm_id:
            pm_user = UserService.get_user_by_id(pm_id)
            if pm_user:
                data['project_manager'] = {
                    'user_id': str(pm_user['_id']),
                    'email': pm_user['email'],
                    'name': pm_user['name']
                }
            else:
                return jsonify({"error": "Project manager not found"}), 404
        
        # Replace team_members array with detailed information
        data['team_members'] = team_member_details
        
        # Validate project data
        validated_data = Project.schema.load(data)
        
        # Create project
        project_id = Project.create_project(validated_data)
        
        # Notify team members about new project
        for member in team_member_details:
            Notification.create_notification(
                member['user_id'],
                'new_project',
                f"New project '{validated_data['title']}' has been created",
                project_id
            )
        
        return jsonify({
            "message": "Project created successfully",
            "project_id": project_id
        }), 201
        
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects", methods=["GET"])
@jwt_required()
def get_projects():
    try:
        # Get query parameters for filtering
        status = request.args.get('status')
        tech = request.args.get('tech')
        
        projects = Project.get_all_projects()
        
        # Apply filters if provided
        if status:
            projects = [p for p in projects if p['status'] == status]
        if tech:
            projects = [p for p in projects if tech in p['tech_stack']]
        
        # Convert ObjectId to string for JSON serialization
        for project in projects:
            project['_id'] = str(project['_id'])
        
        return jsonify({"projects": projects}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    try:
        project = Project.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
            
        project['_id'] = str(project['_id'])
        return jsonify({"project": project}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    try:
        data = request.get_json()
        
        # If team_members are being updated
        if 'team_members' in data:
            # Convert team member IDs to full user details
            team_member_details = []
            for member_id in data.get('team_members', []):
                user = UserService.get_user_by_id(member_id)
                if user:
                    team_member_details.append({
                        'user_id': str(user['_id']),
                        'email': user['email'],
                        'name': user['name']
                    })
            data['team_members'] = team_member_details

        # If project_manager is being updated
        if 'project_manager' in data:
            pm_id = data.get('project_manager')
            if pm_id:
                pm_user = UserService.get_user_by_id(pm_id)
                if pm_user:
                    data['project_manager'] = {
                        'user_id': str(pm_user['_id']),
                        'email': pm_user['email'],
                        'name': pm_user['name']
                    }
                else:
                    return jsonify({"error": "Project manager not found"}), 404
            
        # Get existing project to compare team members
        existing_project = Project.get_project_by_id(project_id)
        if existing_project:
            existing_member_ids = {member['user_id'] for member in existing_project.get('team_members', [])}
            new_member_ids = {member['user_id'] for member in team_member_details}
            
            # Notify new team members
            for member in team_member_details:
                if member['user_id'] not in existing_member_ids:
                    Notification.create_notification(
                        member['user_id'],
                        'added_to_project',
                        f"You have been added to project '{existing_project['title']}'",
                        project_id
                    )
            
            # Notify removed members
            for member in existing_project.get('team_members', []):
                if member['user_id'] not in new_member_ids:
                    Notification.create_notification(
                        member['user_id'],
                        'removed_from_project',
                        f"You have been removed from project '{existing_project['title']}'",
                        project_id
                    )
        
        # Validate update data
        validated_data = Project.schema.load(data, partial=True)
        
        result = Project.update_project(project_id, validated_data)
        if result.modified_count == 0:
            return jsonify({"error": "Project not found"}), 404
            
        return jsonify({"message": "Project updated successfully"}), 200
        
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    try:
        result = Project.delete_project(project_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Project not found"}), 404
            
        return jsonify({"message": "Project deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/user/my-projects", methods=["GET"])
@jwt_required()
def get_my_projects():
    try:
        current_user = get_jwt_identity()
        projects = Project.get_projects_by_member(current_user)
        
        # Convert ObjectId to string for JSON serialization
        for project in projects:
            project['_id'] = str(project['_id'])
            
        return jsonify({"projects": projects}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/team/add", methods=["POST"])
@jwt_required()
def add_team_member(project_id):
    # Handle OPTIONS request
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    try:
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        user = UserService.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        project = Project.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Add user to team members
        team_member_details = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'name': user['name']
        }
        
        # Check if user is already a team member
        if any(tm['user_id'] == str(user['_id']) for tm in project.get('team_members', [])):
            return jsonify({"error": "User is already a team member"}), 400

        # Use the update operator directly
        update_operation = {
            '$push': {
                'team_members': team_member_details
            }
        }
        
        result = Project.update_project(project_id, update_operation)

        if result.modified_count:
            # Create notification for the user
            Notification.create_notification(
                str(user['_id']),
                'added_to_project',
                f"You have been added to project '{project['title']}'",
                project_id
            )
            return jsonify({"message": "User added to project successfully"}), 200
        return jsonify({"error": "Failed to add user to project"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/interested", methods=["POST"])
@jwt_required()
def add_interested_user(project_id):
    try:
        current_user = get_jwt_identity()
        user = UserService.get_user_by_email(current_user)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get project and check if it exists
        project = Project.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Check if user is already interested
        if Project.is_user_interested(project, str(user['_id'])):
            return jsonify({"error": "User already in interested list"}), 400

        # Add user to interested list
        user_details = {
            'user_id': str(user['_id']),
            'email': user['email'],
            'name': user['name']
        }
        
        result = Project.add_interested_user(project_id, user_details)

        if result.modified_count:
            return jsonify({"message": "Added to interested list successfully"}), 200
        return jsonify({"error": "Failed to add to interested list"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/interested/<user_id>", methods=["DELETE"])
@jwt_required()
def remove_interested_user(project_id, user_id):
    try:
        result = Project.remove_interested_user(project_id, user_id)

        if result.modified_count:
            return jsonify({"message": "Removed from interested list successfully"}), 200
        return jsonify({"error": "User not found in interested list"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/interested", methods=["GET"])
@jwt_required()
def get_interested_users(project_id):
    try:
        project = Project.get_project_by_id(project_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404

        interested_users = project.get('interested_users', [])
        detailed_interested_users = []

        for user in interested_users:
            user_details = UserService.get_user_by_id(user['user_id'])
            if user_details:
                user['skills'] = user_details.get('skills', [])
                user['experience'] = user_details.get('experience')
                detailed_interested_users.append(user)

        return jsonify({"interested_users": detailed_interested_users}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/interested/<user_id>/accept", methods=["POST"])
@jwt_required()
def accept_interested_user(project_id, user_id):
    try:
        current_user = get_jwt_identity()
        project = Project.get_project_by_id(project_id)

        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Verify if current user is project manager
        if project['project_manager']['email'] != current_user:
            return jsonify({"error": "Unauthorized. Only project manager can accept users"}), 403

        user_to_accept = Project.get_interested_user(project, user_id)
        if not user_to_accept:
            return jsonify({"error": "User not found in interested list"}), 404

        result = Project.accept_interested_user(project_id, user_to_accept)

        if result.modified_count:
            # Create notification for accepted user
            Notification.create_notification(
                user_id,
                'project_acceptance',
                f"You have been accepted to join project '{project['title']}'",
                project_id
            )
            return jsonify({"message": "User accepted and added to team successfully"}), 200
        return jsonify({"error": "Failed to accept user"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@projects.route("/projects/<project_id>/interested/<user_id>/reject", methods=["POST"])
@jwt_required()
def reject_interested_user(project_id, user_id):
    try:
        current_user = get_jwt_identity()
        project = Project.get_project_by_id(project_id)

        if not project:
            return jsonify({"error": "Project not found"}), 404

        # Verify if current user is project manager
        if project['project_manager']['email'] != current_user:
            return jsonify({"error": "Unauthorized. Only project manager can reject users"}), 403

        result = Project.reject_interested_user(project_id, user_id)

        if result.modified_count:
            # Create notification for rejected user
            Notification.create_notification(
                user_id,
                'project_rejection',
                f"Your request to join project '{project['title']}' has been declined",
                project_id
            )
            return jsonify({"message": "User rejected successfully"}), 200
        return jsonify({"error": "User not found in interested list"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500 