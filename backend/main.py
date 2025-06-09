from datetime import datetime
from hashlib import sha256
import time

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from storage import StorageBackend
from issues import router as issues_router

app = FastAPI()
storage = StorageBackend()

# Include issue tracking
app.include_router(issues_router, prefix="/api")

# Temporary storage for demo
idea_registry = []

class IdeaSubmission(BaseModel):
    walletAddress: str
    title: str
    description: str
    proofURL: str | None = None

@app.post("/api/register")
async def register_idea(idea: IdeaSubmission):
    """Register a new idea with wallet integration"""
    token_data = f"{idea.walletAddress}-{idea.title}-{idea.description}-{time.time()}"
    token_hash = sha256(token_data.encode()).hexdigest()

    record = {
        "walletAddress": idea.walletAddress,
        "title": idea.title,
        "description": idea.description,
        "proofURL": idea.proofURL,
        "tokenHash": token_hash,
        "timestamp": time.time()
    }

    idea_registry.append(record)

    # Also store in the storage backend for consistency
    storage.set(token_hash, record)

    return {
        "status": "success",
        "tokenHash": token_hash,
        "registeredAt": record["timestamp"]
    }

@app.get("/api/record/{token_hash}")
def retrieve_idea(token_hash: str):
    """Retrieve an idea record by token hash"""
    record = storage.get(token_hash)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record

@app.get("/")
def root():
    """Health check endpoint"""
    return {"status": "EchoLedger API is running", "version": "1.0.0"}