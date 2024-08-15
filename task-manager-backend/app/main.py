from fastapi import FastAPI
import app.firebaseconfig  # Ensure this is imported first to initialize Firebase
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import logging

logging.basicConfig(level=logging.INFO)  

logger = logging.getLogger(__name__)
logger.info("Logging is configured.")

sys.stderr = open(os.devnull, 'w')

from dotenv import load_dotenv
import pathlib
from app.routes.tasks.tasks import router as tasks_router
from app.middleware.Dependencies import verify_firebase_token

basedir = pathlib.Path(__file__).parents[1]
load_dotenv(basedir / ".env")

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  
    "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello, world!"}

app.include_router(tasks_router, prefix="/api")
