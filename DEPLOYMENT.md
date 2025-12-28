# Deployment Guide

Complete guide for deploying Niche Empire Builder to Vercel and other platforms.

---

## 🎉 LATEST DEPLOYMENT STATUS

**Date**: December 28, 2024
**Status**: ✅ Successfully Deployed to Production
**Build Time**: ~23 seconds
**Deployment URL**: https://niche-empire-builder.vercel.app

### Live URLs
- **Production**: https://niche-empire-builder.vercel.app
- **Alternative**: https://niche-empire-builder-yassines-projects-b4400631.vercel.app
- **Latest Build**: https://niche-empire-builder-7wlmps7ko-yassines-projects-b4400631.vercel.app

### What Was Deployed
- ✅ Main TypeScript Project (dist/)
- ✅ React Dashboard with all components:
  - EmpireCreator - Create new niche empires
  - EmpireManager - Manage existing empires
  - MetricsDisplay - Beautiful charts and analytics
  - AgentControls - Control and monitor AI agents
  - LiveMonitor - Real-time activity monitoring

### Bundle Size
- **index.html**: 0.60 KB (gzipped: 0.38 KB)
- **CSS**: 29.79 KB (gzipped: 5.42 KB)
- **JavaScript**: 178.66 KB (gzipped: 52.96 KB)
- **Total**: ~209 KB (gzipped: ~58 KB)

### Build Configuration
```bash
# Build command used
cd src/dashboard && npm ci && npm run build

# Output directory
src/dashboard/dist
```

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [GitHub Integration](#github-integration)
- [Custom Domain Setup](#custom-domain-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Git installed and configured
- ✅ Vercel account (free tier available at [vercel.com](https://vercel.com))
- ✅ GitHub account (optional, for CI/CD)
- ✅ API keys for integrations (OpenAI, Supabase, etc.)

---

## Vercel Deployment

### Method 1: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate via email or GitHub.

#### Step 3: Configure Environment Variables

Create a `.env.local` file in your project root (already in .gitignore):

```env
# Core API Keys
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Deployment
VERCEL_TOKEN=your-vercel-token
NETLIFY_TOKEN=your-netlify-token

# Social Media APIs
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

# Email Services
SENDGRID_API_KEY=SG.your-sendgrid-key
MAILCHIMP_API_KEY=your-mailchimp-key

# Analytics
GOOGLE_ANALYTICS_ID=G-your-ga-id
MIXPANEL_TOKEN=your-mixpanel-token

# AWS (for S3 storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
S3_BUCKET=your-bucket-name
```

#### Step 4: Add Environment Variables to Vercel

```bash
# Add each environment variable
vercel env add OPENAI_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development (or as needed)

vercel env add ANTHROPIC_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
# ... continue for all variables
```

Or use the Vercel dashboard:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable

#### Step 5: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

Your deployment will be live at: `https://niche-empire-builder.vercel.app`

#### Step 6: Verify Deployment

```bash
# Check deployment status
vercel ls

# View logs
vercel logs
```

---

### Method 2: Deploy via Vercel Dashboard

#### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub
# Then push your code:

git remote add origin https://github.com/yourusername/niche-empire-builder.git
git branch -M main
git push -u origin main
```

#### Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Step 3: Add Environment Variables

In the Vercel project settings:
1. Click "Environment Variables"
2. Add all variables from your `.env.local` file
3. Select which environments (Production, Preview, Development)

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your deployment URL

---

### Method 3: Deploy via GitHub Actions (CI/CD)

#### Step 1: Create GitHub Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Step 2: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

#### Step 3: Push to Trigger Deployment

```bash
git add .
git commit -m "Setup CI/CD"
git push origin main
```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Claude AI API key | `sk-ant-...` |
| `GOOGLE_ANALYTICS_ID` | GA tracking ID | `G-XXXXXXXXXX` |
| `SENDGRID_API_KEY` | Email service API key | `SG...` |

### Getting API Keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and save securely

**Supabase:**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → API
4. Copy URL and keys

**Vercel Token:**
```bash
# Generate token via CLI
vercel token create
```

Or via dashboard:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy and save

---

## GitHub Integration

### Step 1: Connect GitHub to Vercel

1. Go to Vercel dashboard
2. Settings → Git
3. Connect your GitHub account
4. Authorize Vercel

### Step 2: Configure Auto-Deployment

Vercel automatically deploys:
- **Production**: Push to `main` branch
- **Preview**: Push to any branch or PR
- **Development**: Local development

### Step 3: Environment Variable Sync

```bash
# Pull environment variables
vercel env pull

# This creates .env.local
```

---

## Custom Domain Setup

### Step 1: Add Domain to Vercel

```bash
# Add domain via CLI
vercel domains add yourdomain.com
```

Or via dashboard:
1. Project Settings → Domains
2. Add domain
3. Configure DNS

### Step 2: Configure DNS

Add these DNS records to your domain provider:

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Verify Domain

```bash
# Check domain status
vercel domains ls
```

SSL certificate will be automatically provisioned (Let's Encrypt).

---

## Post-Deployment Configuration

### 1. Set Up Cron Jobs

Cron jobs are configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-empires",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 2. Configure Analytics

Add to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3. Set Up Monitoring

Enable Vercel Analytics:
```bash
vercel analytics
```

Or use external services:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **New Relic** for APM

---

## Troubleshooting

### Build Failures

**Issue**: Build fails with TypeScript errors

```bash
# Check TypeScript locally
npm run build

# Fix any type errors
```

**Issue**: Missing dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Environment Variable Issues

**Issue**: API keys not working

```bash
# Verify variables are set
vercel env ls

# Pull latest variables
vercel env pull

# Re-deploy
vercel --prod
```

### Deployment Timeout

**Issue**: Deployment times out

```json
// In vercel.json, increase timeout
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### CORS Issues

**Issue**: API requests blocked by CORS

```json
// In vercel.json, add CORS headers
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Check Deployment Logs

```bash
# View real-time logs
vercel logs --follow

# View specific deployment
vercel logs <deployment-url>
```

---

## Rollback Deployment

```bash
# List deployments
vercel ls

# Promote a previous deployment
vercel promote <deployment-url>
```

Or via dashboard:
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

---

## Performance Optimization

### 1. Enable Edge Caching

```json
// In vercel.json
{
  "headers": [
    {
      "source": "/(.*\\.(js|css|png|jpg))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Enable Compression

Vercel automatically compresses responses with Brotli/Gzip.

### 3. Use Edge Functions

For ultra-low latency, use Vercel Edge Functions:

```typescript
// api/edge-example.ts
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  return new Response('Hello from the edge!');
}
```

---

## Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Enable security headers** - Already configured in `vercel.json`
3. **Use HTTPS only** - Enforced by Vercel
4. **Implement rate limiting** - For API endpoints
5. **Enable CORS selectively** - Only allow trusted origins in production
6. **Rotate API keys regularly** - Update in Vercel dashboard
7. **Monitor for vulnerabilities** - Use `npm audit`

---

## Monitoring and Maintenance

### Set Up Alerts

```bash
# Vercel CLI
vercel notifications add --type deployment-failed
```

### Monitor Uptime

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

### Regular Maintenance

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel CLI Reference**: https://vercel.com/docs/cli
- **Vercel Edge Functions**: https://vercel.com/docs/functions/edge-functions
- **Vercel Analytics**: https://vercel.com/docs/analytics

---

## Support

If you encounter issues:

1. Check [Vercel Status](https://www.vercel-status.com/)
2. Review [Vercel Support](https://vercel.com/support)
3. Open an issue on [GitHub](https://github.com/yourusername/niche-empire-builder/issues)
4. Contact: support@nicheempirebuilder.com

---

**Deployment Complete! 🚀**

Your Niche Empire Builder is now live and ready to create empires!
