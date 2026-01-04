@echo off
REM Vercel Deployment Script for Windows
REM Usage: deploy.bat YOUR_VERCEL_TOKEN

if "%1"=="" (
    echo ❌ Error: Vercel token required
    echo.
    echo Usage: deploy.bat YOUR_VERCEL_TOKEN
    echo.
    echo To get a token:
    echo 1. Go to https://vercel.com/account/tokens
    echo 2. Click 'Create Token'
    echo 3. Name it: 'Claude Code CLI'
    echo 4. Copy the token
    echo 5. Run: deploy.bat YOUR_TOKEN_HERE
    exit /b 1
)

set VERCEL_TOKEN=%1

echo 🚀 Starting Vercel deployment...
echo.

REM Clean previous deployment configs
echo 🧹 Cleaning previous configurations...
if exist .vercel rmdir /s /q .vercel
if exist .env.local del /f /q .env.local

REM Deploy to production with token
echo 📦 Deploying to production...
vercel --token %VERCEL_TOKEN% --prod --yes

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Deployment successful!
    echo 🎉 Your Niche Empire Builder is now live!
) else (
    echo.
    echo ❌ Deployment failed
    echo Please check the error messages above
    exit /b 1
)
