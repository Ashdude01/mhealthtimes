import { v2 as cloudinary } from 'cloudinary'

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.warn('Cloudinary configuration missing. Image uploads will not work.')
}

export default cloudinary

export const uploadImage = async (file: Buffer, folder: string = 'mhealthtimes') => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured) {
      throw new Error('Cloudinary is not configured. Please check your environment variables.')
    }

    // Validate file size (max 10MB)
    const fileSizeInMB = file.length / (1024 * 1024)
    if (fileSizeInMB > 10) {
      throw new Error('File size too large. Maximum size is 10MB.')
    }

    // Convert buffer to base64
    const base64Image = file.toString('base64')
    
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`,
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ],
        // Add additional options for better performance
        eager: [
          { width: 400, height: 300, crop: 'limit' },
          { width: 200, height: 150, crop: 'limit' }
        ],
        eager_async: true,
        eager_notification_url: process.env.CLOUDINARY_NOTIFICATION_URL || undefined
      }
    )
    
    console.log('Image uploaded successfully:', result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('File size too large')) {
        throw new Error('File size too large. Please select an image smaller than 10MB.')
      }
      if (error.message.includes('Cloudinary is not configured')) {
        throw new Error('Image upload service is not configured. Please contact support.')
      }
    }
    
    throw new Error('Failed to upload image. Please try again.')
  }
}
