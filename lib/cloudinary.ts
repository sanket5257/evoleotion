import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration function to avoid module-level execution
export function configureCloudinary() {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }
  return cloudinary
}

export { cloudinary }

export const uploadToCloudinary = async (file: File, folder: string) => {
  try {
    // Configure cloudinary before use
    const cloudinaryInstance = configureCloudinary()
    
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
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinaryInstance.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'auto', // Let Cloudinary determine the best format
          quality: 'auto:good',
          fetch_format: 'auto',
          transformation: [
            { width: 1200, height: 1500, crop: 'limit', quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error(`Upload failed: ${error.message}`))
          } else if (!result) {
            reject(new Error('Upload failed: No result returned'))
          } else {
            resolve(result)
          }
        }
      )
      
      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Upload preparation error:', error)
    throw error
  }
}