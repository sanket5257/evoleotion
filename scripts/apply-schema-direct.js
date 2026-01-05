#!/usr/bin/env node

/**
 * Script to apply Supabase schema directly using PostgreSQL connection
 */

const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

// Load environment variables from .env
const envPath = path.join(process.cwd(), '.env')

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      process.env[key.trim()] = value.trim()
    }
  })
}

async function applySchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    console.log('🚀 Connecting to PostgreSQL database...')
    await client.connect()
    console.log('✅ Connected to database')

    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`)
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    console.log('✅ Schema file loaded')

    // Execute the entire schema
    console.log('⏳ Applying schema...')
    await client.query(schemaSQL)
    console.log('✅ Schema applied successfully!')

    // Test the connection by querying a table
    console.log('🔍 Testing database tables...')
    
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `)
    
    console.log('📋 Created tables:')
    rows.forEach(row => {
      console.log(`  - ${row.table_name}`)
    })

  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    await client.end()
    console.log('🔌 Database connection closed')
  }
}

// Run the script
if (require.main === module) {
  applySchema().catch(error => {
    console.error('💥 Script failed:', error.message)
    process.exit(1)
  })
}

module.exports = { applySchema }