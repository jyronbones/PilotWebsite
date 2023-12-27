from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    from app.routes.routes import main_blueprint  # Import the blueprint from the correct location

    app.register_blueprint(main_blueprint)  # Register your blueprint here

    return app
