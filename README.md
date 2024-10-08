
# 🔒 TanuCLI - Password Manager

## Summary

In a world 🌍 where digital security often feels like a battlefield ⚔️, imagine two people, T and A, who are deeply in love 💑. T is always worried 😟 about A’s safety, not just in the physical world but in the digital one too. A has a habit of using the same password across all their accounts, which makes T concerned about A’s security 🔒. So, T decided to create something special—a tool 🛠️ that would protect A from the dangers of the digital world.

This tool, TanuCLI, is like a guardian angel 😇 for passwords. It helps A (and everyone else) create strong 💪, unique passwords while keeping things simple and familiar. The same password A always uses becomes the master key 🗝️, securing everything without the need for remembering dozens of different combinations. With TanuCLI, T ensures that A’s digital life is as secure as their relationship—built on trust, strength, and a lot of love 💖.

TanuCLI doesn’t just solve a technical problem; it’s a love letter disguised as code 💌. Every time A uses it, they can feel T’s care and protection, knowing that T is always looking out for them, even in the smallest of ways. This tool isn’t just about passwords; it’s about love, security, and the comfort of knowing someone is always there to keep you safe 🛡️.

## Overview

The **TanuCLI Password Manager** is a secure and comprehensive tool designed to simplify password management. It is primarily a command-line interface (CLI) that allows users to generate strong, random passwords and manage them effortlessly. The tool uses a master password—which can be a commonly used password of the user—that is securely hashed and serves as the encryption key for all stored passwords. With AES-256 encryption, TanuCLI ensures that even if stored data is accessed, it remains protected.

In addition to the CLI, TanuCLI includes a browser extension that integrates seamlessly with the tool, offering features like password autofill and generation directly within the browser. This functionality is supported by a Flask-based API that securely handles password storage and retrieval through RESTful endpoints. TanuCLI is designed to be both user-friendly and secure, providing a robust solution for anyone looking to protect their digital identities while navigating complex password restrictions.

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
cd tanu-cli
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
