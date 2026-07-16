import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(
  file: string,
  folder: string = 'portfolio',
): Promise<string> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  })
  return result.secure_url
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getPublicIdFromUrl(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+?)\.(jpg|jpeg|png|gif|webp|svg)$/)
  return match ? match[1] : null
}

export function generateSignature(params: Record<string, string | number>) {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { ...params, timestamp },
    process.env.CLOUDINARY_API_SECRET!,
  )
  return { timestamp, signature }
}
