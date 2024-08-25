
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.storage import store_password, retrieve_all_passwords, delete_password_by_id
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from utils.storage import retrieve_all_passwords, delete_password_by_id, store_password
from utils.encryption import encrypt, decrypt
from utils.config import hash_password, load_config
import binascii

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def get_encryption_key():
    config = load_config()
    master_password_hash = config['USER']['master_password_hash']
    key = binascii.unhexlify(master_password_hash)
    return key


@app.route('/')
def index():
    return "Password Manager API is running."

# Serve the test HTML files
@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/welcome')
def welcome():
    return render_template('welcome.html')

@app.route('/passwords', methods=['GET'])
def list_passwords():
    """API endpoint to list all passwords."""
    passwords = retrieve_all_passwords()
    if not passwords:
        return jsonify({"status": "error", "message": "No passwords found"}), 404
    password_list = []
    for password_entry in passwords:
        password_id, site, username, encrypted_password, encryption_type = password_entry
        password_list.append({
            "id": password_id,
            "site": site,
            "username": username,
            "password": "*****",  # Masked password for security
            "encryption_type": encryption_type
        })
    return jsonify(password_list), 200

@app.route('/passwords/<password_id>', methods=['GET'])
def view_password(password_id):
    """API endpoint to view a specific password by ID."""
    key = get_encryption_key()
    passwords = retrieve_all_passwords()
    for entry in passwords:
        if entry[0] == password_id:
            password_id, site, username, encrypted_password, encryption_type = entry
            decrypted_password = decrypt(encrypted_password, key)
            return jsonify({
                "id": password_id,
                "site": site,
                "username": username,
                "password": decrypted_password,
                "encryption_type": encryption_type
            }), 200
    return jsonify({"status": "error", "message": f"No password found with ID {password_id}"}), 404

@app.route('/passwords/<password_id>', methods=['DELETE'])
def delete_password(password_id):
    """API endpoint to delete a specific password by ID."""
    success = delete_password_by_id(password_id)
    if success:
        return jsonify({"status": "success", "message": f"Password with ID {password_id} deleted successfully."}), 200
    else:
        return jsonify({"status": "error", "message": f"No password found with ID {password_id}"}), 404

@app.route('/passwords', methods=['POST'])
def store_password_endpoint():
    """API endpoint to store a new password."""
    data = request.json
    site = data['site']
    username = data['username']
    password = data['password']
    encryption_type = "AES-256"  # Assuming AES-256 is used
    key = get_encryption_key()
    encrypted_password = encrypt(password, key)
    password_id = store_password(site, username, encrypted_password, encryption_type)
    return jsonify({"status": "success", "id": password_id}), 201

if __name__ == "__main__":
    app.run(port=5000)
