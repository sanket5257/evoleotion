import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseServiceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Client-side Supabase client for authenticated operations
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Upload image to Supabase Storage
export const uploadToSupabase = async (file: File, folder: string) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Please check environment variables.')
  }

  try {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided')
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit')
    }
    
    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif',
      'image/bmp',
      'image/tiff'
    ]
    
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      throw new Error('Unsupported file format. Please use JPEG, PNG, WebP, GIF, BMP, or TIFF')
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      throw new Error('Failed to get public URL')
    }

    return {
      secure_url: publicUrlData.publicUrl,
      public_id: filePath, // Use file path as public_id for consistency
      path: filePath
    }
  } catch (error) {
    console.error('Upload preparation error:', error)
    throw error
  }
}

// Delete image from Supabase Storage
export const deleteFromSupabase = async (filePath: string) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Please check environment variables.')
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from('images')
      .remove([filePath])

    if (error) {
      console.error('Supabase delete error:', error)
      throw new Error(`Delete failed: ${error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

// Get optimized image URL with transformations
export const getOptimizedImageUrl = (filePath: string, options?: {
  width?: number
  height?: number
  quality?: number
}) => {
  if (!supabaseAdmin) {
    console.error('Supabase admin client not configured. Returning placeholder URL.')
    return '/api/placeholder/400/500?text=Image+Not+Available'
  }

  try {
    const { data } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath, {
        transform: {
          width: options?.width || 800,
          height: options?.height || 600,
          quality: options?.quality || 80
        }
      })

    return data.publicUrl
  } catch (error) {
    console.error('Error getting optimized image URL:', error)
    // Return the basic public URL as fallback
    try {
      const { data } = supabaseAdmin.storage
        .from('images')
        .getPublicUrl(filePath)
      
      return data.publicUrl
    } catch (fallbackError) {
      console.error('Error getting basic public URL:', fallbackError)
      return '/api/placeholder/400/500?text=Image+Error'
    }
  }
}

// List all files in a folder
export const listFilesInFolder = async (folder: string) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Please check environment variables.')
  }

  try {
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .list(folder, {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Error listing files:', error)
      throw new Error(`Failed to list files: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('List files error:', error)
    throw error
  }
}

// Get file metadata
export const getFileMetadata = async (filePath: string) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Please check environment variables.')
  }

  try {
    const { data } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(filePath)

    return data
  } catch (error) {
    console.error('Get file metadata error:', error)
    throw error
  }
}

// Cleanup orphaned files (files not referenced in database)
export const cleanupOrphanedFiles = async (referencedPaths: string[]) => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Please check environment variables.')
  }

  try {
    // Get all files in the images bucket
    const { data: allFiles, error } = await supabaseAdmin.storage
      .from('images')
      .list('', {
        limit: 1000,
        offset: 0
      })

    if (error) {
      throw new Error(`Failed to list files: ${error.message}`)
    }

    // Find files that are not referenced
    const orphanedFiles = allFiles?.filter(file => 
      !referencedPaths.some(path => path.includes(file.name))
    ) || []

    // Delete orphaned files
    if (orphanedFiles.length > 0) {
      const filesToDelete = orphanedFiles.map(file => file.name)
      const { error: deleteError } = await supabaseAdmin.storage
        .from('images')
        .remove(filesToDelete)

      if (deleteError) {
        throw new Error(`Failed to delete orphaned files: ${deleteError.message}`)
      }

      return {
        success: true,
        deletedCount: filesToDelete.length,
        deletedFiles: filesToDelete
      }
    }

    return {
      success: true,
      deletedCount: 0,
      deletedFiles: []
    }
  } catch (error) {
    console.error('Cleanup orphaned files error:', error)
    throw error
  }
}