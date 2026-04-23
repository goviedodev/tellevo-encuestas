# Encuesta Movilidad Backend

A FastAPI backend service for collecting and managing mobility survey data (encuesta de movilidad). This API handles survey submissions related to transportation habits, work commutes, and mobility patterns.

## Features

- **Survey Management**: Create and retrieve mobility survey records
- **Email Validation**: Check if email addresses already exist in the database
- **CORS Support**: Configured for cross-origin requests
- **SQLite Database**: Lightweight database for data persistence
- **Pydantic Models**: Type-safe data validation with Pydantic
- **Automatic API Documentation**: Interactive docs at `/docs`

## Installation

### Prerequisites

- Python 3.13+
- uv package manager

### Setup

1. **Clone the repository** (if applicable) and navigate to the python-backend directory

2. **Install dependencies**:
   ```bash
   uv sync
   ```

3. **Setup the database**:
   ```bash
   uv run python database_setup.py
   uv run python create_encuesta_table.py
   ```

## Usage

### Running the Server

**Development mode** (with auto-reload):
```bash
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Using the provided script**:
```bash
./run
```

**Background mode** (logs to log.txt):
```bash
./rund
```

The API will be available at:
- **API Base**: http://localhost:8001
- **Interactive Docs**: http://localhost:8001/docs
- **Alternative Docs**: http://localhost:8001/redoc

## API Endpoints

### Survey Operations

- `GET /` - Welcome message and API info
- `GET /api/v1/encuestas/email_exists/?email={email}` - Check if email exists
- `GET /api/v1/encuestas/` - Get all survey records
- `POST /api/v1/encuestas/` - Create a new survey record

### Survey Data Model

The survey collects the following information:

```json
{
  "FECHA": "2024-01-01",
  "EMAIL": "user@example.com",
  "EMPRESA": "Company Name",
  "TIPO_TRANSPORTE": "Car/Moto/Bus/etc",
  "CILINDRADA_MOTO": "Optional motorcycle engine size",
  "CILINDRADA_VEHICULO": "Optional vehicle engine size",
  "ORIGEN": "Work origin location",
  "DESTINO": "Work destination location",
  "DIAS_ESPECIFICOS": "Specific work days",
  "OTRO_TIPO_TRANSPORTE": "Other transport type",
  "COMBUSTION": "Fuel type",
  "TIEMPO_TRABAJO": "Work commute time",
  "ORIGEN_LATITUD": 40.7128,
  "ORIGEN_LONGITUD": -74.0060,
  "DESTINO_LATITUD": 40.7589,
  "DESTINO_LONGITUD": -73.9851,
  "COMPARTIR_VEHICULO": "Vehicle sharing info"
}
```

## Project Structure

```
python-backend/
├── api/
│   ├── __init__.py
│   └── encuesta.py          # Survey API endpoints
├── main.py                  # FastAPI application setup
├── database_setup.py        # Database initialization
├── create_encuesta_table.py # Table creation script
├── pyproject.toml          # Project dependencies
├── uv.lock                 # Dependency lock file
├── run                     # Development server script
├── rund                    # Background server script
├── log.txt                 # Server logs
└── README.md              # This file
```

## Dependencies

- **fastapi**: Web framework for building APIs
- **uvicorn**: ASGI server for running FastAPI
- **pydantic[email]**: Data validation with email support

## Development

### Database Location

The SQLite database is created at `../data/encuesta.db` (relative to the python-backend directory).

### Error Handling

The API includes comprehensive error handling for:
- Database connection issues
- Table not found errors
- Data validation errors
- Integrity constraint violations

### CORS Configuration

CORS is configured to allow all origins, methods, and headers for development. Adjust the CORS settings in `main.py` for production deployment.

## Contributing

1. Ensure you have Python 3.13+ and uv installed
2. Follow the code style guidelines in AGENTS.md
3. Test your changes with the API documentation at `/docs`
4. Run database setup scripts before testing database operations