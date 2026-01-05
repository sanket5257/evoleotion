import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('Setting up database schema via REST API...')

    // Create the essential users table first
    const createUsersSQL = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    password TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`

    // Execute SQL via Supabase REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sql: createUsersSQL
      })
    })

    if (!response.ok) {
      // If RPC doesn't work, return instructions for manual setup
      return NextResponse.json({
        status: 'manual_setup_required',
        message: 'Please run this SQL in your Supabase SQL Editor',
        sql: createUsersSQL,
        instructions: [
          '1. Go to https://supabase.com/dashboard',
          '2. Select your project',
          '3. Go to SQL Editor',
          '4. Paste and run the SQL above'
        ],
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database schema created successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database setup error:', error)
    
    // Return manual setup instructions
    const manualSQL = `
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    password TEXT,
    role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Test the table
SELECT 'Users table created successfully' as result;
`

    return NextResponse.json({
      status: 'manual_setup_required',
      message: 'Automatic setup failed. Please run this SQL manually.',
      sql: manualSQL,
      instructions: [
        '1. Go to https://supabase.com/dashboard',
        '2. Select your project (knuorfxjuazrhyhazcis)',
        '3. Go to SQL Editor',
        '4. Paste and run the SQL above',
        '5. Then test signup again'
      ],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
}