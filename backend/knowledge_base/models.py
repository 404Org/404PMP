from datetime import datetime
from bson import ObjectId
from shared.database import mongo
from marshmallow import Schema, fields, validate

class KnowledgeBaseItemSchema(Schema):
    _id = fields.Str(dump_only=True)
    project_id = fields.Str(required=True)
    name = fields.Str(required=True)
    type = fields.Str(required=True, validate=validate.OneOf(['link', 'file']))
    url = fields.Str(required=True)  # For links or file paths
    file_type = fields.Str(allow_none=True)  # For files: pdf, doc, ppt, etc.
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    created_by = fields.Dict(required=True)  # User who created the item

class KnowledgeBase:
    schema = KnowledgeBaseItemSchema()
    
    @staticmethod
    def create_item(data):
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        result = mongo.db.knowledge_base.insert_one(data)
        return str(result.inserted_id)
    
    @staticmethod
    def get_project_items(project_id):
        return list(mongo.db.knowledge_base.find({'project_id': project_id}))
    
    @staticmethod
    def get_item(item_id):
        return mongo.db.knowledge_base.find_one({'_id': ObjectId(item_id)})
    
    @staticmethod
    def update_item(item_id, data):
        data['updated_at'] = datetime.utcnow()
        return mongo.db.knowledge_base.update_one(
            {'_id': ObjectId(item_id)},
            {'$set': data}
        )
    
    @staticmethod
    def delete_item(item_id):
        return mongo.db.knowledge_base.delete_one({'_id': ObjectId(item_id)})