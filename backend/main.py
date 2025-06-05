# main.py
from datetime import datetime
from hashlib import sha256

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .storage import StorageBackend

app = FastAPI()
storage = StorageBackend()

class IdeaSubmission(BaseModel):
    source: str
    llm_agent: str
    content_hash: str
    description: str | None = None
    proof_url: str | None = None

@app.post("/register")
def register_idea(submission: IdeaSubmission):
    idea_id = sha256((submission.source + submission.content_hash).encode()).hexdigest()
    existing = storage.get(idea_id)

    if existing:
        raise HTTPException(status_code=409, detail="Idea already registered")

    record = {
        "id": idea_id,
        "source": submission.source,
        "llm_agent": submission.llm_agent,
        "content_hash": submission.content_hash,
        "description": submission.description,
        "proof_url": submission.proof_url,
        "timestamp": datetime.utcnow().isoformat()
    }

    storage.set(idea_id, record)
    return {"status": "success", "idea_id": idea_id, "record": record}

@app.get("/record/{idea_id}")
def retrieve_idea(idea_id: str):
    record = storage.get(idea_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record
