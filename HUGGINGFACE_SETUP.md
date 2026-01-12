# Step-by-Step: Get FREE Hugging Face API Token

## PART 1: Create Your FREE Token (5 minutes)

### Step 1: Go to Hugging Face
Open your browser and visit: **https://huggingface.co**

### Step 2: Create Account (FREE)
1. Click **"Sign Up"** in the top right
2. Choose signup method:
   - Email (recommended)
   - GitHub
   - Google
3. Fill in your details:
   - Username: `yassine-niche-empire` (or any name)
   - Email: Your email
   - Password: Create a strong password

### Step 3: Verify Email
1. Check your inbox for email from Hugging Face
2. Click the verification link
3. **Important**: You MUST verify before creating tokens

### Step 4: Go to Access Tokens
1. Click your **profile picture** (top right)
2. Click **"Settings"**
3. Click **"Access Tokens"** in the left sidebar
4. Or go directly to: **https://huggingface.co/settings/tokens**

### Step 5: Create New Token
1. Click **"New token"** or **"Create new token"**
2. Fill in:
   - **Name**: `niche-empire-builder` (or any name)
   - **Type**: Select **"Read"** (safer) or **"Write"** (more features)
3. Click **"Generate token"**

### Step 6: COPY YOUR TOKEN
```
⚠️ IMPORTANT: Copy the token NOW!
It looks like: hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
You won't see it again after leaving this page!
```

Save it somewhere safe:
- Password manager (recommended)
- Secure notes app
- NOT in public code repositories

---

## PART 2: Add Token to Niche Empire Builder

### Option A: Environment Variable (Recommended)

1. **Find your `.env.local` file** in the project root:
   ```
   niche-empire-builder/.env.local
   ```

2. **Add this line**:
   ```env
   HUGGINGFACE_TOKEN=hf_your_token_here
   ```

3. **Save the file**

4. **Restart the server**:
   ```bash
   npm run dev
   ```

### Option B: Direct in Settings Page

1. Go to: **http://localhost:3000/api-keys.html**
2. Find "Hugging Face Token" section
3. Paste your token
4. Click "Save"

### Option C: Enter When Generating

The Free Sora Generator page has a token input option:
1. Go to: **http://localhost:3000/free-sora-generator.html**
2. Click "Settings" icon
3. Enter your token
4. Token is stored in browser (localStorage)

---

## PART 3: Test Your Token

### Quick Test (Command Line)
```bash
curl -H "Authorization: Bearer hf_your_token_here" \
  https://api-inference.huggingface.co/models/gpt2
```

If you get a response (not an error), your token works!

### Test in Our System
1. Go to: **http://localhost:3000/free-sora-generator.html**
2. Enter a simple prompt: "A sunset over the ocean"
3. Click "Generate Video"
4. If it starts generating, your token is working!

---

## FREE Tier Limits (What You Get for FREE)

| Feature | Free Tier |
|---------|-----------|
| API Calls | ~30,000/month |
| Rate Limit | ~300 requests/hour |
| Model Access | Most public models |
| Video Generation | Open-Sora, CogVideoX |
| Image Generation | Stable Diffusion |
| Upscaling | Real-ESRGAN |

**This is MORE than enough for most users!**

---

## Troubleshooting

### "401 Unauthorized" Error
- Token not set correctly
- Token expired (create new one)
- Email not verified

### "429 Too Many Requests"
- Wait 1 hour (rate limited)
- Or wait until next month (monthly quota)

### "Model is loading"
- First request takes 20-60 seconds
- Model needs to "wake up" on Hugging Face servers
- Retry after waiting

### Video Generation Timeout
- Open-Sora can take 2-5 minutes
- Don't refresh the page
- Wait for completion

---

## Security Tips

1. **Never share your token publicly**
2. **Don't commit to GitHub** (add to .gitignore)
3. **Create separate tokens** for different uses
4. **Delete unused tokens** from Hugging Face settings
5. **Use "Read" tokens** when possible (more limited = safer)

---

## Quick Reference

| What | Where |
|------|-------|
| Create Token | https://huggingface.co/settings/tokens |
| Open-Sora Demo | https://huggingface.co/spaces/hpcai-tech/open-sora |
| CogVideoX Demo | https://huggingface.co/spaces/THUDM/CogVideoX |
| API Docs | https://huggingface.co/docs/api-inference |
