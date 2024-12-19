from datetime import datetime
from bson import ObjectId
from shared.database import mongo
from marshmallow import Schema, fields, validate

class NotificationSchema(Schema):
    _id = fields.Str(dump_only=True)
    user_id = fields.Str(required=True)
    type = fields.Str(required=True, validate=validate.OneOf([
        'project_added', 'project_comment', 'comment_reply', 'new_project'
    ]))
    content = fields.Str(required=True)
    reference_id = fields.Str(required=True)  # Project ID or Comment ID
    is_read = fields.Bool(default=False)
    created_at = fields.DateTime(dump_only=True)

class Notification:
    schema = NotificationSchema()

    @staticmethod
    def create_notification(user_id, type, content, reference_id):
        notification = {
            'user_id': ObjectId(user_id),
            'type': type,
            'content': content,
            'reference_id': reference_id,
            'is_read': False,
            'created_at': datetime.utcnow()
        }
        result = mongo.db.notifications.insert_one(notification)
        return str(result.inserted_id)

    @staticmethod
    def get_user_notifications(user_id):
        notifications = list(mongo.db.notifications.find(
            {'user_id': ObjectId(user_id)}
        ).sort('created_at', -1))
        
        # Convert ObjectIds to strings
        for notification in notifications:
            notification['_id'] = str(notification['_id'])
            notification['user_id'] = str(notification['user_id'])
        
        return notifications

    @staticmethod
    def mark_as_read(notification_id, user_id):
        return mongo.db.notifications.update_one(
            {
                '_id': ObjectId(notification_id),
                'user_id': ObjectId(user_id)
            },
            {'$set': {'is_read': True}}
        )

    @staticmethod
    def mark_all_as_read(user_id):
        return mongo.db.notifications.update_many(
            {'user_id': ObjectId(user_id)},
            {'$set': {'is_read': True}}
        )

    @staticmethod
    def delete_notification(notification_id, user_id):
        return mongo.db.notifications.delete_one({
            '_id': ObjectId(notification_id),
            'user_id': ObjectId(user_id)
        })