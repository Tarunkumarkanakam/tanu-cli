import sqlite3
import secrets

def store_password(site: str, username: str, encrypted_password: bytes, encryption_type: str, db_path: str = "passwords.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS passwords (
            id TEXT PRIMARY KEY,
            site TEXT,
            username TEXT,
            password BLOB,
            encryption_type TEXT
        )
    """)
    password_id = secrets.token_hex(8)
    cursor.execute("""
        INSERT INTO passwords (id, site, username, password, encryption_type) 
        VALUES (?, ?, ?, ?, ?)
    """, (password_id, site, username, encrypted_password, encryption_type))
    conn.commit()
    conn.close()
    return password_id

def retrieve_all_passwords(db_path: str = "passwords.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT id, site, username, password, encryption_type FROM passwords")
    results = cursor.fetchall()
    conn.close()
    return results

def delete_password_by_id(password_id: str, db_path: str = "passwords.db"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM passwords WHERE id = ?", (password_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted
