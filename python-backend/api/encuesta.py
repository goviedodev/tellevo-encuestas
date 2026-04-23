from fastapi import APIRouter, HTTPException, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import sqlite3
import os

router = APIRouter()

# Database path (relative to this file's location in python-backend/api/)
# Going up two levels to reach the project root, then to the db.
DATABASE_NAME = "encuesta.db"
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data")
DB_PATH = os.path.join(DATABASE_PATH, DATABASE_NAME)
TABLE_NAME = "encuesta"

class EncuestaRecord(BaseModel):
    FECHA: str
    EMAIL: EmailStr
    EMPRESA: str
    TIPO_TRANSPORTE: str
    CILINDRADA_MOTO: Optional[str] = None
    CILINDRADA_VEHICULO: Optional[str] = None
    ORIGEN: str
    DESTINO: str
    DIAS_ESPECIFICOS: Optional[str] = None # Assuming this can be a comma-separated string or similar
    OTRO_TIPO_TRANSPORTE: Optional[str] = None
    COMBUSTION: Optional[str] = None
    TIEMPO_TRABAJO: Optional[str] = None # e.g., "30 minutos", "1 hora"
    ORIGEN_LATITUD: Optional[float] = None
    ORIGEN_LONGITUD: Optional[float] = None
    DESTINO_LATITUD: Optional[float] = None
    DESTINO_LONGITUD: Optional[float] = None
    COMPARTIR_VEHICULO: Optional[str] = None # Added field

@router.get("/encuestas/email_exists/")
async def check_email_exists(email: EmailStr):
    """
    Checks if an email exists in the encuesta table.
    Returns:
        - True if email exists (200 status)
        - False if email doesn't exist (200 status)
        - 422 status if email format is invalid (handled automatically by EmailStr)
    """
    conn = None
    try:
        if not os.path.exists(DB_PATH):
             # This check might be redundant if the main endpoint also checks db existence
            raise HTTPException(status_code=500, detail=f"Database file {DB_PATH} not found.")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
       
        # Case-insensitive partial match search
        cursor.execute(f"SELECT 1 FROM {TABLE_NAME} WHERE LOWER(EMAIL) = LOWER(?) LIMIT 1", (email,))
        exists = cursor.fetchone() is not None
        
        return {"exists": exists}

    except sqlite3.OperationalError as e:
        # Handle cases like table not found, etc.
        if "no such table" in str(e).lower():
             raise HTTPException(status_code=500, detail=f"Table '{TABLE_NAME}' does not exist. Please run setup.")
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        if conn:
            conn.close()

@router.get("/encuestas/", response_model=List[EncuestaRecord])
async def get_all_encuestas():
    """
    Retrieves all records from the encuesta table.
    Returns a list of EncuestaRecord objects.
    """
    conn = None
    try:
        if not os.path.exists(DB_PATH):
            raise HTTPException(status_code=500, detail=f"Database file {DB_PATH} not found.")

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row  # This allows column access by name
        cursor = conn.cursor()
        
        cursor.execute(f"SELECT * FROM {TABLE_NAME}")
        rows = cursor.fetchall()
        
        # Convert each row to a dictionary and then to EncuestaRecord
        return [EncuestaRecord(**dict(row)) for row in rows]

    except sqlite3.OperationalError as e:
        if "no such table" in str(e).lower():
            raise HTTPException(status_code=500, detail=f"Table '{TABLE_NAME}' does not exist. Please run setup.")
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        if conn:
            conn.close()

@router.post("/encuestas/", status_code=status.HTTP_201_CREATED)
async def create_encuesta_record(record: EncuestaRecord):
    """
    Inserts a new record into the encuesta table.
    """
    conn = None
    try:
        if not os.path.exists(os.path.dirname(DB_PATH)):
            raise HTTPException(status_code=500, detail=f"Database directory {os.path.dirname(DB_PATH)} not found.")
        if not os.path.exists(DB_PATH):
            raise HTTPException(status_code=500, detail=f"Database file {DB_PATH} not found. Ensure table is created.")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Construct the SQL query dynamically from the model
        # This helps if the model changes or has many optional fields
        columns = []
        values_placeholders = []
        values_data = []

        for field, value in record.model_dump(exclude_none=True).items():
            columns.append(field)
            values_placeholders.append("?")
            values_data.append(value)
        
        if not columns: # Should not happen with non-optional fields in model
            raise HTTPException(status_code=400, detail="No data provided.")

        sql = f"INSERT INTO {TABLE_NAME} ({', '.join(columns)}) VALUES ({', '.join(values_placeholders)})"
        
        cursor.execute(sql, tuple(values_data))
        conn.commit()
        
        # Optionally, retrieve the last inserted rowid
        # last_row_id = cursor.lastrowid
        # return {**record.model_dump(), "id": last_row_id}
        return {"message": "Record created successfully", "data": record.model_dump()}

    except sqlite3.IntegrityError as e: # e.g., unique constraint failed
        if conn:
            conn.rollback()
        raise HTTPException(status_code=409, detail=f"Database integrity error: {e}")
    except sqlite3.OperationalError as e: # e.g., table not found, database locked
        if conn:
            conn.rollback()
        # Check if it's a "no such table" error
        if "no such table" in str(e).lower():
             raise HTTPException(status_code=500, detail=f"Table '{TABLE_NAME}' does not exist in the database. Please run the setup script.")
        raise HTTPException(status_code=500, detail=f"Database operational error: {e}")
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        if conn:
            conn.close()

@router.get("/encuestas-html/", response_class=HTMLResponse)
async def get_encuestas_html():
    """
    Returns an HTML page with a table of all survey records and a reload button.
    """
    conn = None
    try:
        if not os.path.exists(DB_PATH):
            raise HTTPException(status_code=500, detail=f"Database file {DB_PATH} not found.")

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute(f"SELECT * FROM {TABLE_NAME}")
        rows = cursor.fetchall()

        # Build HTML table
        html = """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Encuestas Table</title>
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                button { padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; border: none; cursor: pointer; }
                button:hover { background-color: #45a049; }
            </style>
        </head>
        <body>
            <h1>Encuestas Survey Results</h1>
            <button onclick="location.reload()">Reload Data</button>
            <table>
                <tr>
        """

        if rows:
            # Get column names from first row
            columns = rows[0].keys()
            html += "".join(f"<th>{col}</th>" for col in columns)
            html += "</tr>"

            # Add data rows
            for row in rows:
                html += "<tr>"
                for col in columns:
                    html += f"<td>{row[col]}</td>"
                html += "</tr>"
        else:
            html += "<th>No data available</th></tr>"

        html += """
            </table>
        </body>
        </html>
        """

        return HTMLResponse(content=html)

    except sqlite3.OperationalError as e:
        if "no such table" in str(e).lower():
            raise HTTPException(status_code=500, detail=f"Table '{TABLE_NAME}' does not exist. Please run setup.")
        raise HTTPException(status_code=500, detail=f"Database query error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")
    finally:
        if conn:
            conn.close()

# Example of how to include this router in your main.py:
# from fastapi import FastAPI
# from .api import encuesta # Assuming main.py is in python-backend
#
# app = FastAPI()
# app.include_router(encuesta.router, prefix="/api/v1", tags=["encuestas"])
#
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
