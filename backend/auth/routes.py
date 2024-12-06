from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token
from auth.models import User
from auth.bcrypt_utils import hash_password, check_password
from marshmallow import Schema, fields, ValidationError
from datetime import datetime, timedelta
import secrets

auth = Blueprint("auth", __name__)

@auth.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    password = data.get("password")
    confirm_password = data.get("confirm_password")

    # Check if password and confirm password match
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Remove confirm_password from data before validation
    data.pop("confirm_password", None)

    # Set default role as 'employee' if not provided
    if "role" not in data:
        data["role"] = "employee"

    # Validate data against the User schema
    try:
        validated_data = User.schema.load(data)
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    if User.find_by_email(validated_data["email"]):
        return jsonify({"error": "Email already exists"}), 400

    validated_data["password"] = hash_password(validated_data["password"])
    User.create_user(validated_data)
    return jsonify({"message": "User created successfully"}), 201

@auth.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.find_by_email(email)
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create access token with email identity
    access_token = create_access_token(identity=email)
    
    # Prepare user data for response (excluding password)
    user_data = {
        "_id": str(user["_id"]),  # Convert ObjectId to string
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

    return jsonify({
        "access_token": access_token,
        "user": user_data
    }), 200

@auth.route("/auth/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    user = User.find_by_email(email)
    if not user:
        # Return success even if email doesn't exist (security best practice)
        return jsonify({"message": "If your email exists in our system, you will receive a password reset link"}), 200

    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expiration = datetime.utcnow() + timedelta(hours=1)

    # Store reset token and expiration in database
    User.update_reset_token(email, reset_token, expiration)

    # TODO: Send email with reset link
    # reset_link = f"https://yourfrontend.com/reset-password?token={reset_token}"
    # send_reset_email(email, reset_link)

    return jsonify({
        "message": "If your email exists in our system, you will receive a password reset link",
        "reset_token": reset_token
    }), 200

@auth.route("/auth/reset-password/<token>", methods=["PUT"])
def reset_password(token):
    data = request.get_json()
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not new_password or not confirm_password:
        return jsonify({"error": "Missing required fields"}), 400

    if new_password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Find user by reset token and verify it's not expired
    user = User.find_by_reset_token(token)
    if not user:
        return jsonify({"error": "Invalid or expired reset token"}), 400

    if datetime.utcnow() > user["reset_token_expires"]:
        return jsonify({"error": "Reset token has expired"}), 400

    # Update password and clear reset token
    hashed_password = hash_password(new_password)
    User.update_password(user["email"], hashed_password)
    User.clear_reset_token(user["email"])

    return jsonify({"message": "Password has been reset successfully"}), 200
