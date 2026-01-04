#!/bin/bash

# Vercel Deployment Script
# Usage: ./deploy.sh YOUR_VERCEL_TOKEN

if [ -z "$1" ]; then
    echo "❌ Error: Vercel token required"
    echo ""
    echo "Usage: ./deploy.sh YOUR_VERCEL_TOKEN"
    echo ""
    echo "To get a token:"
    echo "1. Go to https://vercel.com/account/tokens"
    echo "2. Click 'Create Token'"
    echo "3. Name it: 'Claude Code CLI'"
    echo "4. Copy the token"
    echo "5. Run: ./deploy.sh YOUR_TOKEN_HERE"
    exit 1
fi

VERCEL_TOKEN="$1"

echo "🚀 Starting Vercel deployment..."
echo ""

# Clean previous deployment configs
echo "🧹 Cleaning previous configurations..."
rm -rf .vercel .env.local

# Deploy to production with token
echo "📦 Deploying to production..."
vercel --token "$VERCEL_TOKEN" --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🎉 Your Niche Empire Builder is now live!"
else
    echo ""
    echo "❌ Deployment failed"
    echo "Please check the error messages above"
    exit 1
fi
