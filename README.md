# n8n Clone

A full-stack workflow automation platform built with React, Node.js, TypeScript, and MongoDB. This project replicates core functionality of n8n with a modern, intuitive interface.

## Features

### Core Functionality
- **Visual Workflow Builder**: Drag-and-drop interface using ReactFlow
- **Custom Nodes**: Start, End, Webhook, Email, and Telegram nodes
- **Workflow Management**: Create, edit, save, and execute workflows
- **User Authentication**: Email/password with OTP verification
- **Credential Management**: Secure storage of API keys and tokens
- **Execution Monitoring**: Track workflow runs and their status
- **Webhook Support**: Trigger workflows via HTTP webhooks

### Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui, ReactFlow
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: MongoDB
- **Email Service**: Resend
- **Icons**: Lucide React

## Project Structure

```
8n8/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/       # Email service
│   │   └── index.ts        # Main server file
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── lib/            # Utilities
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm/bun
- MongoDB (local or cloud)
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd 8n8
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create environment file:
```bash
cp env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="mongodb://localhost:27017/n8n-clone"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend Email
RESEND_API_KEY="your-resend-api-key"

# Telegram Bot
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create environment file:
```bash
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Workflows
- `GET /api/workflow` - List user workflows
- `POST /api/workflow` - Create workflow
- `GET /api/workflow/:id` - Get workflow details
- `PUT /api/workflow/:id` - Update workflow
- `DELETE /api/workflow/:id` - Delete workflow
- `POST /api/workflow/:id/execute` - Execute workflow

### Credentials
- `GET /api/credential` - List user credentials
- `POST /api/credential` - Create credential
- `GET /api/credential/:id` - Get credential details
- `PUT /api/credential/:id` - Update credential
- `DELETE /api/credential/:id` - Delete credential
- `POST /api/credential/:id/test` - Test credential

### Webhooks
- `GET /api/webhook` - List user webhooks
- `POST /api/webhook` - Create webhook
- `GET /api/webhook/:id` - Get webhook details
- `PUT /api/webhook/:id` - Update webhook
- `DELETE /api/webhook/:id` - Delete webhook
- `* /api/webhook/handler/:id` - Webhook handler endpoint

### Executions
- `GET /api/execution` - List user executions
- `GET /api/execution/:id` - Get execution details
- `POST /api/execution/:id/cancel` - Cancel execution
- `DELETE /api/execution/:id` - Delete execution

## Database Schema

### Users
- `id`, `email`, `name`, `password`, `googleId`, `isVerified`, `createdAt`, `updatedAt`

### Workflows
- `id`, `title`, `enabled`, `nodes` (JSON), `connections` (JSON), `userId`, `createdAt`, `updatedAt`

### Webhooks
- `id`, `title`, `method`, `path`, `header`, `secret`, `workflowId`, `userId`, `createdAt`, `updatedAt`

### Credentials
- `id`, `title`, `platform`, `data` (JSON), `userId`, `createdAt`, `updatedAt`

### Executions
- `id`, `workflowId`, `userId`, `status`, `tasksDone`, `result` (JSON), `error`, `startedAt`, `completedAt`, `createdAt`, `updatedAt`

## Custom Nodes

### Start Node
- **Type**: `start`
- **Purpose**: Workflow trigger point
- **Icon**: Play button
- **Color**: Green

### End Node
- **Type**: `end`
- **Purpose**: Workflow completion point
- **Icon**: Square
- **Color**: Red

### Webhook Node
- **Type**: `webhook`
- **Purpose**: HTTP webhook trigger
- **Icon**: Webhook symbol
- **Color**: Blue

### Email Node
- **Type**: `email`
- **Purpose**: Send emails via Resend
- **Icon**: Mail
- **Color**: Orange

### Telegram Node
- **Type**: `telegram`
- **Purpose**: Send Telegram messages
- **Icon**: Send
- **Color**: Cyan

## Development

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run start        # Start production build
npx prisma studio    # Open database GUI
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Database Management
```bash
cd backend
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open database GUI
npx prisma db seed   # Seed database (if configured)
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `RESEND_API_KEY` - Resend email service API key
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- [ ] Google OAuth integration
- [ ] Advanced workflow execution engine
- [ ] More node types (HTTP, Database, etc.)
- [ ] Workflow templates
- [ ] Team collaboration features
- [ ] Advanced scheduling (cron jobs)
- [ ] Workflow versioning
- [ ] Real-time execution monitoring
- [ ] Workflow analytics and insights

## Support

For support, please open an issue in the GitHub repository or contact the development team.
