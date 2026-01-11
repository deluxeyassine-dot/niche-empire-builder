# Instagram Automation Setup Guide

Step-by-step guide to set up Instagram Graph API automation with OAuth authentication.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Facebook Developer Setup](#facebook-developer-setup)
3. [Instagram Business Account](#instagram-business-account)
4. [Get Access Tokens](#get-access-tokens)
5. [Install Dependencies](#install-dependencies)
6. [First Post](#first-post)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Requirements

Before starting, ensure you have:

1. **Instagram Account** (Business or Creator account)
2. **Facebook Page** connected to your Instagram account
3. **Facebook Developer Account**
4. **Node.js 16+** installed
5. **Admin access** to both Instagram and Facebook Page

### Account Setup

#### Convert to Business Account

1. Open Instagram app
2. Go to **Settings** → **Account**
3. Tap **Switch to Professional Account**
4. Choose **Business** or **Creator**
5. Complete business category and contact info

#### Connect Facebook Page

1. In Instagram, go to **Settings** → **Account**
2. Tap **Linked Accounts** → **Facebook**
3. Log in to Facebook
4. Create new Page or link existing Page
5. Confirm connection

**Important**: You must be admin of both Instagram account and Facebook Page.

---

## Facebook Developer Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** (top right)
3. Click **Create App**
4. Select **Business** as app type
5. Click **Next**

**App Details:**
- App name: `Instagram Automation Tool`
- App contact email: Your email
- Business account: Select or create one

6. Click **Create App**
7. Complete security check

### Step 2: Add Instagram Graph API

1. In your app dashboard, scroll to **Add Products**
2. Find **Instagram Graph API**
3. Click **Set Up**
4. Accept terms and conditions

### Step 3: Configure App Settings

1. Go to **Settings** → **Basic**
2. Fill in required fields:
   - **App Domains**: `localhost` (for development)
   - **Privacy Policy URL**: Your privacy policy (required for review)
   - **Terms of Service URL**: Your terms (optional)
   - **App Icon**: Upload logo (optional)

3. Click **Save Changes**

### Step 4: Add Instagram Tester

1. Go to **Roles** → **Instagram Testers**
2. Click **Add Instagram Testers**
3. Enter your Instagram username
4. Click **Submit**

**Accept Invitation:**
1. Open Instagram app
2. Go to **Settings** → **Apps and Websites**
3. Tap **Tester Invites**
4. Accept invitation

---

## Instagram Business Account

### Step 5: Get Business Account ID

**Method 1: Graph API Explorer**

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Click **Generate Access Token**
4. Grant permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
5. Run this query:
   ```
   me/accounts
   ```
6. Find your Facebook Page ID
7. Run this query with Page ID:
   ```
   {page-id}?fields=instagram_business_account
   ```
8. Copy the `instagram_business_account.id`

**Method 2: Facebook Business Settings**

1. Go to [Facebook Business Settings](https://business.facebook.com/settings/)
2. Click **Accounts** → **Instagram Accounts**
3. Find your Instagram account
4. Copy the Instagram Account ID

---

## Get Access Tokens

### Step 6: Generate Access Token

#### Short-Lived Token (1 hour)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click **Generate Access Token**
4. Select permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_manage_metadata`
   - `pages_show_list`
   - `business_management`
5. Click **Generate Access Token**
6. Copy the token (starts with `EAAG...`)

#### Long-Lived Token (60 days)

Use the Access Token Tool to exchange short-lived for long-lived:

1. Go to [Access Token Tool](https://developers.facebook.com/tools/accesstoken/)
2. Find your User Token
3. Click **Extend Access Token**
4. Copy the long-lived token

**Or use API:**

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

Replace:
- `{app-id}`: Your App ID (from Settings → Basic)
- `{app-secret}`: Your App Secret (from Settings → Basic)
- `{short-lived-token}`: Token from Graph API Explorer

Response:
```json
{
  "access_token": "EAAG...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

#### Never-Expiring Token (Page Token)

For production, use Page access token:

```bash
curl -X GET "https://graph.facebook.com/v18.0/{page-id}?fields=access_token&access_token={long-lived-user-token}"
```

This returns a never-expiring Page access token.

---

## Install Dependencies

### Step 7: Install Required Packages

```bash
# Install automation dependencies
npm install axios form-data dotenv

# Install TypeScript types
npm install --save-dev @types/node @types/form-data
```

### Step 8: Create Environment File

Create `.env` file in project root:

```env
# Instagram Graph API Configuration
INSTAGRAM_ACCESS_TOKEN=your-long-lived-access-token
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-account-id

# Optional: Facebook App Credentials
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

**Important**: Add `.env` to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## First Post

### Step 9: Test Image Post

Create `test-instagram.ts`:

```typescript
import { InstagramAutomation } from './automation/InstagramAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function testPost() {
  const instagram = new InstagramAutomation({
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN!,
    businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!
  });

  try {
    // Upload test image
    const mediaId = await instagram.postFeed({
      imageUrl: 'https://picsum.photos/1080/1080', // Random test image
      caption: 'Test post from Instagram Automation! 🚀 #test #automation'
    });

    console.log('✅ Post successful!');
    console.log(`Media ID: ${mediaId}`);
    console.log(`View on Instagram: https://www.instagram.com/p/${mediaId}`);
  } catch (error) {
    console.error('❌ Post failed:', error.message);
  }
}

testPost();
```

Run test:

```bash
ts-node test-instagram.ts
```

### Step 10: Verify Post

1. Open Instagram app
2. Go to your profile
3. Find the test post
4. Verify caption and image

**Success!** You're now ready to automate Instagram posts.

---

## Troubleshooting

### Issue 1: "Invalid OAuth Access Token"

**Cause**: Token expired or invalid

**Solutions**:
1. Generate new token in Graph API Explorer
2. Ensure token has required permissions
3. Check token hasn't expired (use Access Token Tool)
4. For long-lived token, exchange short-lived token

### Issue 2: "Instagram Account Not Found"

**Cause**: Incorrect Business Account ID

**Solutions**:
1. Verify Business Account ID in Graph API Explorer:
   ```
   me/accounts
   {page-id}?fields=instagram_business_account
   ```
2. Ensure account is Business or Creator (not Personal)
3. Verify Facebook Page is connected to Instagram
4. Check you're admin of both Page and Instagram account

### Issue 3: "Insufficient Permissions"

**Cause**: Missing required permissions

**Solutions**:
1. Regenerate token with all required permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
   - `pages_show_list`
2. Accept permissions in Instagram app
3. Grant permissions for your Facebook Page

### Issue 4: "Media URL Invalid"

**Cause**: Image/video URL not accessible

**Solutions**:
1. Ensure URL is publicly accessible (HTTPS)
2. Check image format (JPG, PNG)
3. Verify image meets requirements:
   - Min: 320x320 pixels
   - Max: 8 MB
   - Aspect ratio: 4:5 to 1.91:1
4. Test URL in browser

### Issue 5: "Rate Limit Exceeded"

**Cause**: Too many API calls

**Solutions**:
1. Wait 1 hour (rate limit: 200 calls/hour)
2. Implement rate limiting in code
3. Add delays between posts (min 30 seconds)
4. Use batch operations when possible

### Issue 6: "Business Account Required"

**Cause**: Using Personal Instagram account

**Solutions**:
1. Convert to Business or Creator account:
   - Settings → Account → Switch to Professional Account
2. Connect to Facebook Page
3. Wait 24 hours after conversion
4. Get new Business Account ID

### Issue 7: "Publishing Limit Reached"

**Cause**: Exceeded daily posting limit (25 posts/day)

**Solutions**:
1. Wait until next day (resets midnight UTC)
2. Reduce posting frequency
3. Use scheduling instead of immediate posting
4. Request higher limits from Facebook (business use case)

### Issue 8: "Content Policy Violation"

**Cause**: Content violates Instagram policies

**Solutions**:
1. Review Instagram Community Guidelines
2. Avoid prohibited content:
   - Nudity or sexual content
   - Violence or hate speech
   - Spam or fake engagement
   - Copyright violations
3. Use appropriate captions and hashtags
4. Don't post same content repeatedly

---

## Advanced Setup

### Token Refresh (Production)

For production apps, implement automatic token refresh:

```typescript
class TokenManager {
  private accessToken: string;
  private expiresAt: number;
  private appId: string;
  private appSecret: string;

  async refreshToken(): Promise<string> {
    if (Date.now() < this.expiresAt) {
      return this.accessToken; // Token still valid
    }

    // Exchange for new long-lived token
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: this.appId,
          client_secret: this.appSecret,
          fb_exchange_token: this.accessToken
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.expiresAt = Date.now() + response.data.expires_in * 1000;

    return this.accessToken;
  }
}
```

### Webhook Setup (Real-time Updates)

Receive real-time notifications for comments, mentions, etc.:

1. Go to **Products** → **Webhooks**
2. Subscribe to **Instagram** object
3. Add callback URL (HTTPS required)
4. Subscribe to fields:
   - `comments`
   - `mentions`
   - `story_insights`
5. Verify webhook endpoint

**Webhook endpoint example:**

```typescript
import express from 'express';

const app = express();

// Webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'your-verify-token') {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook events
app.post('/webhook', (req, res) => {
  const data = req.body;

  // Process webhook event
  if (data.object === 'instagram') {
    data.entry.forEach(entry => {
      // Handle changes
      entry.changes.forEach(change => {
        console.log('Change:', change);
      });
    });
  }

  res.sendStatus(200);
});

app.listen(3000);
```

---

## Production Checklist

### Before Going Live:

- [ ] Convert to Instagram Business account
- [ ] Connect Facebook Page
- [ ] Get long-lived access token (60 days)
- [ ] Or get Page token (never expires)
- [ ] Submit app for App Review (for public use)
- [ ] Add privacy policy and terms of service
- [ ] Implement token refresh mechanism
- [ ] Set up error logging and monitoring
- [ ] Add rate limiting
- [ ] Test with multiple accounts
- [ ] Implement webhook for real-time updates
- [ ] Set up backup credentials
- [ ] Configure production environment variables
- [ ] Enable HTTPS for all endpoints

---

## Security Best Practices

### 1. Token Storage

**Development:**
```env
# .env file (add to .gitignore!)
INSTAGRAM_ACCESS_TOKEN=EAAG...
```

**Production:**
- Use environment variables
- Or secrets manager:
  - AWS Secrets Manager
  - Google Secret Manager
  - Azure Key Vault
  - HashiCorp Vault

### 2. Token Encryption

```typescript
import * as crypto from 'crypto';

function encryptToken(token: string, key: string): string {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptToken(encrypted: string, key: string): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 3. Rate Limiting

```typescript
class RateLimiter {
  private requests: Array<{ endpoint: string; timestamp: number }> = [];
  private readonly MAX_PER_HOUR = 200;

  async checkLimit(endpoint: string): Promise<void> {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // Remove old requests
    this.requests = this.requests.filter(r => r.timestamp > oneHourAgo);

    if (this.requests.length >= this.MAX_PER_HOUR) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest.timestamp + 60 * 60 * 1000 - now;
      throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
    }

    this.requests.push({ endpoint, timestamp: now });
  }
}
```

---

## App Review Process

### Required for Public Apps

If your app will be used by other Instagram accounts (not just your test accounts), you must submit for App Review.

### Steps:

1. **Prepare App**:
   - Add App Icon (1024x1024)
   - Add Privacy Policy URL
   - Add Terms of Service URL
   - Complete App Details

2. **Record Demo Video**:
   - Show app functionality
   - Demonstrate permission usage
   - Max 5 minutes

3. **Submit for Review**:
   - Go to **App Review** → **Permissions and Features**
   - Request these permissions:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_read_engagement`
   - Provide detailed use case
   - Attach demo video
   - Submit for review

4. **Wait for Approval**:
   - Review time: 7-14 days
   - Respond to any questions promptly
   - May require additional documentation

### Tips for Approval:

- Clearly explain why you need each permission
- Show legitimate business use case
- Demonstrate value to Instagram users
- Follow all community guidelines
- Provide working demo
- Respond quickly to questions

---

## API Limits Summary

### Rate Limits
- **200 calls/hour** per user
- **4,800 calls/day** per user

### Publishing Limits
- **25 posts/day** per account
- **25 scheduled posts** at once
- **30-second minimum** between posts

### Content Limits
- **Images**: 320px - 1080px, max 8 MB
- **Videos**: 3-90 seconds, max 1 GB
- **Carousels**: 2-10 items
- **Caption**: Max 2,200 characters
- **Hashtags**: Max 30 per post

---

## Next Steps

1. ✅ Complete Facebook Developer setup
2. ✅ Connect Instagram Business account
3. ✅ Get access tokens
4. ✅ Test first post
5. 📚 Read [InstagramAutomation.md](./InstagramAutomation.md)
6. 💻 Check [examples](../examples/instagram-automation-example.ts)
7. 🚀 Build your automation workflow!

---

## Support Resources

### Documentation
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-api
- **Content Publishing**: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
- **Insights API**: https://developers.facebook.com/docs/instagram-api/guides/insights
- **Webhooks**: https://developers.facebook.com/docs/graph-api/webhooks

### Tools
- **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
- **Access Token Tool**: https://developers.facebook.com/tools/accesstoken/
- **Sharing Debugger**: https://developers.facebook.com/tools/debug/

### Support
- **Developer Community**: https://developers.facebook.com/community/
- **Bug Reports**: https://developers.facebook.com/support/bugs/

---

**Ready to automate Instagram!** 🚀📸
