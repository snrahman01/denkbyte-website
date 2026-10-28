# Planspiel Course Company Website

A modern, themeable website for the Planspiel course at Technische Universität Chemnitz. Built with Python FastAPI backend, HTML/CSS/JavaScript frontend, and Docker for easy deployment.

## ✨ Features

- **Themeable Design**: Easy color and branding customization via single config file
- **REST API Backend**: Python FastAPI with full CRUD capabilities
- **Responsive Frontend**: Modern, HCD-compliant design that works on all devices
- **Dynamic Content**: All content loaded from API (easy to connect database later)
- **GDPR Compliant**: Privacy policy and data protection built-in
- **Legal Pages**: Impressum and academic disclaimer included
- **Docker Ready**: Docker Compose for instant local setup
- **Free Hosting Options**: Multiple free deployment options included

## 📋 Required Sections Included

✅ About Us  
✅ Vision & Mission  
✅ Services & Expertise  
✅ Meet the Team  
✅ Projects / Solutions  
✅ Contact Us  
✅ Impressum (Legal Notice)  
✅ GDPR Compliance  
✅ Academic Disclaimer  

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
cd /path/to/planspiel-website
docker-compose up
```

Then open:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Option 2: Local Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

Backend runs at: http://localhost:8000

#### Frontend
```bash
cd frontend
python -m http.server 8001
```

Frontend runs at: http://localhost:8001

**Note**: Update API_BASE_URL in `frontend/script.js` to match your backend URL.

## 🎨 Customization

### Change Company Branding & Colors

Edit `config/branding.json`:

```json
{
  "company": {
    "name": "Your Company Name",
    "tagline": "Your company tagline",
    "description": "Your description...",
    "founded": 2025
  },
  "branding": {
    "logo_url": "https://url-to-your-logo.png",
    "colors": {
      "primary": "#1d7874",      // Main brand color
      "secondary": "#34a853",    // Accent color
      "accent": "#fbbc04",       // Highlight color
      "dark": "#202124",
      "light": "#f8f9fa",
      "text": "#202124",
      "text_light": "#5f6368"
    }
  }
}
```

**No code changes needed** - the frontend automatically applies these colors via CSS variables!

### Update Team Members

Edit the `TEAM_MEMBERS` list in `backend/main.py` or use the REST API:

```bash
curl -X POST http://localhost:8000/api/team \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "role": "CEO",
    "bio": "10+ years experience",
    "email": "john@company.com"
  }'
```

### Update Projects

Edit the `PROJECTS` list in `backend/main.py` or use the REST API:

```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Name",
    "description": "Project description",
    "technologies": ["Python", "FastAPI"],
    "status": "active"
  }'
```

### Update Services

Edit the `SERVICES` list in `backend/main.py`

## 📚 API Endpoints

### Configuration
- `GET /api/config` - Get complete configuration
- `GET /api/config/branding` - Get branding settings
- `GET /api/config/company` - Get company info
- `GET /api/config/contact` - Get contact information

### Content
- `GET /api/team` - List all team members
- `GET /api/team/{id}` - Get team member details
- `POST /api/team` - Add team member

- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project details
- `POST /api/projects` - Add project

- `GET /api/services` - List services
- `POST /api/contact` - Submit contact form

### Legal
- `GET /api/legal/impressum` - Get impressum
- `GET /api/legal/disclaimer` - Get academic disclaimer

### Health
- `GET /health` - API health check

## 📦 Deployment Options

### Option A: Railway (Recommended - Free Tier Available)

1. **Backend**:
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/planspiel-website.git
   git push -u origin main
   
   # Deploy on Railway
   # Visit: https://railway.app
   # Connect GitHub repo, set start command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
   ```

2. **Frontend**:
   - Deploy to Netlify or Vercel (drag & drop the `frontend` folder)
   - Update `API_BASE_URL` to your Railway backend URL

### Option B: GitHub Pages + Heroku

1. **Backend on Heroku** (free tier may be deprecated):
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

2. **Frontend on GitHub Pages**:
   ```bash
   git subtree push --prefix frontend origin gh-pages
   ```

### Option C: Replit

1. Upload files to Replit
2. Run: `docker-compose up`
3. Replit will provide a public URL

### Option D: Docker Hub + Any Cloud

1. Push image to Docker Hub:
   ```bash
   docker build -t your-username/planspiel-website .
   docker push your-username/planspiel-website
   ```

2. Deploy on:
   - **DigitalOcean** (has free credits)
   - **AWS** (free tier)
   - **Azure** (free tier)
   - **Google Cloud** (free tier)

## 🔒 GDPR & Legal Compliance

✅ **Built-in Compliance**:
- Privacy policy modal with GDPR rights explanation
- Impressum with company and contact information
- Academic disclaimer visible in footer
- Contact form doesn't track or store data unnecessarily
- No cookies or tracking (can add if needed)

✅ **To Customize Legal Pages**:
Edit `config/branding.json` legal section and it will automatically update the modals.

## 🛠️ Tech Stack

- **Backend**: Python 3.11, FastAPI, Pydantic
- **Frontend**: HTML5, CSS3 (with CSS variables for theming), Vanilla JavaScript
- **Infrastructure**: Docker, Docker Compose, Nginx
- **Database**: Ready for PostgreSQL/SQLite (currently in-memory)

## 📝 Project Structure

```
planspiel-website/
├── config/
│   └── branding.json          # All branding & config (EDIT THIS!)
├── backend/
│   ├── main.py                # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── index.html            # Main HTML
│   ├── styles.css            # Themeable CSS with variables
│   ├── script.js             # Dynamic content loading
│   └── ...
├── docker-compose.yml         # Docker setup
├── nginx.conf                # Frontend web server config
└── README.md                 # This file
```

## 🔄 Database Integration (Future)

To add a real database:

1. Install database driver:
   ```bash
   pip install sqlalchemy psycopg2-binary  # For PostgreSQL
   ```

2. Replace in-memory lists in `backend/main.py` with database queries
3. Update Docker Compose to include database service

Example for PostgreSQL:
```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🐛 Troubleshooting

### CORS Errors
Frontend can't reach backend API? 
- Check backend is running: `curl http://localhost:8000/health`
- Update `API_BASE_URL` in `frontend/script.js`
- Check firewall/proxy settings

### Docker Issues
```bash
# Rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Port Already in Use
```bash
# Change ports in docker-compose.yml
# Or kill process on port:
lsof -i :8000  # Find process
kill -9 <PID>  # Kill it
```

## 📄 License

This project is created for educational purposes as part of the Planspiel course at TU Chemnitz.

## 🎓 Course Reference

Planspiel Course Guidelines: https://vsr.informatik.tu-chemnitz.de/edu/2025/planspiel/

---

**Need help?** Check the inline comments in files or test endpoints with:
```bash
curl http://localhost:8000/docs  # Swagger UI for API
```
