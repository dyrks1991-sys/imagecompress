'use client'

import { formatBytes, savingsPercent } from '@/lib/filesize'

interface CompressionStatsProps {
  originalSize: number
  compressedSize: number
}

export default function CompressionStats({ originalSize, compressedSize }: CompressionStatsProps) {
  const savings = savingsPercent(originalSize, compressedSize)
  const isSmaller = savings > 0

  return (
    <div className="flex items-center justify-center gap-3 py-1 flex-wrap">
      <span className="text-sm text-gray-500">{formatBytes(originalSize)}</span>
      <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
      <span className="text-sm font-semibold text-gray-900">{formatBytes(compressedSize)}</span>
      <span className={
        'text-sm font-medium px-2.5 py-0.5 rounded-full ' +
        (isSmaller ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')
      }>
        {isSmaller ? savings + '% smaller' : Math.abs(savings) + '% larger'}
      </span>
    </div>
  )
}
