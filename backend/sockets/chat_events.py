from flask import request
from flask_jwt_extended import decode_token
from models import User, Message
from jwt import ExpiredSignatureError, InvalidTokenError
from extensions import db, socketio
from flask_socketio import emit, disconnect


#TODO: figure out how to implement active users
active_users = {}


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
def handle_connect(auth):
    print("A user connected!")
    print('request.sid', request.sid)
    token = auth.get('token')

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
