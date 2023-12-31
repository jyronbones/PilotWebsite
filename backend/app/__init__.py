from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from flask_migrate import Migrate

# Initialize SQLAlchemy
db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize Flask extensions
    db.init_app(app)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    # Initialize Flask-CORS with specific settings
    if app.config['FLASK_ENV'] == 'development':
        CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    else:
        CORS(app, resources={r"/api/*": {"origins": "https://your-production-domain.com"}})

    # Import the User model
    from app.models.users import User

    # User loader function for Flask-Login
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register your blueprints here
    from app.routes.routes import main_blueprint
    app.register_blueprint(main_blueprint)

    return app
