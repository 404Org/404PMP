from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth.models import User
from users.models import UserService
from bson import ObjectId

users = Blueprint("users", __name__)

@users.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    users_list = UserService.get_all_users()
    
    # Convert ObjectId to string for JSON serialization
    for user in users_list:
        user["_id"] = str(user["_id"])
    
    return jsonify(users_list), 200

@users.route("/users/<user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    try:
        user = UserService.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user["_id"] = str(user["_id"])
        return jsonify(user), 200
    except:
        return jsonify({"error": "Invalid user ID"}), 400

@users.route("/users/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    data = request.get_json()
    
    # Sanitize update data
    update_data = UserService.sanitize_update_data(data)
    
    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400
    
    # Update user profile
    result = UserService.update_user_profile(current_user_email, update_data)
    
    if result.modified_count:
        return jsonify({"message": "Profile updated successfully"}), 200
    return jsonify({"error": "Failed to update profile"}), 400

@users.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    # Get current user's role
    current_user_email = get_jwt_identity()
    current_user = User.find_by_email(current_user_email)
    
    if not current_user or current_user.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    try:
        result = UserService.delete_user(user_id)
        if result.deleted_count:
            return jsonify({"message": "User deleted successfully"}), 200
        return jsonify({"error": "User not found"}), 404
    except:
        return jsonify({"error": "Invalid user ID"}), 400

@users.route("/users/<user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    # Get current user's role
    current_user_email = get_jwt_identity()
    current_user = User.find_by_email(current_user_email)
    
    # Check if user is admin
    if not current_user or current_user.get("role") != "admin":
        return jsonify({"error": "Unauthorized access"}), 403
    
    data = request.get_json()
    
    try:
        # Sanitize update data (allows role updates but not password/tokens)
        update_data = UserService.sanitize_admin_update_data(data)
        
        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400
        
        # Update user
        result = UserService.update_user_by_id(user_id, update_data)
        
        if result.modified_count:
            return jsonify({"message": "User updated successfully"}), 200
        return jsonify({"error": "User not found or no changes made"}), 404
    except Exception as e:
        return jsonify({"error": f"Failed to update user: {str(e)}"}), 400
