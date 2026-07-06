'use client'

import { formatBytes } from '@/lib/filesize'

interface ImagePreviewProps {
  originalUrl: string
  originalSize: number
  fileName: string
  compressedUrl: string | null
  compressedSize: number
  width: number
  height: number
  isCompressing: boolean
}

export default function ImagePreview({
  originalUrl,
  originalSize,
  fileName,
  compressedUrl,
  compressedSize,
  width,
  height,
  isCompressing,
}: ImagePreviewProps) {
  const dimensionLabel = width > 0 ? width + ' × ' + height : ''
  const shortName = fileName.length > 22 ? fileName.slice(0, 19) + '…' : fileName

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Before */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">Before</span>
          <span className="text-xs text-gray-400 font-mono truncate max-w-[120px]" title={fileName}>
            {shortName}
          </span>
        </div>
        <div
          className="w-full overflow-hidden rounded-xl bg-[#f8f8f8] border border-gray-200 flex items-center justify-center"
          style={{ height: '220px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original image"
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: '220px' }}
          />
        </div>
        <p className="text-xs text-gray-500 tabular-nums">
          {dimensionLabel && <span>{dimensionLabel}px · </span>}
          <span className="font-medium">{formatBytes(originalSize)}</span>
        </p>
      </div>

      {/* After */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">After</span>
          {!isCompressing && compressedSize > 0 && (
            <span className="text-xs text-emerald-600 font-medium">
              {formatBytes(compressedSize)}
            </span>
          )}
        </div>
        <div
          className="w-full overflow-hidden rounded-xl bg-[#f8f8f8] border border-gray-200 flex items-center justify-center"
          style={{ height: '220px' }}
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
              <span className="text-xs text-gray-400 font-medium">Compressing…</span>
            </div>
          ) : compressedUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={compressedUrl}
              alt="Compressed image"
              className="max-w-full max-h-full object-contain animate-fade-in"
              style={{ maxHeight: '220px' }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-30">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="text-xs text-gray-400">Preview will appear here</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 tabular-nums">
          {!isCompressing && compressedSize > 0 && dimensionLabel
            ? <span>{dimensionLabel}px · <span className="font-medium">{formatBytes(compressedSize)}</span></span>
            : <span>&nbsp;</span>}
        </p>
      </div>
    </div>
  )
}
