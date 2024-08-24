import configparser
import os
import hashlib
import binascii
import typer
from getpass import getpass

CONFIG_FILE = "tanu_cli_config.ini"
SALT = b'lisdfsbdflkjb68416fs5b1s6f5b1'  # Use a secure salt value, ideally generated with os.urandom

def create_config():
    config = configparser.ConfigParser()
    config['USER'] = {
        'name': '',
        'email': '',
        'master_password_hash': ''
    }
    with open(CONFIG_FILE, 'w') as configfile:
        config.write(configfile)

def load_config():
    config = configparser.ConfigParser()
    if not os.path.exists(CONFIG_FILE):
        create_config()
    config.read(CONFIG_FILE)
    return config

def hash_password(password: str, salt: bytes = SALT, length: int = 16) -> str:
    """Hash the master password using PBKDF2 and produce a key of the specified length."""
    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, dklen=length)
    return binascii.hexlify(key).decode()

def save_user_details(name: str, email: str, master_password: str):
    config = load_config()
    master_password_hash = hash_password(master_password)
    config['USER']['name'] = name
    config['USER']['email'] = email
    config['USER']['master_password_hash'] = master_password_hash
    with open(CONFIG_FILE, 'w') as configfile:
        config.write(configfile)

def prompt_for_master_password():
    config = load_config()
    stored_password_hash = config['USER']['master_password_hash']
    master_password = getpass("Enter master password: ")
    master_password_hash = hash_password(master_password)
    if master_password_hash != stored_password_hash:
        typer.echo("Incorrect master password!")
        raise typer.Exit()

def edit_user_details():
    config = load_config()
    name = typer.prompt("Enter your name", default=config['USER']['name'])
    email = typer.prompt("Enter your email", default=config['USER']['email'])
    master_password = getpass("Enter a new master password (leave blank to keep current): ")
    if master_password:
        save_user_details(name, email, master_password)
    else:
        save_user_details(name, email, config['USER']['master_password_hash'])
    typer.echo("User details updated.")
