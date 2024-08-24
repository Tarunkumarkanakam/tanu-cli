import typer
import os, sys
import binascii
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.config import save_user_details, prompt_for_master_password, edit_user_details, CONFIG_FILE, hash_password, load_config
from utils.storage import retrieve_all_passwords, delete_password_by_id
from utils.encryption import decrypt
from getpass import getpass

app = typer.Typer()

def ensure_setup():
    """Ensure the setup is done by checking the presence of the config file."""
    if not os.path.exists(CONFIG_FILE):
        typer.echo("No configuration file found. Starting setup...")
        name = typer.prompt("Enter your name")
        email = typer.prompt("Enter your email")
        master_password = getpass("Enter a master password")
        save_user_details(name, email, master_password)
        typer.echo("Setup complete.")

password_app = typer.Typer()

@password_app.command()
def ls():
    """List all stored passwords."""
    prompt_for_master_password()  # Require master password for access
    passwords = retrieve_all_passwords()
    if not passwords:
        typer.echo("No passwords found.")
    else:
        for password_entry in passwords:
            password_id, site, username, encrypted_password, encryption_type = password_entry
            typer.echo(f"ID: {password_id}\nSite: {site}\nUsername: {username}\nPassword: {'*****'}\nEncryption Type: {encryption_type}\n---")

@password_app.command()
def rm(password_id: str):
    """Delete a password by its ID."""
    prompt_for_master_password()  # Require master password for access
    success = delete_password_by_id(password_id)
    if success:
        typer.echo(f"Password with ID {password_id} deleted successfully.")
    else:
        typer.echo(f"No password found with ID {password_id}.")

@password_app.command()
def password(id: str):
    """View a specific password by ID."""
    prompt_for_master_password()  # Require master password for access
    config = load_config()
    master_password_hash = config['USER']['master_password_hash']
    key = binascii.unhexlify(master_password_hash)
    password_entry = retrieve_all_passwords()
    for entry in password_entry:
        if entry[0] == id:
            password_id, site, username, encrypted_password, encryption_type = entry
            decrypted_password = decrypt(encrypted_password, key)
            typer.echo(f"ID: {password_id}\nSite: {site}\nUsername: {username}\nPassword: {decrypted_password}\nEncryption Type: {encryption_type}")
            return
    typer.echo(f"No password found with ID {id}.")


app.add_typer(password_app, name="password")

@app.command("edit-user")
def edit_user():
    """Edit user details and master password."""
    edit_user_details()

if __name__ == "__main__":
    ensure_setup() 
    app()
