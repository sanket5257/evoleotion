import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Upload image to Supabase Storage
export const uploadToSupabase = async (file: File, folder: string) => {
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
}