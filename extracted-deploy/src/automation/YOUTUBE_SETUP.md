# YouTube Automation Setup Guide

Step-by-step guide to set up YouTube Data API v3 automation with OAuth2 authentication.

---

## Table of Contents

1. [Google Cloud Setup](#google-cloud-setup)
2. [Enable YouTube Data API](#enable-youtube-data-api)
3. [Create OAuth Credentials](#create-oauth-credentials)
4. [Install Dependencies](#install-dependencies)
5. [Authentication Flow](#authentication-flow)
6. [First Upload](#first-upload)
7. [Troubleshooting](#troubleshooting)

---

## Google Cloud Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top left)
3. Click "New Project"
4. Enter project name: `youtube-automation`
5. Click "Create"
6. Wait for project creation (~30 seconds)
7. Select your new project from the dropdown

---

## Enable YouTube Data API

### Step 2: Enable Required APIs

1. In Google Cloud Console, navigate to **APIs & Services** → **Library**
2. Search for "YouTube Data API v3"
3. Click on it
4. Click **"Enable"**
5. Wait for API to be enabled

**Other recommended APIs:**
- YouTube Analytics API (for advanced analytics)
- YouTube Reporting API (for detailed reports)

---

## Create OAuth Credentials

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type (or Internal if using Google Workspace)
3. Click **Create**

**App Information:**
- App name: `YouTube Automation Tool`
- User support email: Your email
- App logo: Optional

**App Domain:**
- Application home page: `http://localhost:3000`
- Privacy policy: Can skip for development
- Terms of service: Can skip for development

**Authorized domains:**
- Add: `localhost` (for development)

**Developer contact information:**
- Email addresses: Your email

Click **Save and Continue**

### Step 4: Add Scopes

1. Click **Add or Remove Scopes**
2. Add these scopes:
   ```
   .../auth/youtube
   .../auth/youtube.upload
   .../auth/youtube.readonly
   .../auth/youtubepartner
   .../auth/yt-analytics.readonly
   ```
3. Click **Update**
4. Click **Save and Continue**

### Step 5: Add Test Users (for External apps)

1. Click **Add Users**
2. Add your Google account email
3. Click **Add**
4. Click **Save and Continue**

### Step 6: Create OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `YouTube Automation Client`

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/oauth2callback
http://localhost:3000/auth/callback
```

5. Click **Create**
6. **IMPORTANT**: Download credentials JSON or copy:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxxx`

---

## Install Dependencies

### Step 7: Install Required Packages

```bash
# Install Google APIs client library
npm install googleapis

# Install dotenv for environment variables
npm install dotenv

# Install TypeScript types
npm install --save-dev @types/node
```

---

## Authentication Flow

### Step 8: Create Environment File

Create `.env` file in your project root:

```env
# YouTube API Credentials
YOUTUBE_CLIENT_ID=your-client-id.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=your-client-secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/oauth2callback

# Tokens (will be filled after first auth)
YOUTUBE_ACCESS_TOKEN=
YOUTUBE_REFRESH_TOKEN=
```

### Step 9: First-Time Authentication

Create `authenticate.ts`:

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as fs from 'fs';

dotenv.config();

async function authenticate() {
  const youtube = new YouTubeAutomation({
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!
  });

  // Step 1: Get auth URL
  const authUrl = youtube.getAuthorizationUrl();
  console.log('Visit this URL to authorize:');
  console.log(authUrl);

  // Step 2: Get code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const code = await new Promise<string>(resolve => {
    rl.question('\nEnter the authorization code: ', answer => {
      rl.close();
      resolve(answer);
    });
  });

  // Step 3: Exchange code for tokens
  const { accessToken, refreshToken } = await youtube.authorize(code);

  // Step 4: Save tokens
  const envContent = fs.readFileSync('.env', 'utf-8');
  const updatedEnv = envContent
    .replace(/YOUTUBE_ACCESS_TOKEN=.*/, `YOUTUBE_ACCESS_TOKEN=${accessToken}`)
    .replace(/YOUTUBE_REFRESH_TOKEN=.*/, `YOUTUBE_REFRESH_TOKEN=${refreshToken}`);

  fs.writeFileSync('.env', updatedEnv);

  console.log('\n✅ Tokens saved to .env file!');
  console.log('You can now use the YouTube automation system.');
}

authenticate().catch(console.error);
```

Run authentication:

```bash
ts-node authenticate.ts
```

**Steps:**
1. Script prints authorization URL
2. Open URL in browser
3. Log in to Google account
4. Grant permissions
5. Copy code from redirect URL (`?code=...`)
6. Paste code into terminal
7. Tokens saved to `.env`

---

## First Upload

### Step 10: Test Video Upload

Create `test-upload.ts`:

```typescript
import { YouTubeAutomation } from './automation/YouTubeAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function testUpload() {
  const youtube = new YouTubeAutomation({
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    redirectUri: process.env.YOUTUBE_REDIRECT_URI!,
    accessToken: process.env.YOUTUBE_ACCESS_TOKEN,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN
  });

  // Upload test video
  const videoId = await youtube.uploadVideo(
    './test-video.mp4', // Your video file
    {
      title: 'Test Upload',
      description: 'This is a test upload using YouTube API',
      tags: ['test', 'automation'],
      categoryId: '22', // People & Blogs
      privacyStatus: 'private', // Start with private
      madeForKids: false
    }
  );

  console.log('Video uploaded!');
  console.log(`Watch: https://www.youtube.com/watch?v=${videoId}`);
  console.log(`Edit: https://studio.youtube.com/video/${videoId}/edit`);
}

testUpload().catch(console.error);
```

Run test:

```bash
ts-node test-upload.ts
```

---

## Troubleshooting

### Issue 1: "Invalid Credentials"

**Cause**: Incorrect Client ID or Secret

**Solution**:
1. Verify credentials in Google Cloud Console
2. Ensure `.env` file has correct values
3. No extra spaces or quotes in `.env`

### Issue 2: "Redirect URI Mismatch"

**Cause**: Redirect URI not matching

**Solution**:
1. Check OAuth client settings in Google Cloud Console
2. Ensure redirect URI exactly matches
3. Add both:
   - `http://localhost:3000/oauth2callback`
   - `http://localhost:3000/auth/callback`

### Issue 3: "Access Not Configured"

**Cause**: API not enabled

**Solution**:
1. Go to APIs & Services → Library
2. Enable YouTube Data API v3
3. Wait 1-2 minutes for activation

### Issue 4: "Quota Exceeded"

**Cause**: Daily quota limit reached (10,000 units)

**Solution**:
1. Wait until quota resets (midnight Pacific Time)
2. Request quota increase:
   - Go to APIs & Services → Quotas
   - Select YouTube Data API v3
   - Click "Request Quota Increase"
   - Fill out form with use case

### Issue 5: "Insufficient Permissions"

**Cause**: Missing OAuth scopes

**Solution**:
1. Check OAuth consent screen scopes
2. Re-authenticate with new scopes:
   ```bash
   ts-node authenticate.ts
   ```

### Issue 6: "Token Expired"

**Cause**: Access token expired (1 hour lifetime)

**Solution**:
Token refresh happens automatically if refresh token is set:

```typescript
// Manual refresh if needed
const newAccessToken = await youtube.refreshAccessToken();
```

### Issue 7: "Video Upload Failed"

**Possible causes:**
- File too large (max 256GB)
- Invalid file format
- Network timeout
- Quota exceeded

**Solution**:
1. Check file format (MP4, MOV, AVI, WMV, FLV, WebM)
2. Check file size
3. Verify stable internet connection
4. Check API quota usage

### Issue 8: "App Not Verified"

**Cause**: OAuth consent screen not verified

**Solution**:
For development: Use test users
For production:
1. Submit app for verification
2. Provide privacy policy
3. Provide terms of service
4. Wait for Google review (2-6 weeks)

---

## Production Checklist

### Before Going Live:

- [ ] Submit app for OAuth verification
- [ ] Add privacy policy URL
- [ ] Add terms of service URL
- [ ] Request production quota increase
- [ ] Implement proper error handling
- [ ] Add retry logic for uploads
- [ ] Implement token encryption at rest
- [ ] Set up monitoring and logging
- [ ] Add rate limiting
- [ ] Test with multiple accounts
- [ ] Prepare support documentation
- [ ] Set up backup credentials

---

## Security Best Practices

### 1. Credential Storage

**Development:**
```env
# .env file (add to .gitignore)
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
YOUTUBE_ACCESS_TOKEN=...
YOUTUBE_REFRESH_TOKEN=...
```

**Production:**
Use environment variables or secrets management:
- AWS Secrets Manager
- Google Secret Manager
- Azure Key Vault
- HashiCorp Vault

### 2. Token Encryption

```typescript
import * as crypto from 'crypto';

function encryptToken(token: string, key: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptToken(encrypted: string, key: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3. Rate Limiting

```typescript
class RateLimiter {
  private requests: number = 0;
  private resetTime: number = Date.now() + 86400000; // 24 hours

  async checkQuota(): Promise<boolean> {
    if (Date.now() > this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + 86400000;
    }

    if (this.requests >= 10000) {
      throw new Error('Daily quota exceeded');
    }

    this.requests += 1600; // Video upload cost
    return true;
  }
}
```

---

## Quota Management

### Understanding Quota Costs

| Operation | Quota Cost |
|-----------|------------|
| Video upload | 1,600 |
| Video update | 50 |
| Video delete | 50 |
| Playlist insert | 50 |
| Video list | 1 |
| Search | 100 |

### Daily Limits

- **Default**: 10,000 units/day
- **Quota reset**: Midnight Pacific Time
- **Request increase**: Via Google Cloud Console

### Optimization Tips

1. **Batch operations**: Group similar requests
2. **Cache results**: Store frequently accessed data
3. **Use specific fields**: Only request needed data
4. **Implement retry logic**: Exponential backoff
5. **Monitor usage**: Track quota consumption

---

## Next Steps

1. ✅ Complete authentication setup
2. ✅ Test video upload
3. ✅ Explore automation features
4. 📚 Read [YouTubeAutomation.md](./YouTubeAutomation.md)
5. 💻 Check [examples](../examples/youtube-automation-example.ts)
6. 🚀 Build your automation workflow!

---

## Support Resources

- **YouTube API Docs**: https://developers.google.com/youtube/v3
- **OAuth2 Guide**: https://developers.google.com/identity/protocols/oauth2
- **Quota Info**: https://developers.google.com/youtube/v3/determine_quota_cost
- **Support**: https://developers.google.com/youtube/v3/support

---

**Ready to automate your YouTube workflow!** 🚀
