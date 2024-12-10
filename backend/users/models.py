from shared.database import mongo
from bson import ObjectId

class UserService:
    @staticmethod
    def get_all_users():
        """Retrieve all users excluding sensitive fields"""
        return list(mongo.db.users.find({}, 
            {"password": 0, "reset_token": 0, "reset_token_expires": 0}))

    @staticmethod
    def get_user_by_id(user_id):
        """Retrieve a specific user by ID"""
        return mongo.db.users.find_one(
            {"_id": ObjectId(user_id)},
            {"password": 0, "reset_token": 0, "reset_token_expires": 0}
        )

    @staticmethod
    def update_user_profile(email, update_data):
        """Update user profile data"""
        return mongo.db.users.update_one(
            {"email": email},
            {"$set": update_data}
        )

    @staticmethod
    def delete_user(user_id):
        """Delete a user by ID"""
        return mongo.db.users.delete_one({"_id": ObjectId(user_id)})

    @staticmethod
    def sanitize_update_data(data):
        """Remove protected fields from update data"""
        protected_fields = ["email", "password", "role", "reset_token", "reset_token_expires"]
        return {k: v for k, v in data.items() if k not in protected_fields}

    @staticmethod
    def update_user_by_id(user_id, update_data):
        """Update user by ID (admin only)"""
        return mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

    @staticmethod
    def sanitize_admin_update_data(data):
        """Remove protected fields for admin update"""
        protected_fields = ["password", "reset_token", "reset_token_expires"]
        return {k: v for k, v in data.items() if k not in protected_fields} 