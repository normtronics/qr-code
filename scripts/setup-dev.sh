#!/bin/bash

# Development setup script for QR Code Manager

echo "Setting up development environment..."

# Create .env file for development
echo 'DATABASE_URL="file:./dev.db"' > .env

# Setup development database
echo "Setting up SQLite database for development..."
npx prisma db push --schema=prisma/schema.dev.prisma
npx prisma generate --schema=prisma/schema.dev.prisma

echo "Development setup complete!"
echo "You can now run: npm run dev" 