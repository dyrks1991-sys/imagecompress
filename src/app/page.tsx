'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { compressImage, type OutputFormat, type CompressResult } from '@/lib/compress'
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
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Compression failed')
        setResult(null)
      } finally {
        setIsCompressing(false)
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [file, format, quality])

  const handleReset = useCallback(() => {
    setFile(null)
    setResult(null)
    setError(null)
    setFormat('jpeg')
    setQuality(80)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold tracking-tight">IC</span>
            </div>
            <span className="font-semibold text-gray-900 text-sm">ImageCompress</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Fast · Private · Client-side</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {!file ? (
          <div className="flex flex-col items-center gap-10">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
                Compress images.<br />
                <span className="text-gray-400">Instantly.</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 max-w-sm mx-auto">
                Free, private, runs entirely in your browser. No upload. No signup. No limits.
              </p>
            </div>
            <div className="w-full max-w-md">
              <DropZone onFile={setFile} />
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <span>✓ JPG · PNG · WebP</span>
              <span>✓ No upload</span>
              <span>✓ 100% private</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm">
              <FormatSelector value={format} onChange={setFormat} />
              <div className="border-t border-gray-100" />
              <QualitySlider value={quality} onChange={setQuality} format={format} />
            </div>

            {originalUrl && (
              <ImagePreview
                originalUrl={originalUrl}
                originalSize={file.size}
                compressedUrl={compressedUrl}
                compressedSize={result?.compressedSize ?? 0}
                width={result?.width ?? 0}
                height={result?.height ?? 0}
                isCompressing={isCompressing}
              />
            )}

            {result && !isCompressing && (
              <CompressionStats
                originalSize={file.size}
                compressedSize={result.compressedSize}
              />
            )}

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 py-2 px-4 rounded-xl">{error}</p>
            )}

            <DownloadButton
              blob={result?.blob ?? null}
              format={format}
              compressedSize={result?.compressedSize ?? 0}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      <footer className="mt-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            Your images are processed entirely in your browser — nothing is ever uploaded to a server.
          </p>
        </div>
      </footer>
    </main>
  )
}
