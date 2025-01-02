from datetime import datetime
from bson import ObjectId
from shared.database import mongo
from marshmallow import Schema, fields, validate

class ProjectSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(
        ['upcoming', 'in_progress', 'completed', 'on_hold']
    ))
    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)
    tech_stack = fields.List(fields.Str(), required=True)
    team_members = fields.List(fields.Dict(), required=True)  # List of user details
    project_manager = fields.Dict(required=True)  # Changed to Dict for full user details
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    interested_users = fields.List(fields.Dict(), dump_default=[])  # New field for interested users

class Project:
    schema = ProjectSchema()
    
    @staticmethod
    def create_project(data):
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        result = mongo.db.projects.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_all_projects():
        return list(mongo.db.projects.find())
    
    @staticmethod
    def get_project_by_id(project_id):
        return mongo.db.projects.find_one({'_id': ObjectId(project_id)})
    
    @staticmethod
    def update_project(project_id, data):
        """
        If data contains a $push operation, handle it differently from regular updates
        """
        if any(key.startswith('$') for key in data.keys()):
            # This is an update operation (like $push)
            return mongo.db.projects.update_one(
                {'_id': ObjectId(project_id)},
                data  # data already contains the update operator
            )
        else:
            # This is a regular update
            data['updated_at'] = datetime.utcnow()
            return mongo.db.projects.update_one(
                {'_id': ObjectId(project_id)},
                {'$set': data}  # wrap regular updates in $set
            )
    
    @staticmethod
    def delete_project(project_id):
        return mongo.db.projects.delete_one({'_id': ObjectId(project_id)})
    
    @staticmethod
    def get_projects_by_member(user_id):
        return list(mongo.db.projects.find({'team_members': user_id})) 

    @staticmethod
    def add_interested_user(project_id, user_details):
        """Add a user to the project's interested list"""
        return mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$push': {'interested_users': user_details}}
        )

    @staticmethod
    def remove_interested_user(project_id, user_id):
        """Remove a user from the project's interested list"""
        return mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'interested_users': {'user_id': user_id}}}
        )

    @staticmethod
    def accept_interested_user(project_id, user_details):
        """Accept an interested user by adding them to team members and removing from interested list"""
        return mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {
                '$push': {'team_members': user_details},
                '$pull': {'interested_users': {'user_id': user_details['user_id']}}
            }
        )

    @staticmethod
    def reject_interested_user(project_id, user_id):
        """Reject an interested user by removing them from interested list"""
        return mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$pull': {'interested_users': {'user_id': user_id}}}
        )

    @staticmethod
    def is_user_interested(project, user_id):
        """Check if a user is already in the interested list"""
        interested_users = project.get('interested_users', [])
        return any(u['user_id'] == user_id for u in interested_users)

    @staticmethod
    def get_interested_user(project, user_id):
        """Get user details from interested list"""
        interested_users = project.get('interested_users', [])
        return next((u for u in interested_users if u['user_id'] == user_id), None) 