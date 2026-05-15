import os
import tempfile
from fastapi import APIRouter, UploadFile, File
from faster_whisper import WhisperModel

router = APIRouter()
whisper = WhisperModel("tiny", device="cpu", compute_type="int8")

@router.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    content = await audio.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as f:
        f.write(content)
        tmp_path = f.name
    segments, _ = whisper.transcribe(tmp_path)
    transcript = " ".join(s.text for s in segments).strip()
    os.unlink(tmp_path)
    return {"transcript": transcript}