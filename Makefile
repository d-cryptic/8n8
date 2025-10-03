# n8n Clone Development Commands

.PHONY: help install dev build clean

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev: ## Start development servers
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:3001"
	@echo "Frontend: http://localhost:5173"
	@echo "Press Ctrl+C to stop all servers"
	@trap 'kill 0' EXIT; \
	cd backend && npm run dev & \
	cd frontend && npm run dev & \
	wait

dev-backend: ## Start only backend development server
	cd backend && npm run dev

dev-frontend: ## Start only frontend development server
	cd frontend && npm run dev

build: ## Build both backend and frontend for production
	@echo "Building backend..."
	cd backend && npm run build
	@echo "Building frontend..."
	cd frontend && npm run build

db-setup: ## Setup database with Prisma
	cd backend && npx prisma generate && npx prisma db push

db-studio: ## Open Prisma Studio
	cd backend && npx prisma studio

clean: ## Clean node_modules and build artifacts
	@echo "Cleaning backend..."
	cd backend && rm -rf node_modules dist
	@echo "Cleaning frontend..."
	cd frontend && rm -rf node_modules dist

test: ## Run tests (when implemented)
	@echo "Tests not implemented yet"

lint: ## Run linters
	@echo "Linting backend..."
	cd backend && npm run lint || true
	@echo "Linting frontend..."
	cd frontend && npm run lint

docker-up: ## Start MongoDB with Docker Compose
	@echo "Starting MongoDB with Docker Compose..."
	docker-compose up -d
	@echo "MongoDB is running on port 27017"
	@echo "Mongo Express (Web UI) is available at http://localhost:8081"
	@echo "Username: admin, Password: admin123"

docker-down: ## Stop MongoDB Docker containers
	@echo "Stopping MongoDB containers..."
	docker-compose down

docker-logs: ## View MongoDB container logs
	docker-compose logs -f mongodb

docker-reset: ## Reset MongoDB data (WARNING: This will delete all data)
	@echo "WARNING: This will delete all MongoDB data!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	docker-compose down -v
	docker-compose up -d

docker-setup: ## Setup MongoDB with Docker and configure backend
	@echo "Setting up MongoDB with Docker..."
	make docker-up
	@echo "Waiting for MongoDB to be ready..."
	sleep 10
	@echo "Copying Docker environment file..."
	cp backend/env.docker backend/.env
	@echo "Setting up database schema..."
	cd backend && npx prisma generate && npx prisma db push
	@echo "Docker setup complete!"
	@echo "MongoDB: mongodb://8n8-user:8n8-password@localhost:27017/n8n-clone"
	@echo "Mongo Express: http://localhost:8081 (admin/admin123)"
