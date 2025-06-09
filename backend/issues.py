
# issues.py - Simple issue tracking API
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class Issue(BaseModel):
    id: str
    title: str
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    priority: str = "medium"  # low, medium, high, critical
    status: str = "open"  # open, in_progress, resolved
    tags: List[str] = []
    created_at: str
    updated_at: str

class CreateIssue(BaseModel):
    title: str
    description: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    priority: str = "medium"
    tags: List[str] = []

# In-memory storage for demo
issues_db = {}

@router.post("/issues")
def create_issue(issue_data: CreateIssue):
    issue_id = f"ISSUE-{len(issues_db) + 1:03d}"
    issue = Issue(
        id=issue_id,
        created_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat(),
        **issue_data.dict()
    )
    issues_db[issue_id] = issue.dict()
    return {"status": "created", "issue": issue}

@router.get("/issues")
def list_issues():
    return {"issues": list(issues_db.values())}

@router.get("/issues/{issue_id}")
def get_issue(issue_id: str):
    if issue_id not in issues_db:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issues_db[issue_id]

@router.patch("/issues/{issue_id}")
def update_issue(issue_id: str, updates: dict):
    if issue_id not in issues_db:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issues_db[issue_id].update(updates)
    issues_db[issue_id]["updated_at"] = datetime.utcnow().isoformat()
    return {"status": "updated", "issue": issues_db[issue_id]}

@router.delete("/issues/{issue_id}")
def delete_issue(issue_id: str):
    if issue_id not in issues_db:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    deleted_issue = issues_db.pop(issue_id)
    return {"status": "deleted", "issue": deleted_issue}
