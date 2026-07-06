'use client'

import { formatBytes, savingsPercent } from '@/lib/filesize'

interface CompressionStatsProps {
  originalSize: number
  compressedSize: number
}

export default function CompressionStats({ originalSize, compressedSize }: CompressionStatsProps) {
  const savings = savingsPercent(originalSize, compressedSize)
  const isSmaller = savings > 0
  const savedBytes = originalSize - compressedSize

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Hero number */}
        <div className="flex flex-col">
          <span className={
            'text-5xl font-black tabular-nums leading-none tracking-tight ' +
            (isSmaller ? 'text-gray-900' : 'text-amber-600')
          }>
            {isSmaller ? savings + '%' : '+' + Math.abs(savings) + '%'}
          </span>
          <span className={'text-sm font-medium mt-1 ' + (isSmaller ? 'text-emerald-600' : 'text-amber-600')}>
            {isSmaller
              ? 'file size reduced'
              : 'larger (try lower quality or JPEG)'}
          </span>
        </div>

        {/* Size breakdown */}
        <div className="flex flex-col items-end gap-2 text-right">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-400 font-medium">Before</div>
              <div className="text-sm font-semibold text-gray-700">{formatBytes(originalSize)}</div>
            </div>
            <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="text-right">
              <div className="text-xs text-gray-400 font-medium">After</div>
              <div className={'text-sm font-semibold ' + (isSmaller ? 'text-emerald-600' : 'text-amber-600')}>
                {formatBytes(compressedSize)}
              </div>
            </div>
          </div>
          {isSmaller && (
            <span className="text-xs text-gray-400">
              Saved {formatBytes(savedBytes)}
            </span>
          )}
        </div>
      </div>

      {/* Compression bar */}
      {isSmaller && (
        <div className="mt-4">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 rounded-full transition-all duration-500"
              style={{ width: (100 - savings) + '%' }}
              role="progressbar"
              aria-valuenow={100 - savings}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={'Compressed size is ' + (100 - savings) + '% of original'}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-400">0%</span>
            <span className="text-xs text-gray-400">Original size</span>
          </div>
        </div>
      )}
    </div>
  )
}
