# TikTok Automation Setup Guide

Step-by-step guide to set up TikTok API automation with OAuth authentication.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [TikTok Developer Setup](#tiktok-developer-setup)
3. [Create TikTok App](#create-tiktok-app)
4. [Get Access Tokens](#get-access-tokens)
5. [Install Dependencies](#install-dependencies)
6. [First Upload](#first-upload)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Requirements

Before starting, ensure you have:

1. **TikTok Account** (personal or business)
2. **TikTok Developer Account**
3. **Node.js 16+** installed
4. **Video content** ready to upload
5. **Verified email** on TikTok account

### Account Eligibility

For Content Posting API access:
- Account must be in good standing
- Must comply with TikTok Community Guidelines
- May require business account for some features
- Age 18+ required

---

## TikTok Developer Setup

### Step 1: Create Developer Account

1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Click **Sign Up** or **Log In**
3. Use your TikTok account credentials
4. Complete developer registration
5. Verify email address

### Step 2: Accept Terms

1. Read TikTok Developer Terms of Service
2. Read API Terms of Service
3. Accept all terms and conditions
4. Complete any required verification

---

## Create TikTok App

### Step 3: Register New App

1. Go to [TikTok Developer Portal](https://developers.tiktok.com/apps/)
2. Click **Create an App** or **+ Manage apps**
3. Fill in app details:

**Basic Information:**
- App name: `TikTok Content Automation`
- App category: `Productivity & Utilities` or `Social Networking`
- App description: Brief description of your automation tool
- App icon: Upload 512x512 PNG (optional)

4. Click **Submit** or **Create**

### Step 4: Configure App Settings

1. Go to your app dashboard
2. Navigate to **Settings** → **Basic Information**
3. Note your credentials:
   - **Client Key**: `aw...` (copy this)
   - **Client Secret**: Click **Show** and copy

4. Save these credentials securely

### Step 5: Add Products

1. In app dashboard, go to **Add Products**
2. Find **Content Posting API**
3. Click **Add** or **Apply**
4. May need to fill application form
5. Wait for approval (usually instant for development)

**Other useful products:**
- Login Kit (for user authentication)
- Research API (for analytics)
- Display API (for showing TikTok content)

### Step 6: Configure OAuth

1. Go to **Login Kit** section
2. Click **Redirect URIs**
3. Add redirect URIs:
   ```
   http://localhost:3000/callback
   http://localhost:3000/auth/callback
   ```
4. For production, add your domain:
   ```
   https://yourdomain.com/callback
   ```
5. Click **Save**

### Step 7: Request Scopes

1. Go to **Content Posting API** settings
2. Request required scopes:
   - `user.info.basic` - Basic user info
   - `video.upload` - Upload videos
   - `video.publish` - Publish videos
   - `video.list` - List videos

3. Submit scope request
4. Wait for approval (may take 1-3 business days)

---

## Get Access Tokens

### Step 8: Generate Access Token

#### Development Token (Quick Start)

For testing, you can use the developer token:

1. Go to your app dashboard
2. Navigate to **Content Posting API**
3. Find **Access Token** section
4. Click **Generate Token**
5. Copy the token (valid for 2 hours)

#### OAuth Flow (Production)

For production, implement OAuth flow:

**Step 1: Authorization URL**

```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';

const tiktok = new TikTokAutomation({
  clientKey: 'your-client-key',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/callback'
});

// Get authorization URL
const authUrl = tiktok.getAuthorizationUrl([
  'user.info.basic',
  'video.upload',
  'video.publish',
  'video.list'
]);

console.log('Visit this URL to authorize:');
console.log(authUrl);
```

**Step 2: User Authorization**

1. User visits authorization URL
2. Logs in to TikTok
3. Grants permissions
4. Redirected to callback with `code` parameter

**Step 3: Exchange Code for Token**

```typescript
// Get code from redirect URL
const code = 'authorization_code_from_callback';

// Exchange for access token
const { accessToken, refreshToken, expiresIn, openId } =
  await tiktok.authorize(code);

console.log('Access Token:', accessToken);
console.log('Refresh Token:', refreshToken);
console.log('Expires in:', expiresIn, 'seconds');
console.log('User Open ID:', openId);

// Save tokens for future use
```

**Token Lifetimes:**
- Access token: 24 hours
- Refresh token: Does not expire (unless revoked)

---

## Install Dependencies

### Step 9: Install Required Packages

```bash
# Install TikTok automation dependencies
npm install axios form-data dotenv

# Install TypeScript types
npm install --save-dev @types/node @types/form-data
```

### Step 10: Create Environment File

Create `.env` file in project root:

```env
# TikTok API Configuration
TIKTOK_CLIENT_KEY=your-client-key-here
TIKTOK_CLIENT_SECRET=your-client-secret-here
TIKTOK_REDIRECT_URI=http://localhost:3000/callback

# Access tokens (fill after OAuth)
TIKTOK_ACCESS_TOKEN=your-access-token
TIKTOK_REFRESH_TOKEN=your-refresh-token
TIKTOK_OPEN_ID=your-open-id
```

**Important**: Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## First Upload

### Step 11: Test Video Upload

Create `test-tiktok.ts`:

```typescript
import { TikTokAutomation } from './automation/TikTokAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function testUpload() {
  const tiktok = new TikTokAutomation({
    clientKey: process.env.TIKTOK_CLIENT_KEY!,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
    accessToken: process.env.TIKTOK_ACCESS_TOKEN!
  });

  try {
    // Upload test video
    const publishId = await tiktok.uploadVideo({
      videoPath: './test-video.mp4',
      title: 'Test upload from TikTok API!',
      description: 'Testing automation 🚀',
      hashtags: ['test', 'automation', 'tiktokapi'],
      privacyLevel: 'SELF_ONLY', // Private post for testing
      duetDisabled: false,
      stitchDisabled: false
    });

    console.log('✅ Video uploaded successfully!');
    console.log(`Publish ID: ${publishId}`);

    // Get video info
    const info = await tiktok.getVideoInfo(publishId);
    console.log(`Share URL: ${info.shareUrl}`);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

testUpload();
```

Run test:

```bash
ts-node test-tiktok.ts
```

### Step 12: Verify Upload

1. Open TikTok app on mobile
2. Go to your profile
3. Check drafts or private videos
4. Verify video uploaded correctly

**Success!** You're now ready to automate TikTok!

---

## Troubleshooting

### Issue 1: "Invalid Client Key"

**Cause**: Incorrect client credentials

**Solutions**:
1. Verify Client Key in TikTok Developer Portal
2. Check for typos in `.env` file
3. Ensure no extra spaces or quotes
4. Regenerate credentials if needed

### Issue 2: "Invalid Access Token"

**Cause**: Token expired or invalid

**Solutions**:
1. Access tokens expire after 24 hours
2. Refresh token using OAuth flow:
   ```typescript
   const newToken = await tiktok.refreshAccessToken();
   ```
3. Re-authenticate if refresh token is invalid
4. Check token permissions/scopes

### Issue 3: "Redirect URI Mismatch"

**Cause**: OAuth redirect URI doesn't match

**Solutions**:
1. Check redirect URI in app settings
2. Ensure exact match (including http/https)
3. Add all needed URIs:
   - `http://localhost:3000/callback`
   - `http://localhost:3000/auth/callback`
4. For production, add your domain

### Issue 4: "Scope Not Approved"

**Cause**: Missing API permissions

**Solutions**:
1. Go to app dashboard → Content Posting API
2. Check scope approval status
3. Request missing scopes
4. Wait for approval (1-3 business days)
5. Re-authenticate after approval

### Issue 5: "Video Upload Failed"

**Possible causes:**
- File too large (>4GB)
- Invalid format
- Network timeout
- Insufficient permissions

**Solutions**:
1. Check video format (MP4 recommended)
2. Verify file size (<4GB)
3. Test with smaller video first
4. Check internet connection
5. Verify Content Posting API is enabled

### Issue 6: "Rate Limit Exceeded"

**Cause**: Too many API calls

**Solutions**:
1. Implement rate limiting delays
2. Reduce upload frequency
3. Wait before retrying
4. Monitor API quota usage
5. Contact TikTok support for increased limits

### Issue 7: "Video File Not Found"

**Cause**: Incorrect file path

**Solutions**:
1. Use absolute paths: `/full/path/to/video.mp4`
2. Or relative to script location
3. Verify file exists: `fs.existsSync(path)`
4. Check file permissions
5. Use forward slashes even on Windows

### Issue 8: "Publishing Disabled"

**Cause**: Account restrictions or API limitations

**Solutions**:
1. Verify account in good standing
2. Check if account is restricted
3. Ensure Content Posting API is approved
4. Try posting as private first (`SELF_ONLY`)
5. Contact TikTok Developer Support

---

## Advanced Setup

### Token Refresh Automation

Implement automatic token refresh:

```typescript
class TokenManager {
  private accessToken: string;
  private refreshToken: string;
  private expiresAt: number;
  private tiktok: TikTokAutomation;

  constructor(tiktok: TikTokAutomation) {
    this.tiktok = tiktok;
  }

  async getToken(): Promise<string> {
    // Check if token expired
    if (Date.now() >= this.expiresAt) {
      console.log('Token expired, refreshing...');
      this.accessToken = await this.tiktok.refreshAccessToken();
      this.expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    }

    return this.accessToken;
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = Date.now() + expiresIn * 1000;
  }
}
```

### Webhook Setup (Advanced)

Set up webhooks for real-time notifications:

1. In TikTok Developer Portal, go to **Webhooks**
2. Add webhook URL (must be HTTPS)
3. Subscribe to events:
   - Video published
   - Comment added
   - Video deleted
4. Verify webhook endpoint
5. Handle webhook events in your app

**Webhook handler example:**

```typescript
import express from 'express';

const app = express();

app.post('/tiktok/webhook', express.json(), (req, res) => {
  const event = req.body;

  console.log('TikTok Event:', event.event);
  console.log('Data:', event.data);

  // Process event
  switch (event.event) {
    case 'video.published':
      console.log('Video published:', event.data.video_id);
      break;
    case 'comment.created':
      console.log('New comment:', event.data.comment_text);
      break;
  }

  res.sendStatus(200);
});

app.listen(3000);
```

---

## Production Checklist

### Before Going Live:

- [ ] App approved for Content Posting API
- [ ] All required scopes approved
- [ ] OAuth flow implemented
- [ ] Token refresh mechanism working
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Logging and monitoring set up
- [ ] Secure token storage (encrypt at rest)
- [ ] Backup authentication method
- [ ] Test with multiple accounts
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] HTTPS enabled for production
- [ ] Environment variables secured

---

## Security Best Practices

### 1. Token Storage

**Development:**
```env
# .env file (add to .gitignore!)
TIKTOK_ACCESS_TOKEN=your-token
```

**Production:**
- Use secrets manager (AWS, Google Cloud, Azure)
- Encrypt tokens at rest
- Never log tokens
- Rotate tokens regularly

### 2. API Security

```typescript
// Encrypt sensitive data
import * as crypto from 'crypto';

function encryptToken(token: string, key: string): string {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### 3. Rate Limiting

```typescript
class RateLimiter {
  private requests: number = 0;
  private resetTime: number = Date.now() + 3600000;

  async checkLimit(): Promise<void> {
    if (Date.now() > this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + 3600000;
    }

    if (this.requests >= 1000) {
      throw new Error('Rate limit exceeded');
    }

    this.requests++;
  }
}
```

---

## API Quotas Summary

### Content Posting API

- **Uploads**: ~1000 per day (varies by account)
- **Rate limit**: Respect 1-2 second delays between requests
- **File size**: Max 4 GB per video
- **Scheduled posts**: Up to 10 days in advance

### Best Practices

1. **Batch operations**: Upload multiple videos in one session
2. **Add delays**: 2-3 seconds between uploads
3. **Monitor quota**: Track daily usage
4. **Off-peak hours**: Upload during low-traffic times
5. **Retry logic**: Implement exponential backoff

---

## Next Steps

1. ✅ Complete TikTok Developer setup
2. ✅ Get API access and tokens
3. ✅ Test video upload
4. ✅ Implement OAuth flow
5. 📚 Read [TikTokAutomation.md](./TikTokAutomation.md)
6. 💻 Check [examples](../examples/tiktok-automation-example.ts)
7. 🚀 Build your automation workflow!

---

## Support Resources

### Documentation
- **TikTok for Developers**: https://developers.tiktok.com/
- **Content Posting API**: https://developers.tiktok.com/doc/content-posting-api-get-started
- **Login Kit**: https://developers.tiktok.com/doc/login-kit-web
- **Research API**: https://developers.tiktok.com/doc/research-api-get-started

### Tools
- **Developer Portal**: https://developers.tiktok.com/apps/
- **API Explorer**: https://developers.tiktok.com/tools/api-explorer

### Support
- **Help Center**: https://developers.tiktok.com/support
- **Community**: https://developers.tiktok.com/community
- **Email**: developer-support@tiktok.com

---

**Ready to automate TikTok!** 🎵🚀
