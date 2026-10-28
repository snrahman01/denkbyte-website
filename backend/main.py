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
    superhero: Optional[str] = None
    superpower: Optional[str] = None
    avatar: Optional[str] = None
    github: Optional[str] = None
    gitlab: Optional[str] = None
    linkedin: Optional[str] = None

class Service(BaseModel):
    title: str
    description: str
    icon: Optional[str] = None

# DenkByte Team - Planspiel WS 2026/27
TEAM_MEMBERS = [
    {
        "id": 1,
        "name": "Ayush Aryan",
        "role": "Software Engineer",
        "superhero": "Iron Man",
        "superpower": "Engineering ingenuity — builds powerful systems from the ground up",
        "avatar": "🦾",
        "bio": "Software Engineer crafting robust, scalable solutions. Turns complex requirements into clean, maintainable code.",
        "email": "ayush2574@gmail.com",
        "github": "https://github.com/aryan2574",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/ayar-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/ayusharyandev/"
    },
    {
        "id": 2,
        "name": "Nishtha Bhagyawant",
        "role": "AI Engineer",
        "superhero": "Vision",
        "superpower": "Synthetic intelligence — sees patterns humans miss",
        "avatar": "🤖",
        "bio": "AI Engineer building intelligent systems that learn and adapt. Passionate about applied machine learning and automation.",
        "email": "nishthabhagyawant@gmail.com",
        "github": "https://github.com/NishthaB1409",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/nbha-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/nishtha-bhagyawant-507b721b9/"
    },
    {
        "id": 3,
        "name": "Kashish Madan",
        "role": "Frontend / UI/UX Engineer",
        "superhero": "Scarlet Witch",
        "superpower": "Reality-shaping — bends pixels into beautiful experiences",
        "avatar": "✨",
        "bio": "Frontend & UI/UX Engineer designing intuitive, human-centered interfaces. Bridges the gap between users and technology.",
        "email": "kashishmadan0902@gmail.com",
        "github": "https://github.com/kashishmadaann",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/kamad-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/madan-kashish"
    },
    {
        "id": 4,
        "name": "Meeta Dave",
        "role": "ML Engineer / Product Owner",
        "superhero": "Professor X",
        "superpower": "Strategic vision — guides the team and the mind of the product",
        "avatar": "🧠",
        "bio": "ML Engineer and Product Owner balancing technical depth with product strategy. Keeps the team aligned toward a shared vision.",
        "email": "davemeeta12@gmail.com",
        "github": "https://github.com/davemeeta",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/dmee-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/meetadave/"
    },
    {
        "id": 5,
        "name": "Rohini Mane",
        "role": "Data Engineer",
        "superhero": "Oracle",
        "superpower": "Master of data — turns raw information into actionable knowledge",
        "avatar": "🔮",
        "bio": "Data Engineer building reliable pipelines and data foundations. Ensures clean, accessible data powers every decision.",
        "email": "ruhiimane7844@gmail.com",
        "github": "https://github.com/RuhiMane",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/rohma-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/ruhi-mane-042613335/"
    },
    {
        "id": 6,
        "name": "Pranav Malap",
        "role": "Software Engineer",
        "superhero": "Spider-Man",
        "superpower": "Agile & versatile — swings across the full stack with ease",
        "avatar": "🕸️",
        "bio": "Software Engineer with a knack for solving tricky problems quickly. Adaptable across the stack and always ready to help.",
        "email": "pranavmalap.de@gmail.com",
        "github": "https://github.com/pranavmalap",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/malap-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/pranavmalap"
    },
    {
        "id": 7,
        "name": "Abhishek Dombe",
        "role": "Backend Engineer",
        "superhero": "Hulk",
        "superpower": "Raw power — handles the heavy lifting on the backend",
        "avatar": "💪",
        "bio": "Backend Engineer building the powerful core that keeps everything running. Thrives on performance and reliability.",
        "email": "abhidombe1111@gmail.com",
        "github": "https://github.com/abhishekdombe",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/doab-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/abhishek-dombe-0508a61a5"
    },
    {
        "id": 8,
        "name": "Yashwanth Thalka",
        "role": "Integration, Backend & Deployment Engineer",
        "superhero": "Doctor Strange",
        "superpower": "Master of connections — links systems and opens deployment portals",
        "avatar": "🌀",
        "bio": "Integration, Backend & Deployment Engineer connecting services and shipping them to production. Keeps the pipeline flowing smoothly.",
        "email": "thalkayashwanth084@gmail.com",
        "github": "https://github.com/Yashwanth2424",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/yath-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/thalka-yashwanth"
    },
    {
        "id": 9,
        "name": "Syeda Nargis Rahman",
        "role": "Backend Engineer",
        "superhero": "Ms. Marvel (Kamala Khan)",
        "superpower": "Resilient & resourceful — stretches to meet any challenge",
        "avatar": "🌙",
        "bio": "Backend Engineer designing solid APIs and services. Detail-oriented and dedicated to building dependable foundations.",
        "email": "nargis.rhmn@gmail.com",
        "github": "https://github.com/snrahman01",
        "gitlab": "https://gitlab.hrz.tu-chemnitz.de/rsye-at-tu-chemnitz.de",
        "linkedin": "https://www.linkedin.com/in/syeda-nargis-rahman-51148b205/"
    }
]

SERVICES = [
    {
        "title": "AI & Automation Consulting",
        "description": "Strategic guidance on AI implementation, automation opportunities, and digital transformation. Help identify high-impact use cases and build implementation roadmaps.",
        "icon": "🤖"
    },
    {
        "title": "Custom Software Development",
        "description": "Bespoke solutions tailored to your business needs. From cloud-native applications to enterprise systems, we build scalable, secure, and maintainable software.",
        "icon": "💻"
    },
    {
        "title": "Data Analytics & BI",
        "description": "Transform raw data into actionable insights. Advanced analytics, predictive modeling, and business intelligence solutions that drive informed decision-making.",
        "icon": "📊"
    },
    {
        "title": "Cloud Infrastructure",
        "description": "Secure, scalable cloud solutions on AWS, Azure, or GCP. Architecture design, migration, optimization, and managed services for optimal performance.",
        "icon": "☁️"
    },
    {
        "title": "Performance Optimization",
        "description": "Enhance system efficiency and reduce operational costs. Code optimization, database tuning, infrastructure scaling, and architecture improvements.",
        "icon": "⚡"
    },
    {
        "title": "Security & Compliance",
        "description": "Robust security frameworks ensuring data protection and regulatory compliance. GDPR, ISO 27001, and industry-specific compliance implementations.",
        "icon": "🔒"
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
