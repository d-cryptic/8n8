# 8n8 Clone Demo Guide

This guide will walk you through testing the n8n clone application.

## Prerequisites

1. MongoDB running locally or MongoDB Atlas connection
2. Node.js 18+ installed
3. Resend API key for email functionality
4. Telegram bot token for Telegram functionality

## Setup

1. **Install dependencies:**
   ```bash
   make install
   # or manually:
   # cd backend && npm install
   # cd frontend && npm install
   ```

2. **Configure environment:**
   ```bash
   # Copy and edit backend environment
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   
   # Frontend environment is already configured
   ```

3. **Setup database:**
   ```bash
   make db-setup
   # or manually:
   # cd backend && npx prisma generate && npx prisma db push
   ```

4. **Start the application:**
   ```bash
   make dev
   # or start individually:
   # make dev-backend
   # make dev-frontend
   ```

## Testing the Application

### 1. User Registration and Authentication

1. Open http://localhost:5173
2. Click "Sign Up" tab
3. Enter email, password, and optional name
4. Check your email for OTP verification code
5. Enter the OTP to complete registration
6. You should be logged in and redirected to the dashboard

### 2. Creating Credentials

1. Navigate to "Credentials" in the sidebar
2. Click "Add Credential"
3. Create a Telegram credential:
   - Title: "My Telegram Bot"
   - Platform: "Telegram"
   - Bot Token: Your Telegram bot token
4. Create an Email credential:
   - Title: "My Email Service"
   - Platform: "Email (Resend)"
   - API Key: Your Resend API key
5. Test each credential using the "Test" button

### 3. Creating a Workflow

1. Navigate to "Workflows" in the sidebar
2. Click "New Workflow" or go to http://localhost:5173/workflow
3. You'll see a workflow editor with:
   - Start node (green circle with play icon)
   - End node (red circle with square icon)
4. Add nodes by clicking the buttons in the left panel:
   - Webhook node (blue with webhook icon)
   - Send Email node (orange with mail icon)
   - Send Telegram node (cyan with send icon)
5. Connect nodes by dragging from output handles to input handles
6. Configure nodes by selecting them and editing their data
7. Save the workflow with a meaningful title

### 4. Configuring Nodes

#### Email Node Configuration:
```json
{
  "to": "recipient@example.com",
  "subject": "Test Email from 8n8 Clone",
  "body": "<h1>Hello World!</h1><p>This is a test email from the workflow.</p>",
  "from": "n8n-clone@yourdomain.com"
}
```

#### Telegram Node Configuration:
```json
{
  "chatId": "@your_username_or_chat_id",
  "message": "Hello from 8n8 Clone! 🚀",
  "parseMode": "HTML"
}
```

### 5. Testing Workflow Execution

1. **Manual Execution:**
   - In the workflow editor, click the "Run" button
   - Check the "Executions" page to see the execution status
   - Monitor the execution progress and results

2. **Webhook Execution:**
   - Create a webhook for your workflow
   - Copy the webhook URL
   - Send a POST request to the webhook URL:
     ```bash
     curl -X POST http://localhost:3001/api/webhook/handler/YOUR_WEBHOOK_ID \
       -H "Content-Type: application/json" \
       -d '{"test": "data"}'
     ```

### 6. Monitoring Executions

1. Navigate to "Executions" in the sidebar
2. View all workflow executions with their status
3. Click on an execution to see detailed information
4. Check execution logs and error messages

## Sample Workflows

### 1. Simple Email Notification
- Start → Email → End
- Configure email node with recipient and message
- Run manually to test

### 2. Telegram Alert
- Start → Telegram → End
- Configure telegram node with chat ID and message
- Run manually to test

### 3. Webhook to Email
- Webhook → Email → End
- Create webhook for the workflow
- Send data to webhook URL
- Email will be sent with webhook data

### 4. Webhook to Telegram
- Webhook → Telegram → End
- Create webhook for the workflow
- Send data to webhook URL
- Telegram message will be sent

## API Testing

### Authentication
```bash
# Register
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Verify OTP (check email for code)
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'

# Login
curl -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### Workflows
```bash
# Create workflow (use token from login)
curl -X POST http://localhost:3001/api/workflow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Workflow",
    "nodes": [{"id": "1", "type": "start", "data": {"label": "Start"}, "position": {"x": 100, "y": 100}}],
    "connections": []
  }'

# Execute workflow
curl -X POST http://localhost:3001/api/workflow/WORKFLOW_ID/execute \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"test": "value"}}'
```

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Ensure MongoDB is running
   - Check DATABASE_URL in backend/.env
   - Run `npx prisma db push` to sync schema

2. **Email Not Sending:**
   - Verify Resend API key is correct
   - Check Resend domain configuration
   - Ensure email credentials are properly configured

3. **Telegram Not Working:**
   - Verify bot token is correct
   - Ensure bot is added to the target chat
   - Check chat ID format (use @username or numeric ID)

4. **Webhook Not Triggering:**
   - Verify webhook URL is correct
   - Check webhook secret if configured
   - Ensure workflow is enabled

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in backend/.env

### Logs

- Backend logs: Check terminal where `make dev-backend` is running
- Frontend logs: Check browser console
- Database logs: Check MongoDB logs

## Next Steps

1. **Add More Node Types:**
   - HTTP request node
   - Database operations
   - File operations
   - Conditional logic

2. **Advanced Features:**
   - Workflow scheduling (cron jobs)
   - Workflow templates
   - Team collaboration
   - Advanced error handling

3. **Monitoring:**
   - Real-time execution monitoring
   - Performance metrics
   - Alerting system

## Support

If you encounter issues:
1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check MongoDB connection and schema
5. Verify external service credentials (Resend, Telegram)
