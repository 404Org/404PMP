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