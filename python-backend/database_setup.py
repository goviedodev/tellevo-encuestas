import sqlite3
import os

# Define the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_NAME = "encuesta.db"
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "..", "data")
DB_PATH = os.path.join(DATABASE_PATH, DATABASE_NAME)

def create_database():
    """
    Connects to the SQLite database file specified by DATABASE_PATH.
    If the database file already exists, it will simply connect and close.
    If the directory for the database path does not exist, this script will not create it.
    """
    try:
        # Ensure the directory for the database exists
        os.makedirs(DATABASE_PATH, exist_ok=True)

        # Connect to the SQLite database.
        conn = sqlite3.connect(DB_PATH)
        print(f"Successfully connected to database '{DATABASE_NAME}' at '{DATABASE_PATH}'.")
        conn.close()
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    create_database()

