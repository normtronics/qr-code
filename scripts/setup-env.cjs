#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  
  const envContent = `# Database Configuration
# For local development with PostgreSQL:
DATABASE_URL="postgresql://username:password@localhost:5432/qr_code_dev"

# For production (Vercel will set this automatically if you use Vercel Postgres):
# DATABASE_URL="postgresql://username:password@host:port/database"

# Alternative: For local development with SQLite:
# DATABASE_URL="file:./dev.db"
# Note: If using SQLite, change the provider in prisma/schema.prisma to "sqlite"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the DATABASE_URL with your actual database credentials.');
} else {
  console.log('⚠️  .env file already exists.');
}

console.log('\n🔧 Setup Instructions:');
console.log('1. Update .env with your database URL');
console.log('2. Run: npx prisma db push');
console.log('3. Run: npx prisma generate');
console.log('4. Run: npm run dev');
console.log('\n🚀 For Vercel deployment:');
console.log('1. Add PostgreSQL database to your Vercel project');
console.log('2. Vercel will automatically set DATABASE_URL');
console.log('3. Add build command: npm run build');
console.log('4. Deploy!'); 