'use client'

import { useCallback, useState, useRef } from 'react'

interface DropZoneProps {
  onFile: (file: File) => void
  disabled?: boolean
}

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 50

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setDragError(null)
    if (!ACCEPT.includes(file.type)) {
      setDragError('Unsupported format. Please use JPG, PNG, or WebP.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setDragError('File too large. Maximum size is ' + MAX_MB + 'MB.')
      return
    }
    onFile(file)
  }, [onFile])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      aria-label="Upload image"
      className={
        'relative flex flex-col items-center justify-center gap-4 w-full rounded-2xl border-2 border-dashed min-h-[220px] cursor-pointer select-none transition-colors ' +
        (isDragging
          ? 'border-gray-900 bg-gray-100 '
          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 ') +
        (disabled ? 'opacity-50 cursor-not-allowed' : '')
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(',')}
        onChange={onInputChange}
        className="sr-only"
        disabled={disabled}
      />
      <div className="flex flex-col items-center gap-2 text-center px-6">
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-base font-medium text-gray-700">
          {isDragging ? 'Drop to compress' : 'Drop image here'}
        </p>
        <p className="text-sm text-gray-400">
          or <span className="text-gray-700 underline">click to browse</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG · PNG · WebP · Max {MAX_MB}MB</p>
      </div>
      {dragError && (
        <p className="absolute bottom-3 text-xs text-red-500 px-4 text-center">{dragError}</p>
      )}
    </div>
  )
}
