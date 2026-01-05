# Supabase Environment Setup Guide

## Error: "supabaseKey is required"

This error occurs when the required Supabase environment variables are not configured. Here's how to fix it:

## Required Environment Variables

Add these variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (if using direct connection)
DATABASE_URL=your_supabase_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret_key
```

## How to Get Supabase Keys

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project** (or create a new one)
3. **Go to Settings > API**
4. **Copy the following values**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## Database URL (Optional)

If you need the direct database URL:
1. **Go to Settings > Database**
2. **Copy the Connection String** → `DATABASE_URL`

## Example .env.local File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
```

## Verification

After setting up the environment variables:

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Check the browser console** for any remaining errors

3. **Test the Supabase connection** by visiting:
   ```
   http://localhost:3000/api/debug/supabase-connection
   ```

## Production Deployment

For production (Vercel, Netlify, etc.):

1. **Add the same environment variables** to your deployment platform
2. **Make sure all variables are set** before deploying
3. **Test the deployment** after setting variables

## Troubleshooting

### Still getting errors?

1. **Check variable names** - they must match exactly
2. **Restart your server** after adding variables
3. **Check for typos** in the keys
4. **Verify your Supabase project** is active

### Need help?

- Check the Supabase documentation: https://supabase.com/docs
- Verify your project settings in the Supabase dashboard
- Make sure your project has the required tables and storage buckets

## Security Notes

- **Never commit** `.env.local` to version control
- **Use different keys** for development and production
- **Rotate keys regularly** for security
- **Keep service role keys secret** - they have admin access

Once you've set up these environment variables, the "supabaseKey is required" error should be resolved.