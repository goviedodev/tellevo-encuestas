from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Assuming 'api' is a package in the same directory as main.py (python-backend)
# and encuesta.py is inside 'api'
from api import encuesta as encuesta_router # Renaming to avoid conflict if 'encuesta' is used elsewhere

app = FastAPI(
    title="Encuesta API",
    description="API for managing encuesta data.",
    version="0.1.0",
)

# CORS Middleware
# Adjust origins, methods, headers as needed for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# Include the router from api/encuesta.py
# The prefix makes all routes in encuesta_router.router start with /api/v1
app.include_router(encuesta_router.router, prefix="/api/v1", tags=["Encuestas"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Encuesta API. Visit /docs for API documentation."}

# To run this application:
# 1. Ensure FastAPI and Uvicorn are installed:
#    Add to pyproject.toml dependencies:
#    dependencies = [
#        "fastapi>=0.100.0",
#        "uvicorn[standard]>=0.20.0"
#    ]
#    Then run your project's install command (e.g., pip install . or poetry install)
# 2. Navigate to the 'python-backend' directory in your terminal.
# 3. Run Uvicorn: uvicorn main:app --reload --host 0.0.0.0 --port 8000
#
# The API will be available at http://localhost:8000
# The /encuestas/ endpoint will be at http://localhost:8000/api/v1/encuestas/

if __name__ == "__main__":
    # This part is for development convenience.
    # For production, Uvicorn should be run as a separate process.
    import uvicorn
    print("Starting Uvicorn server. Access the API at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
