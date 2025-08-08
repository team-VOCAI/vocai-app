from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import tempfile
import whisper

app = FastAPI()
model = whisper.load_model("base")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    with tempfile.NamedTemporaryFile(suffix=".webm") as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        result = model.transcribe(tmp.name, language="ko")
    return JSONResponse({"text": result["text"].strip()})
