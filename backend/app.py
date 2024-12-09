from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app, origins="*")
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure random key

# Helper function to connect to the SQLite database
def get_db_connection():
    conn = sqlite3.connect('hms.db')
    conn.row_factory = sqlite3.Row
    return conn

# Decorator for verifying the JWT token
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", 
                       (username, hashed_password))
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400
    finally:
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            token = jwt.encode({
                'user': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    finally:
        conn.close()

@app.route('/rooms', methods=['GET'])
@token_required
def get_rooms():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM rooms")
        rooms = cursor.fetchall()
        return jsonify([dict(room) for room in rooms])
    finally:
        conn.close()

@app.route('/rooms', methods=['POST'])
@token_required
def add_room():
    data = request.json
    number = data.get('number')
    type = data.get('type')
    price = data.get('price')

    if not all([number, type, price]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO rooms (number, type, price) VALUES (?, ?, ?)",
                       (number, type, price))
        conn.commit()
        return jsonify({"id": cursor.lastrowid, "number": number, "type": type, "price": price}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Room number already exists"}), 400
    finally:
        conn.close()

@app.route('/rooms/<int:id>', methods=['PUT'])
@token_required
def update_room(id):
    data = request.json
    number = data.get('number')
    type = data.get('type')
    price = data.get('price')

    if not all([number, type, price]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE rooms SET number = ?, type = ?, price = ? WHERE id = ?",
                       (number, type, price, id))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Room not found"}), 404
        return jsonify({"message": "Room updated successfully"}), 200
    finally:
        conn.close()

@app.route('/rooms/<int:id>', methods=['DELETE'])
@token_required
def delete_room(id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM rooms WHERE id = ?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Room not found"}), 404
        return jsonify({"message": "Room deleted successfully"}), 200
    finally:
        conn.close()

@app.route('/guests', methods=['GET'])
@token_required
def get_guests():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM guests")
        guests = cursor.fetchall()
        return jsonify([dict(guest) for guest in guests])
    finally:
        conn.close()

@app.route('/guests', methods=['POST'])
@token_required
def add_guest():
    data = request.json
    name = data.get('name')
    room_number = data.get('roomNumber')
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')

    if not all([name, room_number, check_in_date, check_out_date]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO guests (name, room_number, check_in_date, check_out_date) VALUES (?, ?, ?, ?)",
                       (name, room_number, check_in_date, check_out_date))
        conn.commit()
        return jsonify({"id": cursor.lastrowid, "name": name, "roomNumber": room_number, "checkInDate": check_in_date, "checkOutDate": check_out_date}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Failed to add guest"}), 400
    finally:
        conn.close()

@app.route('/guests/<int:id>', methods=['PUT'])
@token_required
def update_guest(id):
    data = request.json
    name = data.get('name')
    room_number = data.get('roomNumber')
    check_in_date = data.get('checkInDate')
    check_out_date = data.get('checkOutDate')

    if not all([name, room_number, check_in_date, check_out_date]):
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE guests SET name = ?, room_number = ?, check_in_date = ?, check_out_date = ? WHERE id = ?",
                       (name, room_number, check_in_date, check_out_date, id))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Guest not found"}), 404
        return jsonify({"message": "Guest updated successfully"}), 200
    finally:
        conn.close()

@app.route('/guests/<int:id>', methods=['DELETE'])
@token_required
def delete_guest(id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM guests WHERE id = ?", (id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"error": "Guest not found"}), 404
        return jsonify({"message": "Guest deleted successfully"}), 200
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect('hms.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password BLOB NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        price REAL NOT NULL
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        room_number TEXT NOT NULL,
        check_in_date TEXT NOT NULL,
        check_out_date TEXT NOT NULL
    )
    ''')

    conn.commit()
    conn.close()
    print("Database initialized successfully.")

init_db()

if __name__ == '__main__':
    app.run(debug=True)