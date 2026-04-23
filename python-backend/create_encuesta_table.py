import sqlite3
import os

# Absolute path to the database file
DATABASE_NAME = "encuesta.db"
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "..", "data")
DB_PATH = os.path.join(DATABASE_PATH, DATABASE_NAME)

TABLE_NAME = "encuesta"

# SQL statement to create the table
# Using IF NOT EXISTS to prevent errors if the table already exists
CREATE_TABLE_SQL = f"""
CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
    FECHA TEXT,
    EMAIL TEXT,
    EMPRESA TEXT,
    TIPO_TRANSPORTE TEXT,
    CILINDRADA_MOTO TEXT,
    CILINDRADA_VEHICULO TEXT,
    ORIGEN TEXT,
    DESTINO TEXT,
    DIAS_ESPECIFICOS TEXT,
    OTRO_TIPO_TRANSPORTE TEXT,
    COMBUSTION TEXT,
    TIEMPO_TRABAJO TEXT,
    COMPARTIR_VEHICULO TEXT,
    ORIGEN_LATITUD REAL,
    ORIGEN_LONGITUD REAL,
    DESTINO_LATITUD REAL,
    DESTINO_LONGITUD REAL
);
"""

def create_table():
    """Creates the encuesta table in the SQLite database."""
    try:
        # Ensure the directory for the database exists
        if not os.path.exists(DATABASE_PATH):
            print(f"Database directory {DATABASE_PATH} does not exist. Please ensure it's created and accessible.")
            return

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(CREATE_TABLE_SQL)
        conn.commit()
        print(f"Table '{TABLE_NAME}' created successfully or already exists in '{DB_PATH}'.")
    except sqlite3.Error as e:
        print(f"Error creating table '{TABLE_NAME}' in '{DB_PATH}': {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_table()
