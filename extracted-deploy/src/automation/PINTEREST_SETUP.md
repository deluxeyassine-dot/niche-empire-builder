# Pinterest Automation Setup Guide

**E-Commerce Optimized** - Set up Pinterest to drive massive traffic and sales to your online store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Business Account Setup](#business-account-setup)
3. [Website Claim & Verification](#website-claim--verification)
4. [Pinterest App Setup](#pinterest-app-setup)
5. [Rich Pins Configuration](#rich-pins-configuration)
6. [Get Access Tokens](#get-access-tokens)
7. [Install Dependencies](#install-dependencies)
8. [First Pin](#first-pin)
9. [E-Commerce Optimization](#e-commerce-optimization)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Requirements

Before starting, ensure you have:

1. **Pinterest Business Account** (free)
2. **Verified Website** (your e-commerce store)
3. **High-quality product images** (1000x1500px recommended)
4. **Product catalog** ready
5. **Node.js 16+** installed

### Why Pinterest for E-Commerce?

- **Purchase Intent**: 89% of Pinterest users use Pinterest for purchase inspiration
- **High AOV**: Average order value 50% higher than other platforms
- **Long-term Traffic**: Pins continue to drive traffic for months/years
- **Discovery Platform**: 97% of searches are unbranded (discovery mode)
- **Visual Commerce**: Perfect for showcasing products

---

## Business Account Setup

### Step 1: Create Business Account

1. Go to [Pinterest Business](https://www.pinterest.com/business/create/)
2. Click **Create account**
3. Choose **Create a business account**

**Business Details:**
- Business name: Your store name
- Website: Your e-commerce site URL
- Country: Your location
- Language: Your language

4. Click **Create account**

**Or Convert Personal Account:**

1. Go to Settings
2. Click **Account management**
3. Click **Convert to business account**
4. Follow prompts

### Step 2: Complete Business Profile

1. Go to your profile
2. Click **Edit profile**
3. Add:
   - **Profile photo**: Your logo (165x165px min)
   - **About**: Brief description with keywords
   - **Website**: Your store URL
   - **Location**: Business address (optional)

**Example About:**
```
Premium organic skincare products 🌿
Handmade | Cruelty-free | Eco-friendly
Shop: yourstore.com
Use code PIN10 for 10% off! ✨
```

---

## Website Claim & Verification

### Step 3: Claim Your Website

**This is CRITICAL for:**
- Rich pins (product metadata)
- Analytics
- Website traffic tracking
- Shopping features

**Method 1: HTML File Upload (Recommended)**

1. Go to **Settings** → **Claimed accounts**
2. Click **Claim** next to **Website**
3. Enter your website URL
4. Choose **Add HTML file**
5. Download the verification file
6. Upload to your website root: `yourdomain.com/pinterest-xxxxx.html`
7. Click **Verify**

**Method 2: Meta Tag**

Add to your website's `<head>`:

```html
<meta name="p:domain_verify" content="your-verification-code-here"/>
```

**Method 3: TXT Record (DNS)**

Add TXT record to your DNS:
```
pinterest-site-verification=your-verification-code
```

Wait 24 hours, then click **Verify**.

### Step 4: Verify Merchant Status

For shopping features:

1. Go to **Settings** → **Shopping**
2. Click **Get started**
3. Complete merchant verification
4. Add business details
5. Accept merchant terms

---

## Pinterest App Setup

### Step 5: Create Pinterest App

1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Click **My Apps**
3. Click **Create app**

**App Details:**
- App name: `YourStore Pinterest Automation`
- App description: `Pinterest automation for e-commerce`
- App website: Your store URL
- Privacy policy URL: Your privacy policy
- Terms of service URL: Your terms
- Redirect URIs: `https://yourdomain.com/auth/pinterest/callback`

4. Click **Create**

### Step 6: Get App Credentials

1. Go to your app dashboard
2. Find **App ID** and **App secret**
3. **IMPORTANT**: Save these securely

```
App ID: 1234567
App secret: abc123xyz789...
```

### Step 7: Request API Access

1. In app dashboard, go to **API access**
2. Request access to:
   - **Content API** (pins, boards)
   - **Analytics API** (metrics)
   - **Catalogs API** (products)
3. Fill out use case form
4. Wait for approval (usually 1-3 business days)

---

## Rich Pins Configuration

### Step 8: Add Meta Tags to Website

Rich pins automatically pull data from your website. Add Open Graph meta tags to product pages:

**Product Pages:**

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Basic Meta Tags -->
  <meta property="og:type" content="product"/>
  <meta property="og:title" content="Organic Cotton T-Shirt - White"/>
  <meta property="og:description" content="Premium organic cotton t-shirt. Soft, breathable, sustainable. Available in 10 colors."/>
  <meta property="og:url" content="https://yourstore.com/products/organic-tshirt"/>
  <meta property="og:image" content="https://yourstore.com/images/tshirt-white.jpg"/>

  <!-- Product Rich Pin Tags -->
  <meta property="product:price:amount" content="29.99"/>
  <meta property="product:price:currency" content="USD"/>
  <meta property="product:availability" content="in stock"/>
  <meta property="product:brand" content="YourBrand"/>
  <meta property="product:category" content="Clothing"/>
  <meta property="product:condition" content="new"/>

  <!-- Sale Price (if applicable) -->
  <meta property="product:sale_price:amount" content="19.99"/>
  <meta property="product:sale_price:currency" content="USD"/>
</head>
<body>
  <!-- Your product page content -->
</body>
</html>
```

**Article Pages:**

```html
<meta property="og:type" content="article"/>
<meta property="og:title" content="10 Ways to Style Organic Cotton"/>
<meta property="og:description" content="Discover how to style organic cotton clothing for every occasion"/>
<meta property="article:author" content="Your Name"/>
<meta property="article:published_time" content="2024-01-15T08:00:00+00:00"/>
```

### Step 9: Validate Rich Pins

1. Go to [Pinterest Rich Pins Validator](https://developers.pinterest.com/tools/url-debugger/)
2. Enter a product page URL
3. Click **Validate**
4. Fix any errors shown
5. Click **Apply Now**
6. Wait 24 hours for approval

---

## Get Access Tokens

### Step 10: OAuth Authentication

**Create authentication script:**

```typescript
import { PinterestAutomation } from './automation/PinterestAutomation';
import * as dotenv from 'dotenv';
import * as readline from 'readline';
import * as fs from 'fs';

dotenv.config();

async function authenticate() {
  const pinterest = new PinterestAutomation({
    clientId: process.env.PINTEREST_CLIENT_ID!,
    clientSecret: process.env.PINTEREST_CLIENT_SECRET!,
    redirectUri: process.env.PINTEREST_REDIRECT_URI!
  });

  // Step 1: Get authorization URL
  const authUrl = pinterest.getAuthorizationUrl([
    'ads:read',
    'boards:read',
    'boards:write',
    'pins:read',
    'pins:write',
    'user_accounts:read'
  ]);

  console.log('\n📍 Pinterest Authorization\n');
  console.log('Visit this URL to authorize:\n');
  console.log(authUrl);
  console.log('\n');

  // Step 2: Get code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const code = await new Promise<string>(resolve => {
    rl.question('Enter the authorization code: ', answer => {
      rl.close();
      resolve(answer);
    });
  });

  // Step 3: Exchange code for tokens
  const { accessToken, refreshToken, expiresIn } = await pinterest.authorize(code);

  // Step 4: Save tokens
  const envContent = fs.readFileSync('.env', 'utf-8');
  const updatedEnv = envContent
    .replace(/PINTEREST_ACCESS_TOKEN=.*/, `PINTEREST_ACCESS_TOKEN=${accessToken}`)
    .replace(/PINTEREST_REFRESH_TOKEN=.*/, `PINTEREST_REFRESH_TOKEN=${refreshToken}`);

  fs.writeFileSync('.env', updatedEnv);

  console.log('\n✅ Tokens saved to .env file!');
  console.log(`   Access token expires in ${expiresIn} seconds`);
  console.log('\nYou can now use Pinterest automation!');
}

authenticate().catch(console.error);
```

Run:

```bash
ts-node authenticate.ts
```

**Steps:**
1. Script prints authorization URL
2. Open URL in browser
3. Log in to Pinterest
4. Click **Authorize**
5. Copy code from redirect URL
6. Paste into terminal
7. Tokens saved to `.env`

---

## Install Dependencies

### Step 11: Install Packages

```bash
# Install required packages
npm install axios form-data dotenv

# Optional: Image optimization
npm install sharp

# TypeScript types
npm install --save-dev @types/node @types/form-data
```

### Step 12: Create Environment File

Create `.env`:

```env
# Pinterest API Configuration
PINTEREST_CLIENT_ID=your-app-id
PINTEREST_CLIENT_SECRET=your-app-secret
PINTEREST_REDIRECT_URI=https://yourdomain.com/auth/pinterest/callback

# Access tokens (filled after OAuth)
PINTEREST_ACCESS_TOKEN=
PINTEREST_REFRESH_TOKEN=

# Your store info
STORE_URL=https://yourstore.com
STORE_NAME=Your Store Name
```

Add to `.gitignore`:

```bash
echo ".env" >> .gitignore
```

---

## First Pin

### Step 13: Create Your First Product Pin

```typescript
import { PinterestAutomation } from './automation/PinterestAutomation';
import * as dotenv from 'dotenv';

dotenv.config();

async function firstPin() {
  const pinterest = new PinterestAutomation({
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!
  });

  // Step 1: Create a board
  const boardId = await pinterest.createBoard({
    name: 'Product Catalog',
    description: `Shop our products at ${process.env.STORE_URL}`,
    privacy: 'PUBLIC'
  });

  console.log('Board created:', boardId);

  // Step 2: Create an optimized product pin
  const pinId = await pinterest.optimizeForShopping({
    boardId,
    imageUrl: 'https://yourstore.com/images/product.jpg',
    title: 'Premium Organic Cotton T-Shirt',
    description: 'Soft, breathable organic cotton t-shirt. Available in 10 colors. Free shipping on orders $50+!',
    link: 'https://yourstore.com/products/organic-tshirt',
    price: 29.99,
    currency: 'USD',
    availability: 'IN_STOCK',
    brand: 'YourBrand',
    category: 'Clothing',
    condition: 'NEW'
  }, {
    usePriceInTitle: true,
    addUrgency: false,
    highlightBenefit: true,
    targetKeywords: ['organic clothing', 'sustainable fashion', 'cotton tshirt']
  });

  console.log('\n✅ First product pin created!');
  console.log(`Pin ID: ${pinId}`);
  console.log(`View: https://www.pinterest.com/pin/${pinId}/`);
}

firstPin().catch(console.error);
```

Run:

```bash
ts-node first-pin.ts
```

---

## E-Commerce Optimization

### Step 14: Bulk Upload Product Catalog

```typescript
async function uploadCatalog() {
  const pinterest = new PinterestAutomation({
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!
  });

  // Create product board
  const boardId = await pinterest.createBoard({
    name: 'All Products',
    description: 'Shop our complete collection!',
    privacy: 'PUBLIC'
  });

  // Prepare catalog
  const catalog = [
    {
      productId: 'PROD-001',
      title: 'Organic Cotton T-Shirt',
      description: 'Soft organic cotton tee',
      price: 29.99,
      currency: 'USD',
      availability: 'IN_STOCK' as const,
      imageUrl: 'https://store.com/tshirt.jpg',
      productUrl: 'https://store.com/products/tshirt',
      brand: 'YourBrand',
      category: 'Clothing'
    },
    {
      productId: 'PROD-002',
      title: 'Eco-Friendly Water Bottle',
      description: 'Reusable stainless steel bottle',
      price: 24.99,
      currency: 'USD',
      availability: 'IN_STOCK' as const,
      imageUrl: 'https://store.com/bottle.jpg',
      productUrl: 'https://store.com/products/bottle',
      brand: 'YourBrand'
    }
    // ... add all products
  ];

  // Upload catalog
  const pinIds = await pinterest.createCatalogPins(
    boardId,
    catalog,
    {
      keywords: ['eco friendly products', 'sustainable living'],
      hashtags: ['ecofriendly', 'sustainable', 'zerowaste']
    }
  );

  console.log(`✅ Uploaded ${pinIds.length} products!`);
}
```

### Step 15: Set Up Traffic Tracking

```typescript
// Weekly traffic report
async function weeklyReport() {
  const pinterest = new PinterestAutomation({
    accessToken: process.env.PINTEREST_ACCESS_TOKEN!
  });

  const traffic = await pinterest.driveTrafficToWebsite('yourstore.com');

  console.log('\n📊 Weekly Pinterest Traffic Report\n');
  console.log(`Total Impressions: ${traffic.totalImpressions.toLocaleString()}`);
  console.log(`Total Clicks: ${traffic.totalClicks.toLocaleString()}`);
  console.log(`Total Saves: ${traffic.totalSaves.toLocaleString()}`);
  console.log(`CTR: ${(traffic.clickThroughRate * 100).toFixed(2)}%`);

  console.log('\n🔥 Top Traffic Drivers:\n');
  traffic.topReferringPins.slice(0, 5).forEach((pin, i) => {
    console.log(`${i + 1}. Pin ${pin.pinId}: ${pin.clicks} clicks`);
  });

  // Estimate revenue (adjust based on your conversion rate)
  const estimatedRevenue = traffic.totalClicks * 0.02 * 75; // 2% CR, $75 AOV
  console.log(`\n💰 Estimated Revenue: $${estimatedRevenue.toFixed(2)}`);
}
```

---

## Troubleshooting

### Issue 1: "Invalid Access Token"

**Cause**: Token expired or invalid

**Solutions**:
1. Access tokens expire after 24 hours
2. Use refresh token to get new access token:
   ```typescript
   const newToken = await pinterest.refreshAccessToken();
   ```
3. Re-authenticate if refresh fails

### Issue 2: "Website Not Claimed"

**Cause**: Website verification incomplete

**Solutions**:
1. Check verification file is accessible: `yoursite.com/pinterest-xxxxx.html`
2. Verify meta tag in `<head>` section
3. Wait 24 hours after adding verification
4. Check DNS propagation if using TXT record

### Issue 3: "Rich Pins Not Showing"

**Cause**: Missing meta tags or not validated

**Solutions**:
1. Add all required Open Graph tags
2. Validate at [Pinterest URL Debugger](https://developers.pinterest.com/tools/url-debugger/)
3. Apply for rich pins approval
4. Wait 24 hours for approval
5. Clear Pinterest cache by re-validating

### Issue 4: "Pin Creation Failed"

**Possible causes:**
- Invalid image URL
- Board doesn't exist
- Missing required fields
- Rate limit exceeded

**Solutions**:
1. Verify image URL is accessible (HTTPS)
2. Check board ID is correct
3. Ensure title and board_id provided
4. Add delays between pins (1 second minimum)

### Issue 5: "No Analytics Data"

**Cause**: Analytics not enabled or insufficient data

**Solutions**:
1. Enable Pinterest Analytics in settings
2. Wait 24-48 hours for data collection
3. Verify website is claimed
4. Check pins have outbound links

### Issue 6: "Rate Limit Exceeded"

**Cause**: Too many API requests

**Solutions**:
1. Pinterest limit: 180 requests/minute
2. Add delays between operations:
   ```typescript
   await new Promise(r => setTimeout(r, 1000)); // 1 second
   ```
3. Batch operations when possible
4. Monitor rate limit headers

---

## Production Checklist

### Before Going Live:

- [ ] Business account created and verified
- [ ] Website claimed and verified
- [ ] Rich pins validated and approved
- [ ] App created and API access approved
- [ ] OAuth tokens obtained
- [ ] Product catalog prepared
- [ ] High-quality images ready (1000x1500px)
- [ ] Meta tags added to product pages
- [ ] Boards created and organized
- [ ] First pins tested successfully
- [ ] Analytics enabled and tracking
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Automated reporting set up

---

## Best Practices

### 1. Image Optimization

**Before uploading:**
- Resize to 1000x1500px (2:3 ratio)
- Compress to under 5MB
- Use high contrast
- Add text overlays
- Include brand logo

**Using Sharp:**

```typescript
import sharp from 'sharp';

async function optimizeImage(inputPath: string): Promise<string> {
  const outputPath = inputPath.replace('.jpg', '-optimized.jpg');

  await sharp(inputPath)
    .resize(1000, 1500, {
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  return outputPath;
}
```

### 2. Board Organization

```typescript
// Create organized board structure
const boards = {
  main: 'All Products',
  categories: ['Clothing', 'Accessories', 'Home Decor'],
  seasonal: ['Summer Collection', 'Holiday Gifts'],
  content: ['How To Guides', 'Customer Photos', 'Behind the Scenes']
};

for (const category of boards.categories) {
  await pinterest.createBoard({
    name: category,
    description: `Shop ${category} at YourStore.com`,
    privacy: 'PUBLIC'
  });
}
```

### 3. Consistent Pinning Schedule

```bash
# Use cron for daily pinning
0 9,12,15,18,21 * * * ts-node pin-schedule.ts
```

**Optimal times:**
- 8-11 PM: Peak engagement
- 2-4 PM: Secondary peak
- 12-1 PM: Lunch break

---

## Next Steps

1. ✅ Complete Pinterest Business setup
2. ✅ Claim and verify website
3. ✅ Set up rich pins
4. ✅ Create Pinterest app
5. ✅ Get API access
6. ✅ Authenticate and get tokens
7. ✅ Upload product catalog
8. 📚 Read [PinterestAutomation.md](./PinterestAutomation.md)
9. 💻 Check [examples](../examples/pinterest-automation-example.ts)
10. 🚀 Start driving traffic!

---

## Support Resources

### Documentation
- **Pinterest API**: https://developers.pinterest.com/docs/api/v5/
- **Rich Pins**: https://help.pinterest.com/en/business/article/rich-pins
- **Business Hub**: https://business.pinterest.com/
- **Analytics**: https://analytics.pinterest.com/

### Tools
- **URL Debugger**: https://developers.pinterest.com/tools/url-debugger/
- **Developers Portal**: https://developers.pinterest.com/apps/
- **Pinterest Trends**: https://trends.pinterest.com/

---

**Start driving massive e-commerce traffic today!** 📍💰🚀
