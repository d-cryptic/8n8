# Docker Setup for 8n8 Clone

This guide explains how to set up MongoDB using Docker Compose for the 8n8 clone project.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ for running the application

## Quick Start

### 1. Start MongoDB with Docker

```bash
# Start MongoDB and Mongo Express
make docker-up

# Or manually:
docker-compose up -d
```

This will start:
- **MongoDB**: Running on port 27017
- **Mongo Express**: Web UI on port 8081 (admin/admin123)

### 2. Complete Setup with Backend Configuration

```bash
# Complete Docker setup (recommended)
make docker-setup
```

This command will:
1. Start MongoDB containers
2. Wait for MongoDB to be ready
3. Copy Docker environment configuration
4. Set up database schema with Prisma

### 3. Start the Application

```bash
# Install dependencies
make install

# Start the application
make dev
```

## Docker Services

### MongoDB Service
- **Image**: mongo:7.0
- **Port**: 27017
- **Database**: n8n-clone
- **User**: 8n8-user
- **Password**: 8n8-password
- **Root User**: admin
- **Root Password**: password123

### Mongo Express Service
- **Image**: mongo-express:1.0.2
- **Port**: 8081
- **Username**: admin
- **Password**: admin123
- **URL**: http://localhost:8081

## Docker Commands

### Available Make Commands

```bash
make docker-up      # Start MongoDB containers
make docker-down    # Stop MongoDB containers
make docker-logs    # View MongoDB logs
make docker-reset   # Reset MongoDB data (WARNING: deletes all data)
make docker-setup   # Complete Docker setup with backend configuration
```

### Manual Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f mongodb

# Reset data (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# Check service status
docker-compose ps
```

## Database Configuration

### Connection String
```
mongodb://8n8-user:8n8-password@localhost:27017/n8n-clone?authSource=n8n-clone
```

### Environment Variables
The Docker environment file (`backend/env.docker`) contains:
- MongoDB connection string
- JWT configuration
- Service API keys (Resend, Telegram)
- Server configuration

### Database Initialization
The MongoDB container automatically:
1. Creates the `n8n-clone` database
2. Creates the `8n8-user` with read/write permissions
3. Creates all required collections
4. Sets up performance indexes

## Accessing the Database

### 1. Mongo Express (Web UI)
- URL: http://localhost:8081
- Username: admin
- Password: admin123

### 2. MongoDB Shell
```bash
# Connect to MongoDB
docker exec -it 8n8-mongodb mongosh

# Switch to application database
use n8n-clone

# Authenticate as application user
db.auth('8n8-user', '8n8-password')
```

### 3. External MongoDB Client
- Host: localhost
- Port: 27017
- Database: n8n-clone
- Username: 8n8-user
- Password: 8n8-password
- Authentication Database: n8n-clone

## Data Persistence

### Volumes
- `mongodb_data`: Persistent storage for MongoDB data
- Data persists between container restarts
- Located in Docker's default volume location

### Backup and Restore

#### Backup
```bash
# Create backup
docker exec 8n8-mongodb mongodump --db n8n-clone --out /backup

# Copy backup to host
docker cp 8n8-mongodb:/backup ./mongodb-backup
```

#### Restore
```bash
# Copy backup to container
docker cp ./mongodb-backup 8n8-mongodb:/restore

# Restore database
docker exec 8n8-mongodb mongorestore --db n8n-clone /restore/n8n-clone
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 27017
   lsof -i :27017
   
   # Stop conflicting services
   sudo systemctl stop mongod  # If MongoDB is installed locally
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs mongodb
   
   # Check container status
   docker-compose ps
   ```

3. **Connection Refused**
   ```bash
   # Wait for MongoDB to be ready
   docker-compose logs -f mongodb
   
   # Check if MongoDB is accepting connections
   docker exec 8n8-mongodb mongosh --eval "db.adminCommand('ping')"
   ```

4. **Permission Denied**
   ```bash
   # Check if user exists
   docker exec 8n8-mongodb mongosh --eval "use n8n-clone; db.getUsers()"
   
   # Recreate user if needed
   docker exec 8n8-mongodb mongosh --eval "use n8n-clone; db.createUser({user: '8n8-user', pwd: '8n8-password', roles: ['readWrite']})"
   ```

### Reset Everything
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Remove any orphaned containers
docker-compose down --remove-orphans

# Start fresh
make docker-setup
```

## Production Considerations

For production deployment:

1. **Change Default Passwords**
   - Update passwords in `docker-compose.yml`
   - Update connection strings in environment files

2. **Use Secrets Management**
   - Use Docker secrets or environment files
   - Don't commit passwords to version control

3. **Network Security**
   - Use Docker networks
   - Restrict port exposure
   - Use SSL/TLS for connections

4. **Monitoring**
   - Add health checks
   - Set up logging
   - Monitor resource usage

5. **Backup Strategy**
   - Regular automated backups
   - Test restore procedures
   - Off-site backup storage

## Development Workflow

1. **Start Development Environment**
   ```bash
   make docker-setup  # One-time setup
   make dev           # Start application
   ```

2. **Reset Database During Development**
   ```bash
   make docker-reset  # Reset MongoDB data
   make db-setup      # Recreate schema
   ```

3. **View Database**
   - Open http://localhost:8081 (Mongo Express)
   - Browse collections and documents
   - Run queries and updates

4. **Stop Development Environment**
   ```bash
   make docker-down   # Stop MongoDB
   # Application will stop when you stop the dev server
   ```

This Docker setup provides a complete, isolated MongoDB environment for development and testing of the 8n8 clone application.
