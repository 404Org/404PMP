from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from comments.models import Comment
from users.models import UserService
from marshmallow import ValidationError

comments = Blueprint("comments", __name__)

@comments.route("/projects/<project_id>/comments", methods=["GET"])
@jwt_required()
def get_project_comments(project_id):
    try:
        comments = Comment.get_comments_by_project(project_id)
        return jsonify({"comments": comments or []}), 200
        
    except Exception as e:
        print(f"Error fetching comments: {str(e)}")
        return jsonify({"error": str(e), "comments": []}), 500

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

@comments.route("/comments/<comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the comment first
        comment = Comment.get_comment(comment_id)
        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        # Admin/project manager can delete any comment, users can only delete their own
        if user.get('role') in ['admin', 'project_manager'] or str(user['_id']) == str(comment['user_id']):
            result = Comment.delete_comment(comment_id)
            if result.deleted_count > 0:
                return jsonify({"message": "Comment deleted successfully"}), 200
        else:
            return jsonify({"error": "Unauthorized to delete this comment"}), 403
            
        return jsonify({"error": "Failed to delete comment"}), 400
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>", methods=["PUT"])
@jwt_required()
def update_comment(comment_id):
    try:
        data = request.get_json()
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the comment first
        comment = Comment.get_comment(comment_id)
        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        # Only comment owner can update their comment
        if str(user['_id']) == str(comment['user_id']):
            result = Comment.update_comment(comment_id, str(user['_id']), data.get('text'))
            if result.modified_count > 0:
                return jsonify({"message": "Comment updated successfully"}), 200
        else:
            return jsonify({"error": "Unauthorized to update this comment"}), 403
            
        return jsonify({"error": "Failed to update comment"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>/replies", methods=["POST"])
@jwt_required()
def add_reply(comment_id):
    try:
        data = request.get_json()
        current_user_email = get_jwt_identity()
        
        user = UserService.get_user_by_email(current_user_email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Comment.add_reply(
            comment_id=comment_id,
            user_id=str(user['_id']),
            text=data.get('text'),
            user_data=user
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Comment not found"}), 404
            
        return jsonify({"message": "Reply added successfully"}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>/replies/<reply_id>", methods=["DELETE"])
@jwt_required()
def delete_reply(comment_id, reply_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the comment first
        comment = Comment.get_comment(comment_id)
        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        # Find the specific reply
        reply = next((r for r in comment.get('replies', []) if r['id'] == reply_id), None)
        if not reply:
            return jsonify({"error": "Reply not found"}), 404

        # Admin/project manager can delete any reply, users can only delete their own
        if user.get('role') in ['admin', 'project_manager'] or str(user['_id']) == str(reply['user_id']):
            result = Comment.delete_reply(comment_id, reply_id, str(user['_id']))
            if result.modified_count > 0:
                return jsonify({"message": "Reply deleted successfully"}), 200
        else:
            return jsonify({"error": "Unauthorized to delete this reply"}), 403
            
        return jsonify({"error": "Failed to delete reply"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comments.route("/comments/<comment_id>/replies/<reply_id>", methods=["PUT"])
@jwt_required()
def update_reply(comment_id, reply_id):
    try:
        data = request.get_json()
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get the comment first
        comment = Comment.get_comment(comment_id)
        if not comment:
            return jsonify({"error": "Comment not found"}), 404

        # Find the specific reply
        reply = next((r for r in comment.get('replies', []) if r['id'] == reply_id), None)
        if not reply:
            return jsonify({"error": "Reply not found"}), 404

        # Only reply owner can update their reply
        if str(user['_id']) == str(reply['user_id']):
            result = Comment.update_reply(comment_id, reply_id, str(user['_id']), data.get('text'))
            if result.modified_count > 0:
                return jsonify({"message": "Reply updated successfully"}), 200
        else:
            return jsonify({"error": "Unauthorized to update this reply"}), 403
            
        return jsonify({"error": "Failed to update reply"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
