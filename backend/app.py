import eventlet
eventlet.monkey_patch()

from flask import Flask
from config import Config
from routes import register_routes
from sockets import register_socket_events
from extensions import bcrypt, db, socketio, jwt, migrate, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    #Initialise extensions
    bcrypt.init_app(app)
    db.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    #Register blueprints
    register_routes(app)
    register_socket_events(socketio)


    @app.route('/')
    def index():
        return "Flask Backend Running"

    return app

app = create_app()
if __name__ == '__main__':

    socketio.run(app, debug=True, host="localhost", port=5001)
