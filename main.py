from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, voice
from db.database import init_db

app = FastAPI(title="Vox AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(voice.router, prefix="/voice", tags=["voice"])

@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def health():
    return {"status": "ok"}
