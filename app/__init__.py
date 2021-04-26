from flask import Flask
from flask_wtf.csrf import CSRFProtect
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from .config import Config

app = Flask(__name__)
csrf = CSRFProtect(app)

db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
obj = Config
if obj.SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
    obj.SQLALCHEMY_DATABASE_URI = obj.SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
app.config.from_object(obj)
from app import views