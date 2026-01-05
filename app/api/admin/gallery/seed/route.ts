import { NextRequest, NextResponse } from 'next/server'
import { seedGalleryFromPublic } from '@/scripts/seed-gallery-from-public'
import { DuplicateStrategy } from '@/lib/gallery-seeding-utils'

export async function POST(request: NextRequest) {
  try {
    // Parse request body for options
    const body = await request.json().catch(() => ({}))
    const { 
      skipExisting = true, 
      dryRun = false,
      duplicateStrategy = 'skip'
    } = body
    
    // Convert string to enum
    let strategy = DuplicateStrategy.SKIP
    switch (duplicateStrategy.toLowerCase()) {
      case 'update':
        strategy = DuplicateStrategy.UPDATE
        break
      case 'create_new':
        strategy = DuplicateStrategy.CREATE_NEW
        break
      default:
        strategy = DuplicateStrategy.SKIP
    }
    
    console.log('🌱 Gallery seeding API called')
    console.log('Options:', { skipExisting, dryRun, duplicateStrategy: strategy })
    
    // Run the seeding process
    const results = await seedGalleryFromPublic({
      skipExisting,
      dryRun,
      duplicateStrategy: strategy
    })
    
    // Return results
    return NextResponse.json({
      success: results.success,
      message: results.success 
        ? 'Gallery seeding completed successfully'
        : 'Gallery seeding completed with errors',
      data: {
        processed: results.processed,
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
        errors: results.errors
      }
    }, {
      status: results.success ? 200 : 207 // 207 Multi-Status for partial success
    })
    
  } catch (error) {
    console.error('Gallery seeding API error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Gallery seeding failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    })
  }
}

export async function GET() {
  try {
    // Run a dry run to show what would be seeded
    const results = await seedGalleryFromPublic({
      skipExisting: true,
      dryRun: true
    })
    
    return NextResponse.json({
      success: true,
      message: 'Gallery seeding preview (dry run)',
      data: {
        wouldProcess: results.processed,
        wouldCreate: results.created,
        wouldUpdate: results.updated,
        wouldSkip: results.skipped,
        errors: results.errors
      }
    })
    
  } catch (error) {
    console.error('Gallery seeding preview error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Gallery seeding preview failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    })
  }
}