# Vercel Deployment Guide

This guide will help you deploy the Dynamic QR Code Manager to Vercel.

## Prerequisites

- [Vercel Account](https://vercel.com)
- GitHub repository with your code
- Basic knowledge of environment variables

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Remix app

### 3. Set Up Database

1. In your Vercel dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose your preferred region
5. Create the database
6. Copy the connection strings from the database settings

### 4. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```
DATABASE_URL=postgresql://[connection-string-from-vercel]
DIRECT_URL=postgresql://[direct-connection-string-from-vercel]
```

**Important:** Use the connection strings provided by Vercel Postgres.

### 5. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Post-Deployment

### Database Migration

The database will be automatically set up during the first deployment thanks to the `vercel-build` script.

### Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Environment Variables Management

- **Development**: Uses SQLite (`DATABASE_URL="file:./dev.db"`)
- **Production**: Uses PostgreSQL (Vercel Postgres)

## Troubleshooting

### Build Errors

1. **Prisma issues**: Ensure `prisma generate` runs during build
2. **Missing dependencies**: Check that all packages are in `dependencies`, not `devDependencies`
3. **Database connection**: Verify environment variables are set correctly

### Runtime Errors

1. **Database connection**: Check Vercel Postgres connection strings
2. **Function timeout**: Vercel has a 10-second timeout for serverless functions
3. **Memory issues**: Monitor usage in Vercel dashboard

### Common Issues

**"Cannot connect to database"**
- Verify `DATABASE_URL` and `DIRECT_URL` environment variables
- Ensure Vercel Postgres is running and accessible

**"Build failed"**
- Check build logs in Vercel dashboard
- Ensure all dependencies are properly installed
- Verify Prisma schema is valid

**"Function timeout"**
- Optimize database queries
- Consider connection pooling for high traffic

## Performance Optimization

### Database

- Use connection pooling
- Optimize queries with proper indexes
- Consider read replicas for high traffic

### Caching

- Implement CDN caching for QR code images
- Use Redis for session management (if needed)

### Monitoring

- Set up Vercel Analytics
- Monitor function execution times
- Track error rates

## Security Considerations

- Environment variables are automatically encrypted in Vercel
- Database connections use SSL by default
- Consider adding rate limiting for API endpoints
- Implement proper input validation

## Scaling

- Vercel automatically scales serverless functions
- Monitor usage and upgrade plan if needed
- Consider database connection limits
- Implement proper error handling and retries

## Support

If you encounter issues:

1. Check Vercel documentation
2. Review build and function logs
3. Test locally with production environment variables
4. Contact Vercel support if needed

## Cost Considerations

- Vercel has generous free tier limits
- Database costs depend on usage
- Monitor usage in both Vercel and database dashboards
- Set up billing alerts

---

**Next Steps:** After successful deployment, test all functionality including:
- Creating QR codes
- Updating URLs
- QR code redirects
- Download functionality 