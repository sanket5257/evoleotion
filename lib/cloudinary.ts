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
  // Configure cloudinary before use
  const cloudinaryInstance = configureCloudinary()
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  return new Promise((resolve, reject) => {
    cloudinaryInstance.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    ).end(buffer)
  })
}