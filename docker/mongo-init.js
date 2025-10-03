db = db.getSiblingDB("8n8");

db.createUser({
  user: "8n8-user",
  pwd: "8n8-password",
  roles: [
    {
      role: "readWrite",
      db: "8n8",
    },
  ],
});

db.createCollection("users");
db.createCollection("workflows");
db.createCollection("webhooks");
db.createCollection("credentials");
db.createCollection("executions");
db.createCollection("otp_tokens");

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ createdAt: 1 });

db.workflows.createIndex({ userId: 1 });
db.workflows.createIndex({ enabled: 1 });
db.workflows.createIndex({ createdAt: 1 });
db.workflows.createIndex({ updatedAt: 1 });

db.webhooks.createIndex({ path: 1 }, { unique: true });
db.webhooks.createIndex({ workflowId: 1 });
db.webhooks.createIndex({ userId: 1 });
db.webhooks.createIndex({ createdAt: 1 });

db.credentials.createIndex({ userId: 1 });
db.credentials.createIndex({ platform: 1 });
db.credentials.createIndex({ createdAt: 1 });

db.executions.createIndex({ workflowId: 1 });
db.executions.createIndex({ userId: 1 });
db.executions.createIndex({ status: 1 });
db.executions.createIndex({ startedAt: 1 });
db.executions.createIndex({ createdAt: 1 });

db.otp_tokens.createIndex({ token: 1 }, { unique: true });
db.otp_tokens.createIndex({ email: 1 });
db.otp_tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

print("MongoDB initialization completed successfully!");
print("Database: 8n8");
print("User: 8n8-user");
print(
  "Collections created: users, workflows, webhooks, credentials, executions, otp_tokens",
);
print("Indexes created for optimal performance");
