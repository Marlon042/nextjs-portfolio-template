import { NextResponse } from 'next/server'
import { generateSignature } from '@/lib/cloudinary'

export async function POST() {
  const folder = 'portfolio'
  const { timestamp, signature } = generateSignature({ folder })

  return NextResponse.json({
    timestamp,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
  })
}
