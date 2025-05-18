import os
from dotenv import load_dotenv

if os.getenv("FLASK_ENV") == "development":
    load_dotenv()

# Load environment variables from .env file if in development mode
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')
    if not SECRET_KEY:
        raise RuntimeError("SECRET_KEY environment variable is not set. Exiting...")

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL','postgresql:///chat_app')
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL environment variable is not set. Exiting...")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt_secret_key")  # Change in production
    if not JWT_SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY environment variable is not set. Exiting...")

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "openai_api_key")
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY environment variable is not set. Exiting...")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SOCKETIO_CORS_ALLOWED_ORIGINS = "*"

    # Add port from environment variable, default to 5001 for local
    PORT = int(os.getenv("PORT", 5001))  # Use the Render-assigned port or 5001 locally