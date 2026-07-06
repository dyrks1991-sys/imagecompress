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
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setError(null)
    if (!ACCEPT.includes(file.type)) {
      setError('Unsupported format. Please use JPG, PNG, or WebP.')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError('File too large. Maximum size is ' + MAX_MB + ' MB.')
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

  const onDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drag state if leaving the zone (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }, [])

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
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload image — click or drag a file here"
      aria-disabled={disabled}
      className={
        'group relative flex flex-col items-center justify-center gap-5 w-full rounded-2xl ' +
        'border-2 border-dashed min-h-[240px] cursor-pointer select-none transition-all duration-200 ' +
        (isDragging
          ? 'border-gray-900 bg-gray-900/5 scale-[1.01] '
          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50/50 ') +
        (disabled ? 'pointer-events-none opacity-50' : '')
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(',')}
        onChange={onInputChange}
        className="sr-only"
        disabled={disabled}
        tabIndex={-1}
      />

      {/* Icon */}
      <div className={
        'w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ' +
        (isDragging ? 'bg-gray-900' : 'bg-gray-100 group-hover:bg-gray-200')
      }>
        {isDragging ? (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1.5 text-center px-6">
        <p className="font-semibold text-gray-800">
          {isDragging ? 'Release to compress' : 'Drop your image here'}
        </p>
        <p className="text-sm text-gray-500">
          or{' '}
          <span className="text-gray-900 font-medium underline underline-offset-2 decoration-gray-300">
            click to browse
          </span>
        </p>
      </div>

      {/* Format pills */}
      <div className="flex items-center gap-2" aria-label="Supported formats">
        {['JPEG', 'PNG', 'WebP'].map((fmt) => (
          <span
            key={fmt}
            className="text-xs font-medium text-gray-400 border border-gray-200 rounded-md px-2 py-0.5"
          >
            {fmt}
          </span>
        ))}
        <span className="text-xs text-gray-300 ml-1">· up to {MAX_MB} MB</span>
      </div>

      {/* Error */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
            {error}
          </p>
        </div>
      )}
    </div>
  )
}
