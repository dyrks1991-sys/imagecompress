'use client'

import type { OutputFormat } from '@/lib/compress'

interface QualitySliderProps {
  value: number
  onChange: (quality: number) => void
  format: OutputFormat
}

export default function QualitySlider({ value, onChange, format }: QualitySliderProps) {
  const isPng = format === 'png'
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 w-14 shrink-0">Quality</span>
      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={isPng}
          className="flex-1 accent-gray-900 disabled:opacity-40"
          aria-label={'Compression quality: ' + value + '%'}
        />
        <span className={'text-sm font-mono w-8 text-right ' + (isPng ? 'text-gray-400' : 'text-gray-900')}>
          {isPng ? '—' : value + '%'}
        </span>
      </div>
      {isPng && (
        <span className="text-xs text-amber-600 shrink-0">PNG is lossless</span>
      )}
    </div>
  )
}
