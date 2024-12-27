from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from notifications.models import Notification
from users.models import UserService

notifications = Blueprint("notifications", __name__)

@notifications.route("/notifications", methods=["GET"])
@jwt_required()
def get_notifications():
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        notifications = Notification.get_user_notifications(str(user['_id']))
        return jsonify({"notifications": notifications}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications.route("/notifications/<notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_read(notification_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Notification.mark_as_read(notification_id, str(user['_id']))
        if result.modified_count > 0:
            return jsonify({"message": "Notification marked as read"}), 200
        return jsonify({"error": "Notification not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications.route("/notifications/read-all", methods=["PUT"])
@jwt_required()
def mark_all_notifications_read():
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Notification.mark_all_as_read(str(user['_id']))
        return jsonify({"message": f"Marked {result.modified_count} notifications as read"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications.route("/notifications/<notification_id>", methods=["DELETE"])
@jwt_required()
def delete_notification(notification_id):
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Notification.delete_notification(notification_id, str(user['_id']))
        if result.deleted_count > 0:
            return jsonify({"message": "Notification deleted"}), 200
        return jsonify({"error": "Notification not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications.route("/notifications/delete-all", methods=["DELETE"])
@jwt_required()
def delete_all_notifications():
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        result = Notification.clear_all_notifications(str(user['_id']))
        return jsonify({"message": f"Deleted {result.deleted_count} notifications"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@notifications.route("/notifications", methods=["POST"])
@jwt_required()
def create_notification():
    try:
        current_user_email = get_jwt_identity()
        user = UserService.get_user_by_email(current_user_email)
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        notification_id = Notification.create_notification(
            data['user_id'],
            data['type'],
            data['content'],
            data['reference_id']
        )
        return jsonify({"message": "Notification created", "notification_id": notification_id}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500