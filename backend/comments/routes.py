from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from comments.models import Comment
from users.models import UserService
from marshmallow import ValidationError

comments = Blueprint("comments", __name__)

@comments.route("/projects/<project_id>/comments", methods=["POST"])
@jwt_required()
def create_comment(project_id):
    try:
        data = request.get_json()
        current_user_email = get_jwt_identity()
        
        # Get user data for the comment
        user = UserService.get_user_by_email(current_user_email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Create the comment
        comment_id = Comment.create_comment(
            project_id=project_id,
            user_id=str(user['_id']),
            text=data.get('text'),
            user_data=user
        )
        
        return jsonify({
            "message": "Comment created successfully",
            "comment_id": comment_id
        }), 201
        
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/projects/<project_id>/comments", methods=["GET"])
@jwt_required()
def get_project_comments(project_id):
    try:
        comments = Comment.get_comments_by_project(project_id)
        
        # Convert ObjectIds to strings for JSON serialization
        for comment in comments:
            comment['_id'] = str(comment['_id'])
            comment['project_id'] = str(comment['project_id'])
            comment['user_id'] = str(comment['user_id'])
            
        return jsonify({"comments": comments}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Comment.delete_comment(comment_id, str(user['_id']))
        
        if result.deleted_count == 0:
            return jsonify({
                "error": "Comment not found or you're not authorized to delete it"
            }), 404
            
        return jsonify({"message": "Comment deleted successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>", methods=["PUT"])
@jwt_required()
def update_comment(comment_id):
    try:
        data = request.get_json()
        # Validate the input data
        validated_data = Comment.schema.load(data, partial=True)
        result = Comment.update_comment(comment_id, validated_data)
        if result.modified_count == 0:
            return jsonify({"error": "Comment not found"}), 404
        return jsonify({"message": "Comment updated successfully"}), 200
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
