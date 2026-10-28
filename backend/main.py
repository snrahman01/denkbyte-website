from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os
from pathlib import Path
from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

app = FastAPI(
    title="Planspiel Company Website API",
    description="REST API for the Planspiel course company website",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load branding configuration
CONFIG_PATH = Path("/app/config/branding.json")
if not CONFIG_PATH.exists():
    CONFIG_PATH = Path("./config/branding.json")

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

config = load_config()

# Data models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class Team(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    email: Optional[str] = None

class Project(BaseModel):
    title: str
    description: str
    technologies: list[str]
    status: str = "active"

class Service(BaseModel):
    title: str
    description: str
    icon: Optional[str] = None

# Sample data - replace with database later
TEAM_MEMBERS = [
    {
        "id": 1,
        "name": "Team Member 1",
        "role": "Co-Founder & CEO",
        "bio": "Visionary leader with 10+ years of experience.",
        "email": "member1@yourcompany.example.com"
    },
    {
        "id": 2,
        "name": "Team Member 2",
        "role": "CTO",
        "bio": "Tech expert specializing in cloud solutions.",
        "email": "member2@yourcompany.example.com"
    }
]

PROJECTS = [
    {
        "id": 1,
        "title": "Project Alpha",
        "description": "Innovative solution for market optimization.",
        "technologies": ["Python", "FastAPI", "PostgreSQL"],
        "status": "active"
    },
    {
        "id": 2,
        "title": "Project Beta",
        "description": "AI-driven analytics platform.",
        "technologies": ["Python", "TensorFlow", "Vue.js"],
        "status": "in_development"
    }
]

SERVICES = [
    {
        "title": "Consulting",
        "description": "Strategic business consulting for digital transformation.",
        "icon": "💼"
    },
    {
        "title": "Development",
        "description": "Custom software development with modern tech stack.",
        "icon": "💻"
    },
    {
        "title": "Analytics",
        "description": "Data-driven insights and business intelligence solutions.",
        "icon": "📊"
    },
    {
        "title": "Optimization",
        "description": "Process optimization and efficiency improvements.",
        "icon": "⚡"
    }
]

# Endpoints

@app.get("/")
async def root():
    return {"message": "Welcome to Planspiel Company Website API", "version": "1.0.0"}

@app.get("/api/config")
async def get_config():
    """Get complete branding and configuration"""
    return config

@app.get("/api/config/branding")
async def get_branding():
    """Get branding information (colors, logo, company name)"""
    return config.get("branding", {})

@app.get("/api/config/company")
async def get_company():
    """Get company information"""
    return config.get("company", {})

@app.get("/api/config/contact")
async def get_contact():
    """Get contact information"""
    return config.get("contact", {})

@app.get("/api/team")
async def get_team():
    """Get team members"""
    return TEAM_MEMBERS

@app.get("/api/team/{member_id}")
async def get_team_member(member_id: int):
    """Get specific team member"""
    member = next((m for m in TEAM_MEMBERS if m["id"] == member_id), None)
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    return member

@app.post("/api/team")
async def add_team_member(member: Team):
    """Add a new team member"""
    new_id = max([m["id"] for m in TEAM_MEMBERS], default=0) + 1
    new_member = {
        "id": new_id,
        **member.dict()
    }
    TEAM_MEMBERS.append(new_member)
    return new_member

@app.get("/api/projects")
async def get_projects():
    """Get all projects"""
    return PROJECTS

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    """Get specific project"""
    project = next((p for p in PROJECTS if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/api/projects")
async def add_project(project: Project):
    """Add a new project"""
    new_id = max([p["id"] for p in PROJECTS], default=0) + 1
    new_project = {
        "id": new_id,
        **project.dict()
    }
    PROJECTS.append(new_project)
    return new_project

@app.get("/api/services")
async def get_services():
    """Get services offered"""
    return SERVICES

@app.post("/api/contact")
async def submit_contact(message: ContactMessage):
    """Submit contact form message"""
    # In production, save to database or send email
    return {
        "status": "success",
        "message": "Thank you for your message. We'll get back to you soon!",
        "timestamp": datetime.now().isoformat(),
        "data": message.dict()
    }

@app.get("/api/legal/impressum")
async def get_impressum():
    """Get impressum/legal information"""
    return config.get("legal", {}).get("impressum", {})

@app.get("/api/legal/disclaimer")
async def get_disclaimer():
    """Get academic disclaimer"""
    return {
        "disclaimer": config.get("legal", {}).get("disclaimer", "")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Planspiel Company Website API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
