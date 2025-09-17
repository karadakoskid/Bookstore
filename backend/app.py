from flask import Flask, request, jsonify, render_template_string, redirect, url_for, session
from flask_pymongo import PyMongo
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# --- SESSION & CORS CONFIG FOR CROSS-ORIGIN AUTH ---
# Use HTTPS and correct SameSite policy for production/cloud (like Render)
app.config.update(
    SESSION_COOKIE_SAMESITE="None",   # allow cross-site cookies
    SESSION_COOKIE_SECURE=False       # not required for local development
)
# Allow both local and deployed frontend origins (including Render)
# Get frontend URL from environment variable for production
frontend_urls = [
    "http://localhost:3000",
    "http://localhost:3001", 
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
]

# Add production frontend URL if available
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    frontend_urls.append(frontend_url)
    frontend_urls.append(frontend_url.replace("http://", "https://"))  # Add HTTPS version

CORS(app, supports_credentials=True, origins=frontend_urls)

# MongoDB configuration with error handling
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    print("ERROR: MONGO_URI environment variable is not set!")
    raise ValueError("MONGO_URI environment variable is required")

app.config["MONGO_URI"] = mongo_uri
app.secret_key = os.getenv("SECRET_KEY", "supersecret")

# Initialize MongoDB with error handling
try:
    mongo = PyMongo(app)
    print(f"MongoDB connection initialized successfully")
except Exception as e:
    print(f"ERROR: Failed to initialize MongoDB: {e}")
    raise

def logged_in():
    return "username" in session

def get_current_user():
    return session.get("username")

# ----------------- API: User Authentication -----------------
@app.route("/api/register", methods=["POST"])
def api_register():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400
        
        # Check if username exists
        if mongo.db.users.find_one({"username": username}):
            return jsonify({"error": "Username already taken!"}), 400
        
        # Create new user
        user_id = mongo.db.users.insert_one({
            "username": username,
            "password": generate_password_hash(password)
        }).inserted_id
        
        return jsonify({"message": "User registered successfully!"}), 201
        
    except Exception as e:
        print(f"ERROR in register endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = mongo.db.users.find_one({"username": username})
    if user and check_password_hash(user["password"], password):
        session["username"] = username
        return jsonify({"message": "Logged in!", "username": username})
    return jsonify({"error": "Invalid credentials!"}), 401

@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("username", None)
    return jsonify({"message": "Logged out!"})

@app.route("/api/me", methods=["GET"])
def api_me():
    if not logged_in():
        return jsonify({"username": None})
    return jsonify({"username": get_current_user()})

# ----------------- API: Book CRUD -----------------

@app.route("/api/books", methods=["GET"])
def api_list_books():
    books = list(mongo.db.books.find())
    for book in books:
        book["_id"] = str(book["_id"])
    return jsonify(books)

@app.route("/api/books", methods=["POST"])
def api_add_book():
    if not logged_in():
        return jsonify({"error": "Login required!"}), 401
    
    data = request.json
    title = data.get("title")
    author = data.get("author")
    genre = data.get("genre")
    description = data.get("description")
    image_url = data.get("image_url", "")
    
    if not title or not author or not genre or not description:
        return jsonify({"error": "Missing required fields!"}), 400
    
    book_id = mongo.db.books.insert_one({
        "title": title,
        "author": data.get("author"),
        "uploader": get_current_user(),
        "genre": genre,
        "description": description,
        "image_url": image_url
    }).inserted_id
    
    return jsonify({"message": "Book added successfully!", "id": str(book_id)}), 201

@app.route("/api/books/<book_id>", methods=["PUT"])
def api_edit_book(book_id):
    if not logged_in():
        return jsonify({"error": "Login required!"}), 401
    
    data = request.json
    
    # Verify user owns this book
    book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"error": "Book not found!"}), 404
    
    if book["uploader"] != get_current_user():
        return jsonify({"error": "Permission denied!"}), 403
    
    update_data = {
        "title": data.get("title"),
        "author": data.get("author"),
        "genre": data.get("genre"),
        "description": data.get("description"),
        "image_url": data.get("image_url", "")
    }
    
    mongo.db.books.update_one(
        {"_id": ObjectId(book_id)},
        {"$set": update_data}
    )
    
    return jsonify({"message": "Book updated successfully!"})

@app.route("/api/books/<book_id>", methods=["DELETE"])
def api_delete_book(book_id):
    if not logged_in():
        return jsonify({"error": "Login required!"}), 401
    
    # Verify user owns this book
    book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"error": "Book not found!"}), 404
    
    if book["uploader"] != get_current_user():
        return jsonify({"error": "Permission denied!"}), 403
    
    mongo.db.books.delete_one({"_id": ObjectId(book_id)})
    
    return jsonify({"message": "Book deleted successfully!"})

@app.route("/api/books/<book_id>", methods=["GET"])
def api_get_book(book_id):
    book = mongo.db.books.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"error": "Book not found!"}), 404
    
    book["_id"] = str(book["_id"])
    return jsonify(book)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
