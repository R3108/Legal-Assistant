from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from crew import LegalSummarizerCrew

app = FastAPI(title="Legal Document Summarizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    text: str

@app.post("/api/summarize")
async def summarize_document(request: SummarizeRequest):
    try:
        crew = LegalSummarizerCrew()
        result = crew.run(request.text)
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = content.decode('utf-8')
        crew = LegalSummarizerCrew()
        result = crew.run(text)
        return {"summary": result, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
