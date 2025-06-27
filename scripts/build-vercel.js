#!/usr/bin/env node

import { execSync } from 'child_process';
import process from 'process';

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    process.exit(1);
  }
}

console.log('🚀 Starting Vercel build process...');

// Generate Prisma client
console.log('📦 Generating Prisma client...');
runCommand('npx prisma generate');

// Check if we're in Vercel environment and have the required env vars
const hasDirectUrl = process.env.DIRECT_URL;
const isVercel = process.env.VERCEL;

if (isVercel && hasDirectUrl) {
  console.log('🗄️  Setting up production database...');
  runCommand('npx prisma db push --accept-data-loss');
} else {
  console.log('⚠️  Skipping database setup (not in Vercel or missing DIRECT_URL)');
}

// Build the app
console.log('🏗️  Building Remix app...');
runCommand('npx remix vite:build');

console.log('✅ Vercel build complete!'); 