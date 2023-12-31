from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from app.routes.routes import main_blueprint

# Initialize Flask and its extensions
app = Flask(__name__)
app.config.from_object('config.Config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Initialize CORS with specific settings
if app.config['FLASK_ENV'] == 'development':
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
else:
    CORS(app, resources={r"/api/*": {"origins": "https://your-production-domain.com"}})


# User loader function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    from app.models.users import User  # Import here to avoid circular dependency
    return User.query.get(int(user_id))


# Register blueprints
app.register_blueprint(main_blueprint)

if __name__ == '__main__':
    app.run(debug=True)
