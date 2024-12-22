from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from knowledge_base.models import KnowledgeBase
from users.models import UserService
from marshmallow import ValidationError
import os
from werkzeug.utils import secure_filename
from bson import ObjectId
from datetime import datetime

knowledge_base = Blueprint("knowledge_base", __name__)

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads', 'knowledge_base'))
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@knowledge_base.route("/projects/<project_id>/knowledge-base", methods=["POST"])
@jwt_required()
def create_knowledge_base_item(project_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{secure_filename(file.filename)}"
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                
                print(f"Saving file to: {file_path}")

                file.save(file_path)
                
                relative_url = f"/api/uploads/knowledge_base/{filename}"
                
                data = {
                    'project_id': project_id,
                    'name': file.filename,
                    'type': 'file',
                    'url': relative_url,
                    'file_type': filename.rsplit('.', 1)[1].lower(),
                    'created_by': {
                        'user_id': str(user['_id']),
                        'name': user['name'],
                        'email': user['email']
                    }
                }

                # Validate and create the item in the database
                validated_data = KnowledgeBase.schema.load(data)
                item_id = KnowledgeBase.create_item(validated_data)
            else:
                return jsonify({"error": "Invalid file type"}), 400
        else:
            # Handle link creation
            data = request.get_json()
            if not data or 'url' not in data:
                return jsonify({"error": "No data provided or URL missing"}), 400
                
            data['project_id'] = project_id
            data['created_by'] = {
                'user_id': str(user['_id']),
                'name': user['name'],
                'email': user['email']
            }
            data['type'] = 'link'

            validated_data = KnowledgeBase.schema.load(data)
            item_id = KnowledgeBase.create_item(validated_data)
        
        return jsonify({
            "message": "Knowledge base item created successfully",
            "item_id": item_id
        }), 201
        
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@knowledge_base.route("/projects/<project_id>/knowledge-base", methods=["GET"])
@jwt_required()
def get_knowledge_base_items(project_id):
    try:
        items = KnowledgeBase.get_project_items(project_id)
        
        # Convert ObjectId to string for JSON serialization
        for item in items:
            item['_id'] = str(item['_id'])
            
        return jsonify({"items": items}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@knowledge_base.route("/knowledge-base/<item_id>", methods=["PUT"])
@jwt_required()
def update_knowledge_base_item(item_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the existing item
        existing_item = KnowledgeBase.get_item(item_id)
        if not existing_item:
            return jsonify({"error": "Item not found"}), 404

        data = request.get_json()
        validated_data = KnowledgeBase.schema.load(data, partial=True)
        
        # If this is a file type and the URL is being updated, delete the old file
        if existing_item['type'] == 'file' and 'url' in validated_data:
            old_file_path = os.path.join(os.path.dirname(UPLOAD_FOLDER), existing_item['url'].lstrip('/'))
            if os.path.exists(old_file_path):
                os.remove(old_file_path)
        
        result = KnowledgeBase.update_item(item_id, validated_data)
        if result.modified_count == 0:
            return jsonify({"error": "Item not found"}), 404
            
        return jsonify({"message": "Knowledge base item updated successfully"}), 200
        
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@knowledge_base.route("/knowledge-base/<item_id>", methods=["DELETE"])
@jwt_required()
def delete_knowledge_base_item(item_id):
    try:
        item = KnowledgeBase.get_item(item_id)
        if not item:
            return jsonify({"error": "Item not found"}), 404
            
        # Delete file if it's a file type item
        if item['type'] == 'file':
            file_path = os.path.join(os.path.dirname(UPLOAD_FOLDER), item['url'].lstrip('/'))
            if os.path.exists(file_path):
                os.remove(file_path)
            
        result = KnowledgeBase.delete_item(item_id)
        if result.deleted_count == 0:
            return jsonify({"error": "Item not found"}), 404
            
        return jsonify({"message": "Knowledge base item deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@knowledge_base.route("/uploads/knowledge_base/<filename>")
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)