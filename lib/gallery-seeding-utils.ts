import { supabaseAdmin } from './supabase'
import { GalleryImage, GalleryImageInsert } from '@/types/supabase'

/**
 * Duplicate detection strategies
 */
export enum DuplicateStrategy {
  SKIP = 'skip',           // Skip if duplicate found
  UPDATE = 'update',       // Update existing record
  CREATE_NEW = 'create_new' // Create new record with different ID
}

/**
 * Duplicate detection criteria
 */
export interface DuplicateCheckCriteria {
  checkImageUrl?: boolean
  checkPublicId?: boolean
  checkTitle?: boolean
  checkFilename?: boolean
}

/**
 * Result of duplicate check
 */
export interface DuplicateCheckResult {
  isDuplicate: boolean
  existingRecord?: GalleryImage
  matchedOn: string[]
}

/**
 * Check for duplicate images in the database
 */
export async function checkForDuplicates(
  imageData: GalleryImageInsert,
  criteria: DuplicateCheckCriteria = {
    checkImageUrl: true,
    checkPublicId: true,
    checkTitle: false,
    checkFilename: false
  }
): Promise<DuplicateCheckResult> {
  try {
    const conditions: string[] = []
    const matchedOn: string[] = []
    
    // Build OR conditions based on criteria
    if (criteria.checkImageUrl && imageData.image_url) {
      conditions.push(`image_url.eq.${imageData.image_url}`)
      matchedOn.push('image_url')
    }
    
    if (criteria.checkPublicId && imageData.public_id) {
      conditions.push(`public_id.eq.${imageData.public_id}`)
      matchedOn.push('public_id')
    }
    
    if (criteria.checkTitle && imageData.title) {
      conditions.push(`title.eq.${imageData.title}`)
      matchedOn.push('title')
    }
    
    // Extract filename from image_url for filename check
    if (criteria.checkFilename && imageData.image_url) {
      const filename = imageData.image_url.split('/').pop()
      if (filename) {
        conditions.push(`image_url.like.%${filename}`)
        matchedOn.push('filename')
      }
    }
    
    if (conditions.length === 0) {
      return { isDuplicate: false, matchedOn: [] }
    }
    
    // Query database for duplicates
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select('*')
      .or(conditions.join(','))
      .limit(1)
    
    if (error) {
      console.error('Error checking for duplicates:', error)
      return { isDuplicate: false, matchedOn: [] }
    }
    
    const isDuplicate = data && data.length > 0
    
    return {
      isDuplicate,
      existingRecord: isDuplicate ? data[0] : undefined,
      matchedOn: isDuplicate ? matchedOn : []
    }
    
  } catch (error) {
    console.error('Error in duplicate check:', error)
    return { isDuplicate: false, matchedOn: [] }
  }
}

/**
 * Handle duplicate images based on strategy
 */
export async function handleDuplicate(
  imageData: GalleryImageInsert,
  existingRecord: GalleryImage,
  strategy: DuplicateStrategy
): Promise<{
  success: boolean
  action: string
  record?: GalleryImage
  error?: string
}> {
  try {
    switch (strategy) {
      case DuplicateStrategy.SKIP:
        return {
          success: true,
          action: 'skipped',
          record: existingRecord
        }
      
      case DuplicateStrategy.UPDATE:
        const { data: updatedData, error: updateError } = await supabaseAdmin
          .from('gallery_images')
          .update({
            title: imageData.title,
            description: imageData.description,
            style: imageData.style,
            tags: imageData.tags,
            is_active: imageData.is_active ?? true,
            order_index: imageData.order_index ?? 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id)
          .select()
          .single()
        
        if (updateError) {
          return {
            success: false,
            action: 'update_failed',
            error: updateError.message
          }
        }
        
        return {
          success: true,
          action: 'updated',
          record: updatedData
        }
      
      case DuplicateStrategy.CREATE_NEW:
        // Generate new unique public_id
        const newPublicId = `${imageData.public_id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
        
        const { data: newData, error: createError } = await supabaseAdmin
          .from('gallery_images')
          .insert({
            ...imageData,
            public_id: newPublicId
          })
          .select()
          .single()
        
        if (createError) {
          return {
            success: false,
            action: 'create_new_failed',
            error: createError.message
          }
        }
        
        return {
          success: true,
          action: 'created_new',
          record: newData
        }
      
      default:
        return {
          success: false,
          action: 'unknown_strategy',
          error: `Unknown duplicate strategy: ${strategy}`
        }
    }
  } catch (error) {
    return {
      success: false,
      action: 'handle_duplicate_error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Batch check for duplicates
 */
export async function batchCheckDuplicates(
  imageDataList: GalleryImageInsert[],
  criteria?: DuplicateCheckCriteria
): Promise<Map<number, DuplicateCheckResult>> {
  const results = new Map<number, DuplicateCheckResult>()
  
  // Process in batches to avoid overwhelming the database
  const batchSize = 10
  
  for (let i = 0; i < imageDataList.length; i += batchSize) {
    const batch = imageDataList.slice(i, i + batchSize)
    
    const batchPromises = batch.map(async (imageData, batchIndex) => {
      const globalIndex = i + batchIndex
      const result = await checkForDuplicates(imageData, criteria)
      results.set(globalIndex, result)
    })
    
    await Promise.all(batchPromises)
  }
  
  return results
}

/**
 * Get statistics about existing gallery images
 */
export async function getGalleryStats(): Promise<{
  total: number
  byStyle: Record<string, number>
  active: number
  inactive: number
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('gallery_images')
      .select('style, is_active')
    
    if (error) {
      throw error
    }
    
    const stats = {
      total: data.length,
      byStyle: {} as Record<string, number>,
      active: 0,
      inactive: 0
    }
    
    data.forEach(image => {
      // Count by style
      stats.byStyle[image.style] = (stats.byStyle[image.style] || 0) + 1
      
      // Count active/inactive
      if (image.is_active) {
        stats.active++
      } else {
        stats.inactive++
      }
    })
    
    return stats
  } catch (error) {
    console.error('Error getting gallery stats:', error)
    return {
      total: 0,
      byStyle: {},
      active: 0,
      inactive: 0
    }
  }
}

/**
 * Clean up orphaned gallery records (images that reference non-existent files)
 */
export async function cleanupOrphanedRecords(): Promise<{
  success: boolean
  deletedCount: number
  errors: string[]
}> {
  try {
    const { data: allImages, error } = await supabaseAdmin
      .from('gallery_images')
      .select('id, image_url, public_id')
    
    if (error) {
      throw error
    }
    
    const orphanedIds: string[] = []
    const errors: string[] = []
    
    // Check each image URL (this is a simplified check - in production you might want to check actual file existence)
    for (const image of allImages) {
      // Check if image_url looks like a valid path
      if (!image.image_url || 
          (!image.image_url.startsWith('/artworks/') && 
           !image.image_url.startsWith('http'))) {
        orphanedIds.push(image.id)
      }
    }
    
    // Delete orphaned records
    if (orphanedIds.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('gallery_images')
        .delete()
        .in('id', orphanedIds)
      
      if (deleteError) {
        errors.push(`Failed to delete orphaned records: ${deleteError.message}`)
      }
    }
    
    return {
      success: errors.length === 0,
      deletedCount: orphanedIds.length,
      errors
    }
  } catch (error) {
    return {
      success: false,
      deletedCount: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}