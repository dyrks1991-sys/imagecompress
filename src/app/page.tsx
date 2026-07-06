'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { compressImage, type OutputFormat, type CompressResult } from '@/lib/compress'
import { trackEvent } from '@/lib/analytics'
import DropZone from '@/components/DropZone'
import FormatSelector from '@/components/FormatSelector'
import QualitySlider from '@/components/QualitySlider'
import ImagePreview from '@/components/ImagePreview'
import CompressionStats from '@/components/CompressionStats'
import DownloadButton from '@/components/DownloadButton'

const DEBOUNCE_MS = 300

export default function Home() {
  const [file, setFile]                   = useState<File | null>(null)
  const [originalUrl, setOriginalUrl]     = useState<string | null>(null)
  const [format, setFormat]               = useState<OutputFormat>('jpeg')
  const [quality, setQuality]             = useState(80)
  const [result, setResult]               = useState<CompressResult | null>(null)
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!file) { setOriginalUrl(null); return }
    const url = URL.createObjectURL(file)
    setOriginalUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    if (!result) { setCompressedUrl(null); return }
    const url = URL.createObjectURL(result.blob)
    setCompressedUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [result])

  useEffect(() => {
    if (!file) return
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setIsCompressing(true)
      setError(null)
      try {
        const r = await compressImage(file, format, quality)
        setResult(r)
        trackEvent('image_compressed', { format, quality, originalSize: file.size, compressedSize: r.compressedSize })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Compression failed')
        setResult(null)
      } finally {
        setIsCompressing(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [file, format, quality])

  const handleFile = useCallback((f: File) => {
    setFile(f)
    trackEvent('file_selected', { type: f.type, size: f.size })
  }, [])

  const handleReset = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
    setFormat('jpeg')
    setQuality(80)
    trackEvent('compress_another')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group" aria-label="ImageCompress home">
            <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-700 transition-colors">
              <span className="text-white text-[10px] font-black tracking-tight">IC</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">ImageCompress</span>
          </a>
          <nav className="flex items-center gap-4" aria-label="Site info">
            <span className="text-xs text-gray-400 hidden sm:block">Free · Private · No upload</span>
            <a
              href="https://github.com/dyrks1991-sys/imagecompress"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="View source on GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        {!file ? (
          /* ─── Empty state ─────────────────────────────────────────── */
          <div className="flex flex-col items-center gap-10 animate-fade-in">
            <div className="text-center max-w-xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1]">
                Compress images.<br />
                <span className="text-gray-400">Up to 90% smaller.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
                Free, private, and instant. Your files never leave your device —
                everything runs directly in your browser.
              </p>
            </div>

            <div className="w-full max-w-md">
              <DropZone onFile={handleFile} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                JPEG · PNG · WebP
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                No upload
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant results
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Works offline
              </span>
            </div>
          </div>
        ) : (
          /* ─── Active state ────────────────────────────────────────── */
          <div className="flex flex-col gap-5 animate-fade-up">
            {/* Controls */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
              <FormatSelector value={format} onChange={setFormat} />
              <div className="border-t border-gray-100" />
              <QualitySlider value={quality} onChange={setQuality} format={format} />
            </div>

            {/* Preview */}
            {originalUrl && (
              <ImagePreview
                originalUrl={originalUrl}
                originalSize={file.size}
                fileName={file.name}
                compressedUrl={compressedUrl}
                compressedSize={result?.compressedSize ?? 0}
                width={result?.width ?? 0}
                height={result?.height ?? 0}
                isCompressing={isCompressing}
              />
            )}

            {/* Stats */}
            {result && !isCompressing && (
              <div className="animate-scale-in">
                <CompressionStats
                  originalSize={file.size}
                  compressedSize={result.compressedSize}
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 text-sm text-red-600 bg-red-50 border border-red-100 py-3 px-4 rounded-xl">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <DownloadButton
              blob={result?.blob ?? null}
              format={format}
              compressedSize={result?.compressedSize ?? 0}
              onReset={handleReset}
              onDownload={() => trackEvent('download', { format, compressedSize: result?.compressedSize })}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            Your images are processed entirely in your browser — nothing is ever sent to a server.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a
              href="https://github.com/dyrks1991-sys/imagecompress"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors"
            >
              Open source
            </a>
            <span>·</span>
            <span>Built by DevOS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
