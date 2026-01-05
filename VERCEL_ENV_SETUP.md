# Vercel Environment Variables Setup

To fix session issues in production, make sure these environment variables are properly configured in your Vercel dashboard:

## Required Environment Variables

### 1. JWT Secret (Critical for Sessions)
```
JWT_SECRET=your-super-secure-random-string-here-at-least-32-characters-long
```
**Important**: This must be the same across all deployments. Generate a secure random string.

### 2. Database URL
```
DATABASE_URL=your-postgresql-connection-string
```

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

### Cookie Not Persisting
- **Cause**: Domain mismatch or secure cookie issues
- **Solution**: Don't set COOKIE_DOMAIN unless absolutely necessary. Let Vercel handle it automatically.

### Database Connection Issues
- **Cause**: Incorrect DATABASE_URL or connection limits
- **Solution**: Verify your PostgreSQL connection string and connection pool settings

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