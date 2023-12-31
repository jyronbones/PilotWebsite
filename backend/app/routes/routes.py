from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user
from app.models.users import User, db

main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Missing username or password'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@main_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


@main_blueprint.route('/logout', methods=['GET'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200