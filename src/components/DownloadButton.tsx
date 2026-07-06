'use client'

import { downloadBlob, generateFilename } from '@/lib/download'
import { formatBytes } from '@/lib/filesize'
import type { OutputFormat } from '@/lib/compress'

interface DownloadButtonProps {
  blob: Blob | null
  format: OutputFormat
  compressedSize: number
  onReset: () => void
}

export default function DownloadButton({ blob, format, compressedSize, onReset }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!blob) return
    downloadBlob(blob, generateFilename(format))
  }

  const ext = format === 'jpeg' ? 'JPG' : format.toUpperCase()
  const label = blob
    ? 'Download ' + ext + '  ·  ' + formatBytes(compressedSize)
    : 'Download'

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={handleDownload}
        disabled={!blob}
        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {label}
      </button>
      <button
        onClick={onReset}
        className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        Compress another
      </button>
    </div>
  )
}
