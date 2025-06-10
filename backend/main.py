from datetime import datetime
from hashlib import sha256
import time

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from storage import StorageBackend
from issues import router as issues_router

from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse

from auth.github import oauth
from starlette.middleware.sessions import SessionMiddleware
import os

app = FastAPI()
storage = StorageBackend()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure app to run on port 8080
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

# Include issue tracking
app.include_router(issues_router, prefix="/api")

# Temporary storage for demo
idea_registry = []


class IdeaSubmission(BaseModel):
    # Core fields
    title: str
    description: str

    # Wallet fields - handle both formats
    walletAddress: str | None = None  # For manual input (index.jsx)
    wallet: str | None = None  # For wallet provider (register.jsx)

    # Proof URL fields - handle both formats
    proofURL: str | None = None  # For manual input (index.jsx)
    website: str | None = None  # For wallet provider (register.jsx)

    # Additional fields from wallet provider
    type: str | None = None  # Wallet type from register.jsx

    # Computed property to get wallet address from either field
    def get_wallet_address(self) -> str:
        return self.walletAddress or self.wallet or ""

    # Computed property to get proof URL from either field
    def get_proof_url(self) -> str | None:
        return self.proofURL or self.website


@app.post("/api/register")
async def register_idea(idea: IdeaSubmission):
    """Register a new idea with wallet integration - handles both frontend formats"""
    wallet_address = idea.get_wallet_address()
    proof_url = idea.get_proof_url()

    if not wallet_address:
        raise HTTPException(status_code=400,
                            detail="Wallet address is required")

    token_data = f"{wallet_address}-{idea.title}-{idea.description}-{time.time()}"
    token_hash = sha256(token_data.encode()).hexdigest()

    record = {
        "walletAddress": wallet_address,
        "title": idea.title,
        "description": idea.description,
        "proofURL": proof_url,
        "walletType": idea.type,  # Include wallet type if provided
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


# Needed for OAuth session
app.add_middleware(SessionMiddleware, secret_key=os.environ['SESSION_SECRET'])

# Whitelist (you)
ADMIN_USERS = {os.environ['ADMIN_EMAIL']}  # Set this to your GitHub username


@app.get("/auth/login")
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/callback")
async def auth_callback(request: Request):
    token = await oauth.github.authorize_access_token(request)
    user = await oauth.github.parse_id_token(
        request, token) if 'id_token' in token else await oauth.github.get(
            'user', token=token)
    profile = user.json()
    request.session['user'] = profile

    if profile['login'] in ADMIN_USERS:
        return RedirectResponse(url='/admin')
    else:
        return JSONResponse({'error': 'Unauthorized'}, status_code=403)


@app.get("/auth/logout")
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')
