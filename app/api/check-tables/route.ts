import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check what tables exist using PostgreSQL system tables
    const { data, error } = await supabase
      .rpc('get_table_list', {})
      .select('*')

    if (error) {
      // If RPC doesn't exist, try direct query to information_schema
      const { data: tables, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')

      if (schemaError) {
        return NextResponse.json({
          status: 'error',
          error: 'Cannot check database schema',
          details: schemaError.message,
          timestamp: new Date().toISOString()
        }, { status: 500 })
      }

      return NextResponse.json({
        status: 'success',
        message: 'Database accessible, checking tables',
        tables: tables || [],
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database schema check complete',
      tables: data || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Schema check failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}