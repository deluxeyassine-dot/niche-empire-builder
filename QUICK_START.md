# Quick Start Guide

Get your Niche Empire Builder deployed in 5 minutes!

## 🚀 Fast Track Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
cd niche-empire-builder
vercel --prod
```

### 4. Add Essential Environment Variables

```bash
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key

vercel env add SUPABASE_URL
# Paste your Supabase URL

vercel env add SUPABASE_ANON_KEY
# Paste your Supabase anonymous key
```

### 5. Redeploy

```bash
vercel --prod
```

**Done! 🎉** Your empire builder is live!

---

## 📝 Get Your API Keys

### OpenAI (Required)
1. Visit: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

### Supabase (Required)
1. Visit: https://supabase.com
2. Create new project
3. Go to Settings → API
4. Copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Optional Keys
- **Anthropic (Claude)**: https://console.anthropic.com/
- **SendGrid (Email)**: https://app.sendgrid.com/settings/api_keys
- **Google Analytics**: https://analytics.google.com/

---

## 🌐 Connect to GitHub (Optional)

### Push to GitHub

```bash
# Create a new repo on GitHub first, then:

git remote add origin https://github.com/yourusername/niche-empire-builder.git
git branch -M main
git push -u origin main
```

### Auto-Deploy from GitHub

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy"

Every push to `main` will auto-deploy!

---

## 🔧 Local Development

### Install Dependencies

```bash
npm install
```

### Create .env.local

```env
OPENAI_API_KEY=sk-your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 📊 Access Your Dashboard

After deployment, visit:

```
https://your-project.vercel.app
```

Enter:
- **Niche**: fitness
- **API Key**: (your production API key)
- Click "Quick Start" or "Launch Dashboard"

---

## 🆘 Common Issues

### Build fails?
```bash
npm run build
# Fix any TypeScript errors shown
```

### Environment variables not working?
```bash
vercel env pull
vercel --prod
```

### Need to rollback?
```bash
vercel rollback
```

---

## 📚 Next Steps

- ✅ Read full [README.md](./README.md)
- ✅ Check [DEPLOYMENT.md](./DEPLOYMENT.md) for advanced options
- ✅ Explore [examples/](./examples/) for code samples
- ✅ Set up custom domain
- ✅ Enable monitoring and analytics

---

## 💡 Pro Tips

1. **Use Vercel Edge Functions** for faster response times
2. **Enable Analytics** to track usage: `vercel analytics`
3. **Set up alerts** for deployment failures
4. **Monitor costs** in Vercel dashboard
5. **Update regularly**: `npm update && vercel --prod`

---

**Happy Empire Building! 👑**

Need help? Open an issue: https://github.com/yourusername/niche-empire-builder/issues
