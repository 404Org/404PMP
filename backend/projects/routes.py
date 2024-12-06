from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from projects.models import Project
from marshmallow import ValidationError
from bson import ObjectId

projects = Blueprint("projects", __name__)

@projects.route("/projects", methods=["POST"])
@jwt_required()
def create_project():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        
        # Validate project data
        validated_data = Project.schema.load(data)
        
        # Create project
        project_id = Project.create_project(validated_data)
        
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