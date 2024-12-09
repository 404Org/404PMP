from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from shared.database import init_db
from shared.config import MONGO_URI, JWT_SECRET_KEY
from auth.routes import auth
from projects.routes import projects

app = Flask(__name__)
CORS(app)

# Configurations
app.config["MONGO_URI"] = MONGO_URI
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# Initialize database and JWT
init_db(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth)
app.register_blueprint(projects)

@app.route("/")
def home():
    return {"message": "Welcome to the Project Management Portal API"}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)