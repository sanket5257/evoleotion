# Vercel Environment Variables Setup

To fix session issues in production, make sure these environment variables are properly configured in your Vercel dashboard:

## Required Environment Variables

### 1. JWT Secret (Critical for Sessions)
```
JWT_SECRET=your-super-secure-random-string-here-at-least-32-characters-long
```
**Important**: This must be the same across all deployments. Generate a secure random string.

### 2. Database URL (with Connection Pooling)
```
DATABASE_URL=postgresql://postgres:your-password@db.wcytdeycgdulgnxkdjgh.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```
**Important**: For Supabase, add `?pgbouncer=true&connection_limit=1` to enable connection pooling and limit connections for serverless environments.

### 3. Cloudinary Configuration (if using image uploads)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. Optional: Custom Cookie Domain (only if needed)
```
COOKIE_DOMAIN=yourdomain.com
```
**Note**: Usually not needed for Vercel deployments. Only set if you have custom domain issues.

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the correct value
5. Make sure to set them for Production, Preview, and Development environments
6. Redeploy your application after adding the variables

## Common Issues & Solutions

### Session Logout Issue
- **Cause**: Missing or incorrect JWT_SECRET
- **Solution**: Ensure JWT_SECRET is set and is the same across all deployments

### Database Connection Issues
- **Cause**: PostgreSQL connections being closed unexpectedly in serverless environment
- **Solution**: Use connection pooling with `?pgbouncer=true&connection_limit=1` in DATABASE_URL
- **Note**: Supabase provides built-in connection pooling via pgbouncer

### Cookie Not Persisting
- **Cause**: Domain mismatch or secure cookie issues
- **Solution**: Don't set COOKIE_DOMAIN unless absolutely necessary. Let Vercel handle it automatically.

### Database Connection Issues
- **Cause**: Incorrect DATABASE_URL or connection limits
- **Solution**: Verify your PostgreSQL connection string and connection pool settings

### DYNAMIC_SERVER_USAGE Error
- **Cause**: API routes using dynamic functions without proper configuration
- **Solution**: All API routes that use sessions are now properly configured with `export const dynamic = 'force-dynamic'`
- **Note**: This error should be resolved after the latest updates

### Build/Deployment Errors
- **Cause**: Missing environment variables during build
- **Solution**: Ensure all required environment variables are set in Vercel dashboard before deployment

## Testing

After setting up environment variables:
1. Deploy to Vercel
2. Test the login flow
3. Try placing an order
4. Verify the session persists across page refreshes

## Security Notes

- Never commit environment variables to your repository
- Use strong, unique values for JWT_SECRET
- Regularly rotate your secrets
- Use Vercel's environment variable encryption