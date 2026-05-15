import uuid
from fastapi import APIRouter, UploadFile, File
from services.parser import parse_resume
from services.embedder import embed_and_store

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = parse_resume(content, file.filename)
    session_id = str(uuid.uuid4())
    chunks = embed_and_store(text, session_id)
    return {"session_id": session_id, "chunks_stored": chunks}