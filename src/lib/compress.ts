export type OutputFormat = 'jpeg' | 'webp' | 'png'

export interface CompressResult {
  blob: Blob
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

export async function compressImage(
  file: File,
  format: OutputFormat,
  quality: number
): Promise<CompressResult> {
  const bmp = await createImageBitmap(file)
  const { width, height } = bmp

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unavailable')
  ctx.drawImage(bmp, 0, 0)
  bmp.close()

  const mime =
    format === 'jpeg' ? 'image/jpeg' :
    format === 'webp' ? 'image/webp' :
    'image/png'

  const qualityArg = format === 'png' ? undefined : quality / 100

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      mime,
      qualityArg
    )
  })

  return { blob, originalSize: file.size, compressedSize: blob.size, width, height }
}
