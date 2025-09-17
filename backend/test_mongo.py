from flask_pymongo import PyMongo
from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)

try:
    # Try to fetch one document from a test or system collection
    db_names = mongo.cx.list_database_names()
    print("✅ Successfully connected to MongoDB Atlas!")
    print("Databases available:", db_names)
except Exception as e:
    print("❌ Could not connect to MongoDB Atlas.")
    print("Error:", e)
