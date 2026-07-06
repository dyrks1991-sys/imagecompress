'use client'

import type { OutputFormat } from '@/lib/compress'

interface QualitySliderProps {
  value: number
  onChange: (quality: number) => void
  format: OutputFormat
}

function qualityLabel(q: number): string {
  if (q >= 85) return 'High quality'
  if (q >= 60) return 'Balanced'
  if (q >= 40) return 'Smaller file'
  return 'Minimum size'
}

export default function QualitySlider({ value, onChange, format }: QualitySliderProps) {
  const isPng = format === 'png'

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500 w-16 shrink-0">Quality</span>
      <div className="flex-1 flex items-center gap-3">
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={isPng}
          className="flex-1 h-1.5 rounded-full accent-gray-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={'Compression quality: ' + value + '%'}
          aria-valuemin={10}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={isPng ? 'Not applicable for PNG' : value + '% — ' + qualityLabel(value)}
        />
        <div className="flex flex-col items-end w-20 shrink-0">
          <span className={'text-sm font-semibold tabular-nums ' + (isPng ? 'text-gray-300' : 'text-gray-900')}>
            {isPng ? '—' : value + '%'}
          </span>
          {!isPng && (
            <span className="text-xs text-gray-400 whitespace-nowrap">{qualityLabel(value)}</span>
          )}
          {isPng && (
            <span className="text-xs text-amber-500">Lossless</span>
          )}
        </div>
      </div>
    </div>
  )
}
