'use client'

import { useState, useRef } from 'react'

interface GalleryUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
}

export default function GalleryUpload({ images, onImagesChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const res = await fetch('/api/upload', { method: 'POST' })
    const { timestamp, signature, cloudName, apiKey, folder } = await res.json()

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
      onImagesChange([...images, data.secure_url])
    }
  }

  const removeImage = (idx: number) => {
    onImagesChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div>
      <label className="mb-1 block text-sm text-[#607b96]">Gallery Images</label>

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="group relative">
              <img src={url} alt="" className="h-20 w-20 rounded border border-[#607b96] object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[11px] text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded border border-[#607b96] px-3 py-1.5 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Add Image'}
      </button>
      <p className="mt-1 text-[11px] text-[#607b96]">Upload additional images for the project gallery/carousel.</p>
    </div>
  )
}
