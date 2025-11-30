# DuoDrive Backend Deployment Guide

## Local Docker Deployment

### Prerequisites
- Docker installed on your machine
- `.env` file with required environment variables

### Step 1: Create `.env` file
Copy `.env.example` and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
PORT=8080
GEMINI_API_KEY=your_actual_api_key_here
SESSION_SECRET=your_secure_random_string_here
```

### Step 2: Build the Docker Image
```bash
docker build -t duodrive-backend:latest .
```

### Step 3: Run the Container
```bash
docker run -d \
  --name duodrive-backend \
  -p 8080:8080 \
  --env-file .env \
  duodrive-backend:latest
```

### Step 4: Verify it's Running
```bash
# Check container status
docker ps

# View logs
docker logs duodrive-backend

# Follow logs in real-time
docker logs -f duodrive-backend
```

### Useful Docker Commands
```bash
# Stop the container
docker stop duodrive-backend

# Start the container
docker start duodrive-backend

# Restart the container
docker restart duodrive-backend

# Remove the container
docker rm duodrive-backend

# Remove the image
docker rmi duodrive-backend:latest

# Access container shell (for debugging)
docker exec -it duodrive-backend sh
```

---

## Railway Deployment

### Method 1: Using Railway CLI (Recommended)

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login to Railway
```bash
railway login
```

#### Step 3: Initialize Project
```bash
cd /path/to/backend
railway init
```

#### Step 4: Add Environment Variables
```bash
railway variables set PORT=8080
railway variables set GEMINI_API_KEY=your_actual_api_key_here
railway variables set SESSION_SECRET=your_secure_random_string_here
```

Or set them all at once from your `.env` file:
```bash
railway variables set $(cat .env | xargs)
```

#### Step 5: Deploy
```bash
railway up
```

### Method 2: Using Railway Dashboard (Web UI)

#### Step 1: Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Choose "Deploy from GitHub repo" or "Empty Project"

#### Step 2: Connect Your Repository
1. If using GitHub: Select your repository
2. If using empty project: You'll deploy via CLI or connect later

#### Step 3: Add Environment Variables
1. Go to your project dashboard
2. Click on your service
3. Navigate to the **"Variables"** tab
4. Click **"+ New Variable"**
5. Add each variable:
   - `PORT` = `8080`
   - `GEMINI_API_KEY` = `your_actual_api_key_here`
   - `SESSION_SECRET` = `your_secure_random_string_here`

**Alternative**: Use **"Raw Editor"** to paste all at once:
```
PORT=8080
GEMINI_API_KEY=your_actual_api_key_here
SESSION_SECRET=your_secure_random_string_here
```

#### Step 4: Configure Build Settings
Railway should auto-detect the Dockerfile. If not:
1. Go to **"Settings"** tab
2. Under **"Build"**, ensure:
   - **Builder**: Docker
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Build Context**: `.` (current directory)

#### Step 5: Deploy
1. Railway will automatically deploy when you push to your connected branch
2. Or click **"Deploy"** button manually

### Method 3: Using railway.json Configuration

Create a `railway.json` file in your backend directory:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node index.js",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port number for the server | `8080` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `SESSION_SECRET` | Secret key for session encryption | `random_secure_string_123` |

### Generating a Secure SESSION_SECRET

On Linux/Mac:
```bash
openssl rand -base64 32
```

On Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker logs duodrive-backend

# Check if port is already in use
lsof -i :8080
```

### Railway deployment fails
1. Check build logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure Dockerfile is in the correct location
4. Check that your repository is properly connected

### Health check failing
The Dockerfile includes a health check for `/api/v1/health`. Make sure this endpoint exists in your backend, or remove the HEALTHCHECK line from the Dockerfile.

---

## Production Checklist

- [ ] All environment variables are set
- [ ] `SESSION_SECRET` is a strong, random value
- [ ] `GEMINI_API_KEY` is valid and has proper quotas
- [ ] CORS origins are configured for your production frontend URL
- [ ] Health check endpoint is implemented
- [ ] Logs are being monitored
- [ ] Database (if any) is properly connected
