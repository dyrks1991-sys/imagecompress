'use client'

import type { OutputFormat } from '@/lib/compress'

interface FormatSelectorProps {
  value: OutputFormat
  onChange: (format: OutputFormat) => void
}

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
  { value: 'png',  label: 'PNG'  },
]

export default function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 w-14 shrink-0">Format</span>
      <div className="flex gap-1.5" role="radiogroup" aria-label="Output format">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            role="radio"
            aria-checked={value === f.value}
            onClick={() => onChange(f.value)}
            className={
              'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ' +
              (value === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400')
            }
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
