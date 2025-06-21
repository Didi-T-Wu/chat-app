import eventlet
eventlet.monkey_patch()

from flask import Flask, request
from flask_socketio import SocketIO, emit,send, disconnect, join_room, leave_room
from flask_cors import CORS
from flask_migrate import Migrate  # Import Flask-Migrate
from config import Config
from models import User, Message, connect_db, db
from uuid import uuid4
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, decode_token, JWTManager
from jwt import ExpiredSignatureError, InvalidTokenError

app = Flask(__name__)
app.config.from_object(Config)

socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)
connect_db(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


active_users = {} # Tracks logged in  users
# active_users[user.id] = {
#     "username": username,
#     "session_ids": [request.sid]  # Store all sessions for this user
# }
# prevent duplicates by tracking active users with user_id instead of request.sid.

@app.route('/')
def index():
    return "Flask Backend Running"

@app.route('/api/users/active', methods=['GET'])
def get_active_users():
    active_usernames = []
    for data in active_users.values():
        active_usernames.append(data['username'])
    print('active_usernames',active_usernames)
    return active_usernames, 200


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return  {'msg':"Missing username or password"}, 400

    user = User.query.filter_by(username =username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return  {'msg':"Invalid Credentials"}, 401

    # Generate JWT token
    access_token = create_access_token(identity=user.id)

    return {
        "msg": "Login successful",
        "token": access_token,
        "username": user.username
        }


@app.route('/api/signup', methods=['POST'])
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
        app.logger.error(f"Error registering user: {str(e)}")
        return {"msg": f"Error registering user: {str(e)}"}, 500

@app.route('/api/logout', methods=['POST'])
def logout():
    data = request.json
    username = data.get("username")
    sid = data.get("sid")

    print('username from /api/logout', username)
    print('sid from /api/logout', sid)
    if not username:
        return {"msg": "Missing username"}, 400

    for user_id, data in active_users.items():
        if sid in data['session_ids']:
            data['session_ids'].remove(sid)

            if not data['session_ids']:
                username = data['username']
                active_users.pop(user_id)
            break
    return {"msg": "logout successful"}

############socket##################


@socketio.on('logout')
def handle_logout():
    print('socket logout')
    # Manually disconnect the socket session
    disconnect(request.sid)


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    print(username + f' has entered room {room}')
    emit('join_room', {
                    'system': True,
                    'username': username,
                    'msg': f"{username} joined room {room}",
                    'room':room

                }, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    print(username + f' has left room {room}')
    emit('leave_room', {
                    'system': True,
                    'username': username,
                    'msg': f"{username} left room {room}, back to main",

                }, broadcast=True)
##TODO: need 'back to main ' event


@socketio.on('message')
def handle_message(data):
    print('in handle_message')
    username_from_frontend = data.get('username','')
    msg = data.get('msg',"").strip()

    if not username_from_frontend or not msg:
        emit('error', {'msg': 'Invalid user or empty message'}, to=request.sid)
        return

    # registered user, verify it and save the msg in the db
    cur_user = User.query.filter_by(username = username_from_frontend).one_or_none()

    if not cur_user:
        emit('error', {'msg': 'User not found'}, to=request.sid)
        return


    new_msg= Message(user_id = cur_user.id, text=msg)

    try:
        db.session.add(new_msg)
        db.session.commit()
    except Exception as e:
        print(f"Database error: {e}")
        db.session.rollback() # Undo the changes made during this session
        emit('error', {'msg': 'Failed to store message'}, to=request.sid)
        return
    ## TODO: set time format, need to be local time for the user
    dt = new_msg.created_at
    formatted_dt = dt.strftime("%Y-%m-%d %I:%M %p")


    print('new_msg created_at', new_msg.created_at)
    # print('active users',active_users)
    print(f"Message from {username_from_frontend}: {msg}")
    emit('new_message',{
        'system': False,
        'username':username_from_frontend,
        'msg':msg,
        'timeStamp':formatted_dt
        }, broadcast=True )

@socketio.on('connect')
def handle_connect():
    print("A user connected!")
    print('request.sid', request.sid)
    token = request.args.get('token') # Get the JWT token from the query params

    #if no token, emit an error and disconnect the user
    if not token:
        emit('auth_error', {'msg': 'No token provided'}, to=request.sid)
        socketio.disconnect(request.sid)  # Force disconnect
        return

    try:
        decoded_token = decode_token(token) # Manually decode JWT

        # Check if the decoded token has the expected fields
        if 'sub' not in decoded_token or 'exp' not in decoded_token:
            raise InvalidTokenError("Token is missing required claims.")

        user_uuid = decoded_token.get("sub")  # Extract user ID
        # user_uuid = UUID(identity)  ###### NO Convert back to UUID !!!!!!!
        user = User.query.filter_by(id = user_uuid).one_or_none()

        if user:
            username = user.username
            if user.id in active_users:
                active_users[user.id]['session_ids'].append(request.sid)
                print(f"Authenticated user {username} connected again with session {request.sid}")
            else:
                active_users[user.id] = {
                    "username": username,
                    'session_ids': [request.sid]
                }
                print(f"Authenticated user {username} connected with session {request.sid}")
                # Emit "user_joined" only the first time the user connects
                emit('user_joined', {
                    'system': True,
                    'username': user.username,
                    'msg': f"{user.username} joined the chat"
                }, broadcast=True)
        else:
            emit('auth_error', {'msg': 'Invalid token, user not found'}, to=request.sid)
            disconnect(request.sid)
            return
        db.session.commit()  # Commit the changes
    except ExpiredSignatureError:
        emit('auth_error', {'msg': 'Token expired, please log in again'}, to=request.sid)
        disconnect(request.sid)
        return
    except InvalidTokenError as e:
        emit('auth_error', {'msg': str(e)}, to=request.sid)
        disconnect(request.sid)
        return
    except Exception as e:
        print(f"JWT verification failed: {e}")
        emit('auth_error', {'msg': 'Invalid token'}, to=request.sid)
        disconnect(request.sid)
        return
    finally:
        db.session.remove()  # Close the session


@socketio.on('disconnect')
def handle_disconnect():
    print('A user disconnected')

    for user_id, data in active_users.items():
        if request.sid in data['session_ids']:
            data['session_ids'].remove(request.sid)
            if not data['session_ids']:
                username = data['username']
                active_users.pop(user_id)
                emit('user_left', {'system': True, 'msg': f"{username} left the chat"}, broadcast=True)
                print(f"User {username} ({user_id}) disconnected from active users!")
                print(active_users)
            break

    # Manually disconnect the socket session
    # disconnect()
    # print(f"Manually disconnected socket for SID {request.sid}")


if __name__ == '__main__':
    socketio.run(app, debug=True, host="localhost", port=5001)