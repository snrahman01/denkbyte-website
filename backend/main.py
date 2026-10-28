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
        "name": "Dr. Marcus Adler",
        "role": "Founder & CEO",
        "bio": "PhD in Computer Science with 15+ years in tech innovation. Strategic visionary driving DenkByte's mission to transform digital landscapes. Expert in AI strategy and enterprise solutions.",
        "email": "marcus.adler@denkbyte.tech"
    },
    {
        "id": 2,
        "name": "Sarah Hoffmann",
        "role": "CTO & Co-Founder",
        "bio": "Cloud architect and full-stack engineer. Passionate about scalable systems and cutting-edge technologies. Previously led tech at leading fintech startup with 50+ team members.",
        "email": "sarah.hoffmann@denkbyte.tech"
    },
    {
        "id": 3,
        "name": "Klaus Weber",
        "role": "Head of Data Science",
        "bio": "Machine learning specialist with expertise in predictive analytics and AI. M.Sc. in Data Science from TU Munich. Published researcher in neural networks and deep learning.",
        "email": "klaus.weber@denkbyte.tech"
    },
    {
        "id": 4,
        "name": "Anna Fischer",
        "role": "Head of Client Solutions",
        "bio": "Enterprise consultant with strong background in business process optimization. Brings 8+ years of experience in strategic implementations across automotive and manufacturing sectors.",
        "email": "anna.fischer@denkbyte.tech"
    },
    {
        "id": 5,
        "name": "Thomas Müller",
        "role": "Senior Full-Stack Engineer",
        "bio": "Open-source enthusiast and full-stack developer. Specializes in building scalable web applications and microservices. Active contributor to major tech communities.",
        "email": "thomas.mueller@denkbyte.tech"
    }
]

PROJECTS = [
    {
        "id": 1,
        "title": "IntelliFlow™ - AI-Powered Process Automation",
        "description": "Enterprise automation platform leveraging machine learning to optimize business workflows. Reduces manual processes by up to 70% while improving accuracy. Used by Fortune 500 companies in manufacturing and logistics.",
        "technologies": ["Python", "TensorFlow", "Kubernetes", "PostgreSQL", "React"],
        "status": "active"
    },
    {
        "id": 2,
        "title": "DataVault - Secure Analytics Hub",
        "description": "Comprehensive data analytics and business intelligence platform with advanced security features. Enables real-time insights from multi-source data lakes with GDPR compliance.",
        "technologies": ["Python", "Apache Spark", "Elasticsearch", "Vue.js", "AWS"],
        "status": "active"
    },
    {
        "id": 3,
        "title": "PredictNext - Predictive Analytics Engine",
        "description": "Advanced forecasting and predictive analytics solution for supply chain optimization. Combines ML models with domain expertise to deliver 92% prediction accuracy.",
        "technologies": ["Python", "PyTorch", "FastAPI", "PostgreSQL", "Docker"],
        "status": "active"
    },
    {
        "id": 4,
        "title": "CloudSync - Enterprise Integration Platform",
        "description": "Next-generation cloud integration platform enabling seamless data flow across enterprise systems. Currently in final beta testing with select enterprise clients.",
        "technologies": ["Node.js", "GraphQL", "Microservices", "Kubernetes", "Azure"],
        "status": "in_development"
    },
    {
        "id": 5,
        "title": "InsightDash - Real-Time Dashboard Framework",
        "description": "Modern dashboard framework for real-time monitoring and visualization. Used internally and by partners for critical system monitoring.",
        "technologies": ["Vue.js", "D3.js", "WebSocket", "Python", "Redis"],
        "status": "active"
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
