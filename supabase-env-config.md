# Supabase Environment Configuration

## Required Environment Variables

Add these variables to your `.env.local` file:

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# JWT Secret for NextAuth compatibility
JWT_SECRET="[GENERATE-WITH-openssl-rand-base64-32]"

# NextAuth Configuration (for backward compatibility)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[YOUR-NEXTAUTH-SECRET]"

# Email Configuration (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@portraitstudio.com"
```

## Environment Variable Descriptions

### Supabase Core Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side admin operations

### Database Connection
- `DATABASE_URL`: PostgreSQL connection string for Supabase database

### Security
- `JWT_SECRET`: Used for JWT token signing and verification
- `NEXTAUTH_SECRET`: NextAuth secret for session management

## Setup Instructions

1. **Get Supabase Credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and API keys

2. **Configure Database URL**:
   - Go to Settings > Database
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Generate JWT Secret**:
   ```bash
   openssl rand -base64 32
   ```

4. **Update Environment Files**:
   - Copy values to `.env.local` for development
   - Configure production environment variables in your deployment platform

## Verification

After setting up the environment variables, you can test the connection:

```bash
# Start the development server
npm run dev

# Test Supabase connection
curl http://localhost:3000/api/debug/supabase-connection
```

The response should show successful connections to all database tables.