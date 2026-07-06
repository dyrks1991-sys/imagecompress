'use client'

import { formatBytes } from '@/lib/filesize'

interface ImagePreviewProps {
  originalUrl: string
  originalSize: number
  compressedUrl: string | null
  compressedSize: number
  width: number
  height: number
  isCompressing: boolean
}

export default function ImagePreview({
  originalUrl,
  originalSize,
  compressedUrl,
  compressedSize,
  width,
  height,
  isCompressing,
}: ImagePreviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Before</span>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
        </div>
        <p className="text-sm text-gray-500">
          {width > 0 ? width + ' × ' + height + 'px  ·  ' : ''}{formatBytes(originalSize)}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">After</span>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              <span className="text-xs text-gray-400">Compressing…</span>
            </div>
          ) : compressedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
          ) : null}
        </div>
        <p className="text-sm text-gray-500">
          {!isCompressing && compressedSize > 0
            ? width + ' × ' + height + 'px  ·  ' + formatBytes(compressedSize)
            : ' '}
        </p>
      </div>
    </div>
  )
}
