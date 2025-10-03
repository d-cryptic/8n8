#!/bin/bash

# 8n8 Clone Setup Script
echo "🚀 Setting up 8n8 Clone..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   You can use MongoDB Atlas (cloud) or install locally."
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Go back to root
cd ..

echo "🔧 Setting up environment files..."

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env - Please update with your configuration"
else
    echo "✅ Backend .env already exists"
fi

# Create frontend .env if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "Creating frontend .env file..."
    echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "✅ Frontend .env already exists"
fi

echo "🗄️  Setting up database..."

# Generate Prisma client and push schema
cd backend
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "⚠️  Please make sure MongoDB is running before pushing the schema"
echo "   Run: npx prisma db push"
echo "   Or use: make db-setup"

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Make sure MongoDB is running"
echo "3. Run: make db-setup (to push database schema)"
echo "4. Run: make dev (to start both servers)"
echo ""
echo "Or run individual commands:"
echo "  Backend:  make dev-backend"
echo "  Frontend: make dev-frontend"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001"
echo "  Health:   http://localhost:3001/health"
echo ""
