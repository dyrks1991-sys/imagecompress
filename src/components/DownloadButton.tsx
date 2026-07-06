'use client'

import { downloadBlob, generateFilename } from '@/lib/download'
import { formatBytes } from '@/lib/filesize'
import type { OutputFormat } from '@/lib/compress'

interface DownloadButtonProps {
  blob: Blob | null
  format: OutputFormat
  compressedSize: number
  onReset: () => void
  onDownload?: () => void
}

export default function DownloadButton({ blob, format, compressedSize, onReset, onDownload }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!blob) return
    onDownload?.()
    downloadBlob(blob, generateFilename(format))
  }

  const ext = format === 'jpeg' ? 'JPG' : format.toUpperCase()
  const sizeLabel = blob && compressedSize > 0 ? formatBytes(compressedSize) : ''

  return (
    <div className="flex flex-col sm:flex-row gap-2.5">
      <button
        onClick={handleDownload}
        disabled={!blob}
        aria-label={blob ? 'Download compressed image as ' + ext : 'Download (compressing…)'}
        className={
          'flex-1 flex items-center justify-center gap-2 px-6 py-3.5 ' +
          'text-sm font-semibold rounded-xl transition-all duration-150 ' +
          (blob
            ? 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98] shadow-sm hover:shadow-md'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed')
        }
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        <span>
          {blob
            ? 'Download ' + ext + (sizeLabel ? '  ·  ' + sizeLabel : '')
            : 'Compressing…'}
        </span>
      </button>

      <button
        onClick={onReset}
        aria-label="Compress another image"
        className="px-5 py-3.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-150 whitespace-nowrap"
      >
        Compress another
      </button>
    </div>
  )
}
