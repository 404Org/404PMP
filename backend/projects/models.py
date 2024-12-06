from datetime import datetime
from bson import ObjectId
from shared.database import mongo
from marshmallow import Schema, fields, validate

class ProjectSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=100))
    description = fields.Str(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(
        ['planning', 'in_progress', 'completed', 'on_hold']
    ))
    start_date = fields.DateTime(required=True)
    end_date = fields.DateTime(required=True)
    tech_stack = fields.List(fields.Str(), required=True)
    team_members = fields.List(fields.Str(), required=True)  # List of user IDs
    project_manager = fields.Str(required=True)  # User ID of project manager
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

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
        data['updated_at'] = datetime.utcnow()
        return mongo.db.projects.update_one(
            {'_id': ObjectId(project_id)},
            {'$set': data}
        )
    
    @staticmethod
    def delete_project(project_id):
        return mongo.db.projects.delete_one({'_id': ObjectId(project_id)})
    
    @staticmethod
    def get_projects_by_member(user_id):
        return list(mongo.db.projects.find({'team_members': user_id})) 