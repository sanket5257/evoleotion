import { promises as fs } from 'fs'
import path from 'path'
import { GalleryImageInsert } from '../types/supabase'

// Lazy load Supabase to avoid initialization errors
let supabaseAdmin: any = null
let gallerySeedingUtils: any = null

async function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const { supabaseAdmin: admin } = await import('../lib/supabase-server')
    supabaseAdmin = admin
  }
  return supabaseAdmin
}

async function getGallerySeedingUtils() {
  if (!gallerySeedingUtils) {
    gallerySeedingUtils = await import('../lib/gallery-seeding-utils')
  }
  return gallerySeedingUtils
}

// Configuration
const ARTWORKS_DIR = path.join(process.cwd(), 'public', 'artworks')
const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']

// Style mapping based on filename patterns or defaults
const STYLE_PATTERNS = {
  charcoal: ['charcoal', 'coal'],
  'pencil sketch': ['pencil', 'sketch'],
  watercolor: ['watercolor', 'water'],
  oil: ['oil'],
  acrylic: ['acrylic']
}

// Default style if no pattern matches
const DEFAULT_STYLE = 'Charcoal'

interface ImageMetadata {
  filename: string
  title: string
  description: string
  style: string
  tags: string[]
  publicId: string
  imageUrl: string
}

/**
 * Extract metadata from image filename and generate appropriate data
 */
function extractImageMetadata(filename: string, index: number): ImageMetadata {
  const nameWithoutExt = path.parse(filename).name
  
  // Determine style based on filename patterns
  let detectedStyle = DEFAULT_STYLE
  const lowerFilename = filename.toLowerCase()
  
  for (const [style, patterns] of Object.entries(STYLE_PATTERNS)) {
    if (patterns.some(pattern => lowerFilename.includes(pattern))) {
      detectedStyle = style === 'pencil sketch' ? 'Pencil Sketch' : 
                     style.charAt(0).toUpperCase() + style.slice(1)
      break
    }
  }
  
  // Generate title from filename
  const title = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ') || `${detectedStyle} Portrait ${index + 1}`
  
  // Generate description
  const description = `Beautiful ${detectedStyle.toLowerCase()} portrait showcasing artistic technique and attention to detail`
  
  // Generate tags
  const tags = [
    'portrait',
    detectedStyle.toLowerCase().replace(' ', '_'),
    'artistic',
    'handcrafted'
  ]
  
  // Generate public ID (unique identifier)
  const publicId = `gallery_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 8)}`
  
  // Image URL (relative to public folder)
  const imageUrl = `/artworks/${filename}`
  
  return {
    filename,
    title,
    description,
    style: detectedStyle,
    tags,
    publicId,
    imageUrl
  }
}

/**
 * Check if an image already exists in the database using advanced duplicate detection
 */
async function checkImageExists(imageData: GalleryImageInsert): Promise<boolean> {
  try {
    const utils = await getGallerySeedingUtils()
    const duplicateResult = await utils.checkForDuplicates(imageData, {
      checkImageUrl: true,
      checkPublicId: true,
      checkTitle: false,
      checkFilename: true
    })
    
    return duplicateResult.isDuplicate
  } catch (error) {
    console.error('Error checking image existence:', error)
    return false
  }
}

/**
 * Create gallery image record in database with duplicate handling
 */
async function createGalleryImage(
  metadata: ImageMetadata, 
  orderIndex: number,
  duplicateStrategy: any = null
): Promise<{
  success: boolean
  action: string
  error?: string
}> {
  try {
    const utils = await getGallerySeedingUtils()
    const admin = await getSupabaseAdmin()
    const DuplicateStrategy = utils.DuplicateStrategy
    
    const strategy = duplicateStrategy || DuplicateStrategy.SKIP
    
    const imageData: GalleryImageInsert = {
      title: metadata.title,
      description: metadata.description,
      image_url: metadata.imageUrl,
      public_id: metadata.publicId,
      style: metadata.style,
      tags: metadata.tags,
      is_active: true,
      order_index: orderIndex
    }
    
    // Check for duplicates
    const duplicateResult = await utils.checkForDuplicates(imageData, {
      checkImageUrl: true,
      checkPublicId: true,
      checkFilename: true
    })
    
    if (duplicateResult.isDuplicate && duplicateResult.existingRecord) {
      console.log(`   🔍 Duplicate detected (matched on: ${duplicateResult.matchedOn.join(', ')})`)
      
      const handleResult = await utils.handleDuplicate(
        imageData,
        duplicateResult.existingRecord,
        strategy
      )
      
      return handleResult
    }
    
    // Create new record
    const { error } = await admin
      .from('gallery_images')
      .insert(imageData)
    
    if (error) {
      console.error(`Error creating gallery image for ${metadata.filename}:`, error)
      return {
        success: false,
        action: 'create_failed',
        error: error.message
      }
    }
    
    console.log(`✅ Created gallery record: ${metadata.title}`)
    return {
      success: true,
      action: 'created'
    }
  } catch (error) {
    console.error(`Error creating gallery image for ${metadata.filename}:`, error)
    return {
      success: false,
      action: 'create_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Scan directory for image files
 */
async function scanArtworksDirectory(): Promise<string[]> {
  try {
    const files = await fs.readdir(ARTWORKS_DIR)
    
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase()
      return SUPPORTED_EXTENSIONS.includes(ext)
    })
    
    console.log(`📁 Found ${imageFiles.length} image files in ${ARTWORKS_DIR}`)
    return imageFiles.sort() // Sort for consistent ordering
  } catch (error) {
    console.error('Error scanning artworks directory:', error)
    throw new Error(`Failed to scan artworks directory: ${error}`)
  }
}

/**
 * Validate that artworks directory exists and is accessible
 */
async function validateArtworksDirectory(): Promise<void> {
  try {
    const stats = await fs.stat(ARTWORKS_DIR)
    if (!stats.isDirectory()) {
      throw new Error(`${ARTWORKS_DIR} is not a directory`)
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Artworks directory not found: ${ARTWORKS_DIR}`)
    }
    throw error
  }
}

/**
 * Test database connection
 */
async function testDatabaseConnection(): Promise<void> {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set')
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set')
    }
    
    const admin = await getSupabaseAdmin()
    const { error } = await admin
      .from('gallery_images')
      .select('id')
      .limit(1)
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    console.log('✅ Database connection verified')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

/**
 * Main seeding function
 */
export async function seedGalleryFromPublic(options: {
  skipExisting?: boolean
  dryRun?: boolean
  duplicateStrategy?: any
} = {}): Promise<{
  success: boolean
  processed: number
  created: number
  updated: number
  skipped: number
  errors: string[]
}> {
  const { 
    skipExisting = true, 
    dryRun = false,
    duplicateStrategy = null
  } = options
  
  console.log('🌱 Starting gallery seeding from public folder...')
  console.log(`📂 Scanning: ${ARTWORKS_DIR}`)
  console.log(`🔄 Skip existing: ${skipExisting}`)
  console.log(`📋 Duplicate strategy: ${duplicateStrategy}`)
  console.log(`🧪 Dry run: ${dryRun}`)
  console.log('')
  
  const results = {
    success: false,
    processed: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [] as string[]
  }
  
  try {
    // Validate environment variables first
    if (!dryRun) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
      }
      
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
      }
    }
    
    // Validate prerequisites
    await validateArtworksDirectory()
    if (!dryRun) {
      await testDatabaseConnection()
      
      // Show current gallery stats
      const utils = await getGallerySeedingUtils()
      const stats = await utils.getGalleryStats()
      console.log('📊 Current gallery stats:')
      console.log(`   Total images: ${stats.total}`)
      console.log(`   Active: ${stats.active}, Inactive: ${stats.inactive}`)
      console.log(`   By style: ${JSON.stringify(stats.byStyle, null, 2)}`)
      console.log('')
    }
    
    // Scan for image files
    const imageFiles = await scanArtworksDirectory()
    
    if (imageFiles.length === 0) {
      console.log('⚠️ No image files found in artworks directory')
      results.success = true
      return results
    }
    
    // Process each image file
    for (let i = 0; i < imageFiles.length; i++) {
      const filename = imageFiles[i]
      results.processed++
      
      try {
        console.log(`\n📸 Processing: ${filename} (${i + 1}/${imageFiles.length})`)
        
        // Extract metadata
        const metadata = extractImageMetadata(filename, i)
        console.log(`   Title: ${metadata.title}`)
        console.log(`   Style: ${metadata.style}`)
        console.log(`   Tags: ${metadata.tags.join(', ')}`)
        
        if (dryRun) {
          console.log('   🧪 Dry run - would create gallery record')
          results.created++
          continue
        }
        
        // Create gallery record with duplicate handling
        const createResult = await createGalleryImage(metadata, i, duplicateStrategy)
        
        if (createResult.success) {
          switch (createResult.action) {
            case 'created':
            case 'created_new':
              results.created++
              break
            case 'updated':
              results.updated++
              break
            case 'skipped':
              results.skipped++
              break
          }
        } else {
          results.errors.push(`Failed to process ${filename}: ${createResult.error}`)
        }
        
      } catch (error) {
        const errorMsg = `Error processing ${filename}: ${error}`
        console.error(`   ❌ ${errorMsg}`)
        results.errors.push(errorMsg)
      }
    }
    
    // Summary
    console.log('\n📊 Seeding Summary:')
    console.log(`   Processed: ${results.processed}`)
    console.log(`   Created: ${results.created}`)
    console.log(`   Updated: ${results.updated}`)
    console.log(`   Skipped: ${results.skipped}`)
    console.log(`   Errors: ${results.errors.length}`)
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      results.errors.forEach(error => console.log(`   - ${error}`))
    }
    
    results.success = results.errors.length === 0 || (results.created + results.updated) > 0
    
    if (results.success) {
      console.log('\n🎉 Gallery seeding completed successfully!')
    } else {
      console.log('\n⚠️ Gallery seeding completed with errors')
    }
    
    return results
    
  } catch (error) {
    console.error('\n💥 Fatal error during gallery seeding:', error)
    results.errors.push(`Fatal error: ${error}`)
    return results
  }
}

/**
 * CLI interface for running the seeding script
 */
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const forceUpdate = args.includes('--force')
  const updateExisting = args.includes('--update')
  
  let duplicateStrategy = null
  if (!dryRun) {
    const utils = await getGallerySeedingUtils()
    const DuplicateStrategy = utils.DuplicateStrategy
    
    if (updateExisting) {
      duplicateStrategy = DuplicateStrategy.UPDATE
    } else if (forceUpdate) {
      duplicateStrategy = DuplicateStrategy.CREATE_NEW
    } else {
      duplicateStrategy = DuplicateStrategy.SKIP
    }
  }
  
  try {
    const results = await seedGalleryFromPublic({
      skipExisting: !forceUpdate && !updateExisting,
      dryRun,
      duplicateStrategy
    })
    
    process.exit(results.success ? 0 : 1)
  } catch (error) {
    console.error('Script execution failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}