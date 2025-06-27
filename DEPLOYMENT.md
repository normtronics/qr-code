# Deployment Guide - PostgreSQL on Vercel

This guide will help you deploy your dynamic QR code app to Vercel with PostgreSQL database.

## 🗄️ Database Setup Options

### Option 1: Vercel Postgres (Recommended)

1. **Go to your Vercel dashboard**
   - Select your project (or create a new one)
   - Go to the "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose your preferred region

2. **Environment Variables**
   - Vercel will automatically set `DATABASE_URL`
   - No manual configuration needed

### Option 2: External PostgreSQL Provider

Popular options:
- **Neon** (https://neon.tech) - Generous free tier
- **Supabase** (https://supabase.com) - Full-featured with free tier
- **Railway** (https://railway.app) - Simple deployment
- **PlanetScale** (https://planetscale.com) - MySQL alternative

## 🚀 Deployment Steps

### 1. Prepare Your Code

```bash
# Ensure PostgreSQL is configured in schema
npm run db:generate

# Test locally with PostgreSQL (optional)
# Update your .env with PostgreSQL URL first
npm run db:push
npm run dev
```

### 2. Deploy to Vercel

#### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel

# Follow the prompts to connect your repository
```

#### Via GitHub Integration:
1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-deploy on every push

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL` (if not using Vercel Postgres)
3. Add `NODE_ENV=production`

### 4. Database Migration

After first deployment:
```bash
# Using Vercel CLI
vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2-) npx prisma db push

# Or use Vercel's serverless function approach
```

## 🔧 Local Development with PostgreSQL

### Setup Local PostgreSQL

#### Using Docker:
```bash
# Start PostgreSQL container
docker run --name qr-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=qr_code_dev -p 5432:5432 -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/qr_code_dev"
```

#### Using Homebrew (macOS):
```bash
# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb qr_code_dev

# Update .env
DATABASE_URL="postgresql://username@localhost:5432/qr_code_dev"
```

### Run Migrations
```bash
npm run db:push
npm run db:generate
npm run dev
```

## 📁 File Structure for Deployment

```
your-app/
├── app/                 # Remix app files
├── prisma/
│   └── schema.prisma   # PostgreSQL configuration
├── scripts/
│   └── setup-env.cjs   # Environment setup script
├── vercel.json         # Vercel configuration
├── package.json        # Build scripts included
└── .env               # Local environment (not committed)
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails on Vercel**
   ```bash
   # Ensure postbuild script runs
   "postbuild": "prisma generate"
   ```

2. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL format
   postgresql://username:password@host:port/database?sslmode=require
   ```

3. **Prisma Client Issues**
   ```bash
   # Regenerate client
   npm run db:generate
   ```

### Environment Variables Checklist:
- ✅ `DATABASE_URL` set correctly
- ✅ `NODE_ENV=production` (optional)
- ✅ SSL mode enabled for production databases

## 🚦 Health Check

After deployment, test:
1. Create a QR code
2. Verify database persistence
3. Test QR code redirect functionality
4. Check click tracking

## 💡 Production Optimizations

### Performance:
- Consider connection pooling for high traffic
- Enable PostgreSQL query optimization
- Use CDN for QR code images

### Security:
- Enable SSL for database connections
- Add rate limiting for API endpoints
- Consider authentication for admin features

### Monitoring:
- Set up Vercel Analytics
- Monitor database performance
- Track QR code usage metrics

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify database connection
3. Test locally with same environment
4. Review Prisma documentation

## 🎯 Quick Commands Reference

```bash
# Setup
npm run setup                # Create .env file
npm run db:push             # Push schema to database
npm run db:generate         # Generate Prisma client

# Development
npm run dev                 # Start dev server
npm run db:studio          # Open Prisma Studio

# Deployment
vercel                      # Deploy to Vercel
vercel logs                 # View deployment logs
``` 