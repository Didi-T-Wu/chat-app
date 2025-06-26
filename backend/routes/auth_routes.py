from flask import Blueprint, request
from models import User
from uuid import uuid4
from extensions import bcrypt, db
from flask_jwt_extended import create_access_token

#TODO: 1. implement logout
#      2. may implement JWT blacklist later
auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return  {'msg':"Missing username or password"}, 400

    user = User.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return  {'msg':"Invalid Credentials"}, 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)

    return {
        "msg": "Login successful",
        "token": access_token,
        "username": user.username
        }

@auth_bp.route('/signup', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return {"msg":"Missing username or password"}, 400

    existing_user = User.query.filter_by(username=username).first()

    if existing_user:
        return {"msg":"Username already taken"}, 400

    user_uuid = str(uuid4())
    hashed_password = bcrypt.generate_password_hash(password).decode('utf8')
    new_user = User(id=user_uuid, username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        print('new_user from /api/signup', new_user)
        db.session.flush()  # Ensure the new user is flushed to the DB
        db.session.commit()
        print('new_user.id from /api/signup', new_user.id)
        # Generate JWT token
        access_token = create_access_token(identity=new_user.id)
        print('access_token from /api/signup', access_token)

        return {
            "msg": "User registered successfully",
            "token": access_token,
            "username": new_user.username
            }, 201

    except Exception as e:
        print("Exception occurred from /api/signup", str(e))
        # Rollback if there's any error
        db.session.rollback()
        # Log error and return an appropriate message
        ###############TODO: review code below
        # app.logger.error(f"Error registering user: {str(e)}")
        return {"msg": f"Error registering user: {str(e)}"}, 500



