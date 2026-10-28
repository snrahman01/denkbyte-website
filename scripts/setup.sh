#!/bin/bash

# Planspiel Website - Quick Setup Script
# This script sets up the project for local development

set -e

echo "🚀 Planspiel Website - Setup Script"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker found: $(docker --version)"
echo ""

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✅ Docker Compose found: $(docker-compose --version)"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
fi

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the website, run:"
echo "   docker-compose up"
echo ""
echo "📍 Then open:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "✏️  To customize, edit:"
echo "   config/branding.json"
echo ""
