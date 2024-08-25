
# 🔒 TanuCLI - Password Manager

## Summary

Imagine you have a special box 🗃️ where you can keep all your secret codes. This box is very smart—it helps you create super strong codes that no one can guess and keeps them safe so only you can use them. TanuCLI is just like that smart box, but for your passwords. It keeps your passwords safe, helps you create new ones, and makes sure only you can see them! 🌟

## Overview

The **TanuCLI Password Manager** is a command-line tool that allows you to securely generate, store, and manage passwords. It’s designed to be simple yet powerful, making sure your passwords are always safe and accessible when you need them. The password manager works with a Flask API backend and includes a CLI tool for easy management. It even comes with sample pages for testing, so you can see how it works in action.

## Features

- 🔐 **Strong Password Generation**: Generate secure, random passwords instantly.
- 🛡️ **Master Password Protection**: Keep your vault safe with a master password, similar to `sudo` access in Linux.
- 💻 **CLI Integration**: Manage your passwords directly from the terminal with easy-to-use CLI commands.
- ⚙️ **Configuration Management**: A `.ini` file is created after setup to store essential settings securely.
- 🌐 **Flask API Backend**: A robust API that securely manages your passwords.
- 🧪 **Testing Support**: Includes sample HTML pages for testing signup and login functionalities.

## Installation

### 1. Clone the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/tanu-cli.git
cd tanucli
```

### 2. Set Up the Python Environment

Ensure you have Python 3.x installed. Then, create a virtual environment and install the required dependencies:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scriptsctivate`
pip install -r requirements.txt
```

### 3. Set Up the Flask API

The Flask API serves as the backend for managing passwords. Before running the API, make sure you have the necessary HTML templates in place for testing:

- **Templates:**
  - `signup.html`
  - `login.html`
  - `welcome.html`

Place these HTML files inside a `templates` folder under `cli_app/api`.

### 4. Run the Flask API

Start the Flask API by navigating to the `cli_app/api` directory and running:

```bash
python flask_server.py
```

The server will start running on `http://127.0.0.1:5000`. You can test the setup by visiting `http://127.0.0.1:5000/signup` or `http://127.0.0.1:5000/login`.

## Usage

### Running the Flask API

To start the Flask API, use the command mentioned above. The API will securely store, retrieve, and manage your passwords, and serves as the backend for the CLI and the optional browser extension.

### Using the CLI

The CLI is your main tool for interacting with the TanuCLI Password Manager. Here’s how to set it up and use it.

#### Setting Up the CLI

1. **First-Time Setup**:
   - The first time you run the CLI, it will walk you through a setup process. During this process, you’ll create a **master password**. This master password is crucial because it’s used to encrypt and decrypt all your stored passwords.

   ```bash
   python cli_app/cli/commands.py
   ```
   - This uses typer under the hood, so typer help also works.
   ```bash
   python cli_app/cli/commands.py --help
   ```

2. **Configuration File**:
   - Once the setup is complete, a configuration file named `tanu_cli_config.ini` is created in the root directory. This file securely stores the hashed master password and other essential settings.

#### Master Password Security

- **Sudo-like Access**:
  - Whenever you use a command that requires access to your stored passwords (like viewing or deleting them), the CLI will prompt you to enter your master password. This ensures that only authorized users can access or modify the stored passwords.

  **Example**:

  ```bash
  python cli_app/cli/commands.py password 12345
  # Prompt: Enter your master password:
  ```

#### CLI Commands

Here’s a list of commands you can use with the TanuCLI Password Manager:

1. **`password ls`**  
   Lists all saved passwords in a table format.

   ```bash
   python cli_app/cli/commands.py password ls
   ```

2. **`password {id}`**  
   View details of a specific password by its ID. The command will ask for your master password before displaying the details.

   ```bash
   python cli_app/cli/commands.py password 12345
   ```

3. **`password rm {id}`**  
   Delete a specific password by its ID. You will be prompted for your master password before the deletion.

   ```bash
   python cli_app/cli/commands.py password rm 12345
   ```

4. **`setup`**  
   Re-run the setup process if you need to change your master password or reconfigure the CLI.

   ```bash
   python cli_app/cli/commands.py setup
   ```

### Testing the Password Manager

The Flask API also provides test pages to simulate signup and login scenarios. This helps you verify that the password manager is working as expected.

1. **Testing API Availability**:
   - Visit `http://127.0.0.1:5000/` in your browser. You should see the message: `"Password Manager API is running."`

2. **Testing Signup and Login Pages**:
   - **Signup Page**: Go to `http://127.0.0.1:5000/signup`. This page lets you simulate creating an account. The page captures the password, which you can then save using the TanuCLI Password Manager.
   - **Login Page**: Visit `http://127.0.0.1:5000/login`. This page simulates a login process and will suggest saved credentials, making it easy to test the autofill functionality.

## API Documentation

The Flask API provides several endpoints for interacting with the password manager.

### Endpoints

1. **`GET /passwords`**  
   Lists all stored passwords.

   **Response Example**:

   ```json
   [
       {
           "id": "12345",
           "site": "example.com",
           "username": "user@example.com",
           "password": "*****",
           "encryption_type": "AES-256"
       }
   ]
   ```

2. **`GET /passwords/{password_id}`**  
   Retrieves a specific password by its ID.

   **Response Example**:

   ```json
   {
       "id": "12345",
       "site": "example.com",
       "username": "user@example.com",
       "password": "securepassword",
       "encryption_type": "AES-256"
   }
   ```

3. **`DELETE /passwords/{password_id}`**  
   Deletes a specific password by its ID.

   **Response Example**:

   ```json
   {
       "status": "success",
       "message": "Password with ID 12345 deleted successfully."
   }
   ```

4. **`POST /passwords`**  
   Stores a new password.

   **Request Body Example**:

   ```json
   {
       "site": "example.com",
       "username": "user@example.com",
       "password": "newpassword"
   }
   ```

   **Response Example**:

   ```json
   {
       "status": "success",
       "id": "67890"
   }
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
