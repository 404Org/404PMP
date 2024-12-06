from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    if not app.config.get("MONGO_URI"):
        raise Exception("MONGO_URI configuration is missing")
    
    mongo.init_app(app)
    
    # Test the connection by attempting a simple operation
    try:
        # Ping the database to verify the connection
        mongo.db.command('ping')
    except Exception as e:
        raise Exception(f"Failed to initialize the database connection: {str(e)}")
    
    return mongo
