#!/usr/bin/env node

/**
 * Script to apply Supabase schema to the database
 * This script reads the supabase-schema.sql file and applies it to the Supabase database
 */

const { createClient } = require('@supabase/supabase-js')
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
  try {
    console.log('🚀 Starting Supabase schema application...')
    
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    
    console.log('✅ Connected to Supabase')
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`)
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    console.log('✅ Schema file loaded')
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Some errors are expected (like "already exists" errors)
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.message.includes('does not exist')) {
            console.log(`⚠️  Statement ${i + 1}: ${error.message} (skipped)`)
          } else {
            console.error(`❌ Statement ${i + 1} failed:`, error.message)
            errorCount++
          }
        } else {
          successCount++
        }
      } catch (err) {
        console.error(`❌ Statement ${i + 1} failed:`, err.message)
        errorCount++
      }
    }
    
    console.log('\n📊 Schema application summary:')
    console.log(`✅ Successful statements: ${successCount}`)
    console.log(`❌ Failed statements: ${errorCount}`)
    console.log(`⚠️  Skipped statements: ${statements.length - successCount - errorCount}`)
    
    if (errorCount === 0) {
      console.log('\n🎉 Schema applied successfully!')
    } else {
      console.log('\n⚠️  Schema applied with some errors. Please review the output above.')
    }
    
    // Test the connection by querying a table
    console.log('\n🔍 Testing database connection...')
    
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection test failed:', testError.message)
    } else {
      console.log('✅ Database connection test passed')
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message)
    process.exit(1)
  }
}

// Alternative method using direct SQL execution if RPC doesn't work
async function applySchemaDirectly() {
  try {
    console.log('🚀 Applying schema using direct SQL execution...')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    // Try to execute the entire schema at once
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL })
    
    if (error) {
      console.error('❌ Schema application failed:', error.message)
      throw error
    }
    
    console.log('✅ Schema applied successfully!')
    
  } catch (error) {
    console.error('💥 Direct schema application failed:', error.message)
    console.log('📝 You may need to apply the schema manually in the Supabase dashboard')
    console.log('📄 Schema file location: supabase-schema.sql')
  }
}

// Run the script
if (require.main === module) {
  applySchema().catch(error => {
    console.error('Script failed:', error.message)
    process.exit(1)
  })
}

module.exports = { applySchema, applySchemaDirectly }