from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from shared.database import init_db
from shared.config import MONGO_URI, JWT_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRES
from auth.routes import auth
from projects.routes import projects
from users.routes import users
from comments.routes import comments
from notifications.routes import notifications
from knowledge_base.routes import knowledge_base

app = Flask(__name__)
# Simple CORS configuration
CORS(app, resources={r"/*": {"origins": "*"}})

# Configurations
app.config["MONGO_URI"] = MONGO_URI
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

# Initialize database and JWT
init_db(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(projects)
app.register_blueprint(users)
app.register_blueprint(comments)
app.register_blueprint(notifications)
app.register_blueprint(knowledge_base)

@app.route("/")
def home():
    return {"message": "Welcome to the Project Management Portal API"}

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)