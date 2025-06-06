# main.py
from datetime import datetime
from hashlib import sha256

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from storage import StorageBackend

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

from fastapi import FastAPI, Request
from pydantic import BaseModel
import hashlib
import time

app = FastAPI()

idea_registry = []  # Temp storage for demo

class IdeaSubmission(BaseModel):
    walletAddress: str
    title: str
    description: str
    proofURL: str | None = None

@app.post("/api/register")
async def register_idea(idea: IdeaSubmission):
    token_data = f"{idea.walletAddress}-{idea.title}-{idea.description}-{time.time()}"
    token_hash = hashlib.sha256(token_data.encode()).hexdigest()

    record = {
        "walletAddress": idea.walletAddress,
        "title": idea.title,
        "description": idea.description,
        "proofURL": idea.proofURL,
        "tokenHash": token_hash,
        "timestamp": time.time()
    }

    idea_registry.append(record)

    return {
        "status": "success",
        "tokenHash": token_hash,
        "registeredAt": record["timestamp"]
    }