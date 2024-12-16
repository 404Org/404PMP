from datetime import datetime
from bson import ObjectId
from marshmallow import Schema, fields, validate
from shared.database import mongo

class ReplySchema(Schema):
    id = fields.Str(dump_only=True)
    user_id = fields.Str(required=True)
    text = fields.Str(required=True, validate=validate.Length(min=1))
    user_name = fields.Str(required=True)
    user_email = fields.Str(required=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class CommentSchema(Schema):
    _id = fields.Str(dump_only=True)
    project_id = fields.Str(required=True)
    user_id = fields.Str(required=True)
    text = fields.Str(required=True, validate=validate.Length(min=1))
    user_name = fields.Str(required=True)
    user_email = fields.Str(required=True)
    replies = fields.List(fields.Nested(ReplySchema()), dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class Comment:
    schema = CommentSchema()
    reply_schema = ReplySchema()

    @staticmethod
    def create_comment(project_id, user_id, text, user_data):
        comment_data = {
            'project_id': ObjectId(project_id),
            'user_id': ObjectId(user_id),
            'text': text,
            'user_name': user_data.get('name'),
            'user_email': user_data.get('email'),
            'replies': [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        result = mongo.db.comments.insert_one(comment_data)
        return str(result.inserted_id)

    @staticmethod
    def add_reply(comment_id, user_id, text, user_data):
        reply = {
            'id': str(ObjectId()),
            'user_id': ObjectId(user_id),
            'text': text,
            'user_name': user_data.get('name'),
            'user_email': user_data.get('email'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        return mongo.db.comments.update_one(
            {'_id': ObjectId(comment_id)},
            {'$push': {'replies': reply}}
        )

    @staticmethod
    def get_comments_by_project(project_id):
        comments = list(mongo.db.comments.find(
            {'project_id': ObjectId(project_id)}
        ).sort('created_at', -1))

        # Convert ObjectIds to strings for each comment and its replies
        for comment in comments:
            comment['_id'] = str(comment['_id'])
            comment['project_id'] = str(comment['project_id'])
            comment['user_id'] = str(comment['user_id'])
            for reply in comment.get('replies', []):
                reply['user_id'] = str(reply['user_id'])
        
        return comments

    @staticmethod
    def delete_comment(comment_id):
        return mongo.db.comments.delete_one({'_id': ObjectId(comment_id)})

    @staticmethod
    def update_comment(comment_id, user_id, text):
        return mongo.db.comments.update_one(
            {
                '_id': ObjectId(comment_id),
                'user_id': ObjectId(user_id)
            },
            {
                '$set': {
                    'text': text,
                    'updated_at': datetime.utcnow()
                }
            }
        )

    @staticmethod
    def delete_reply(comment_id, reply_id, user_id):
        return mongo.db.comments.update_one(
            {'_id': ObjectId(comment_id)},
            {'$pull': {'replies': {'id': reply_id}}}
        )

    @staticmethod
    def update_reply(comment_id, reply_id, user_id, text):
        return mongo.db.comments.update_one(
            {
                '_id': ObjectId(comment_id),
                'replies': {
                    '$elemMatch': {
                        'id': reply_id,
                        'user_id': ObjectId(user_id)
                    }
                }
            },
            {
                '$set': {
                    'replies.$.text': text,
                    'replies.$.updated_at': datetime.utcnow()
                }
            }
        )

    @staticmethod
    def get_comment(comment_id):
        return mongo.db.comments.find_one({'_id': ObjectId(comment_id)})

    @staticmethod
    def get_user_by_email(email):
        """Retrieve a specific user by ID"""
        return mongo.db.users.find_one(
            {"email": email},
            {"password": 0, "reset_token": 0, "reset_token_expires": 0}
        )
