from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, voice

app = FastAPI(title="AI Interview Assistant ")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(voice.router, prefix="/voice", tags=["voice"])

@app.get("/")
def health():
    return {"status": "ok"}

