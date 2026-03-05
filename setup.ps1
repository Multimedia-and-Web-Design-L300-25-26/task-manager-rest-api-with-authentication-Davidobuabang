#!/usr/bin/env pwsh

# Task Manager API - Setup Guide

# Installation Steps
Write-Host "Step 1: Installing dependencies..." -ForegroundColor Green
npm install

# Environment setup
if (-not (Test-Path ".env")) {
    Write-Host "`nStep 2: Creating .env file..." -ForegroundColor Green
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created. Please update it with your MongoDB URI and JWT secret."
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your MongoDB connection string"
Write-Host "2. Ensure MongoDB is running"
Write-Host "3. Run 'npm run dev' to start the development server"
Write-Host "4. Run 'npm test' to run the test suite"
