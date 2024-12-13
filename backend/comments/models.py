from datetime import datetime
from bson import ObjectId
from marshmallow import Schema, fields, validate
from shared.database import mongo

class CommentSchema(Schema):
    _id = fields.Str(dump_only=True)
    project_id = fields.Str(required=True)
    user_id = fields.Str(required=True)
    text = fields.Str(required=True, validate=validate.Length(min=1))
    created_at = fields.DateTime(dump_only=True)

class Comment:
    schema = CommentSchema()

    @staticmethod
    def create_comment(project_id, user_id, text, user_data):
        comment_data = {
            'project_id': ObjectId(project_id),
            'user_id': ObjectId(user_id),
            'text': text,
            'user_name': user_data.get('name'),
            'user_email': user_data.get('email'),
            'created_at': datetime.utcnow()
        }
        result = mongo.db.comments.insert_one(comment_data)
        return str(result.inserted_id)

    @staticmethod
    def get_comments_by_project(project_id):
        return list(mongo.db.comments.find(
            {"project_id": ObjectId(project_id)}
        ).sort("created_at", -1))  # Sort by newest first

    @staticmethod
    def delete_comment(comment_id, user_id):
        # Only allow deletion if user is the comment author
        return mongo.db.comments.delete_one({
            "_id": ObjectId(comment_id),
            "user_id": ObjectId(user_id)
        })

    @staticmethod
    def update_comment(comment_id, data):
        data['updated_at'] = datetime.utcnow()
        return mongo.db.comments.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": data}
        )


    @staticmethod
    def get_user_by_email(email):
        """Retrieve a specific user by ID"""
        return mongo.db.users.find_one(
            {"email": email},
            {"password": 0, "reset_token": 0, "reset_token_expires": 0}
        )
