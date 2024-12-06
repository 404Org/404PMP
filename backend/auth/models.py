from shared.database import mongo
from marshmallow import Schema, fields, ValidationError
from datetime import datetime

class UserSchema(Schema):
    name = fields.String(required=True)
    email = fields.Email(required=True)
    role = fields.String(required=True, default='employee') 
    experience = fields.String(required=True)
    skills = fields.List(fields.String(), required=True)
    designation = fields.String(required=True)
    bio = fields.String()
    password = fields.String(required=True)

class User:
    schema = UserSchema()

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})
    
    @staticmethod
    def create_user(user_data):
        # Create unique index for email
        mongo.db.users.create_index("email", unique=True)
        return mongo.db.users.insert_one(user_data)

    @staticmethod
    def update_reset_token(email, token, expiration):
        return mongo.db.users.update_one(
            {"email": email},
            {
                "$set": {
                    "reset_token": token,
                    "reset_token_expires": expiration
                }
            }
        )

    @staticmethod
    def find_by_reset_token(token):
        return mongo.db.users.find_one({"reset_token": token})

    @staticmethod
    def update_password(email, new_password):
        return mongo.db.users.update_one(
            {"email": email},
            {
                "$set": {"password": new_password}
            }
        )

    @staticmethod
    def clear_reset_token(email):
        return mongo.db.users.update_one(
            {"email": email},
            {
                "$unset": {
                    "reset_token": "",
                    "reset_token_expires": ""
                }
            }
        )
