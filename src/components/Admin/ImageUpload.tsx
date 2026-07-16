'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUpload({ onUpload, currentImage, label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    // Get upload signature from API
    const res = await fetch('/api/upload', { method: 'POST' })
    const { timestamp, signature, cloudName, apiKey, folder } = await res.json()

    // Upload to Cloudinary via unsigned/signed upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('signature', signature)
    formData.append('folder', folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData },
    )

    const data = await uploadRes.json()
    setUploading(false)

    if (data.secure_url) {
      setPreview(data.secure_url)
      onUpload(data.secure_url)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-[#607b96]">{label}</label>

      <div className="flex items-center gap-4">
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 rounded border border-[#607b96] object-cover"
          />
        )}

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded bg-[#5565e8] px-4 py-2 text-sm text-white transition hover:bg-[#4555d8] disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : currentImage ? 'Change Image' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  )
}
