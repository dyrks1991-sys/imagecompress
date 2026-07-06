# Technical Specification — ImageCompress

> Version: 0.1.0
> Status: Approved
> Date: 2026-07-06

---

## Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (static export, output: 'export') | Same pipeline as QuickQR — zero new infra |
| Language | TypeScript 5 (strict mode) | Strict mode, consistent with all DevOS projects |
| Styling | Tailwind CSS 3 | Utility-first, mobile-first, design system consistent |
| Compression | browser-image-compression ^2.0 (WASM-backed) | WASM-backed, Web Worker, cross-browser consistent |
| State | React useState / useReducer — no external store | Sufficient for single-page linear state machine |
| Deployment | Vercel (static export) | Proven by QuickQR deploy |

---

## Architecture

```
Browser
  └── Next.js 14 static export
        └── page.tsx (state owner)
              ├── DropZone         ← File input
              ├── FormatSelector   ← Output format
              ├── QualitySlider    ← Compression level
              ├── ImagePreview     ← Before/after display
              ├── CompressionStats ← Size delta
              └── DownloadButton   ← Output
```

**No backend. No API. No database. No auth.**
All computation happens in the user's browser.

---

## Folder Structure

```
projects/imagecompress/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, metadata
│   │   ├── page.tsx            # Main tool page — orchestrates all components
│   │   └── globals.css         # Tailwind imports
│   ├── components/
│   │   ├── DropZone.tsx
│   │   ├── FormatSelector.tsx
│   │   ├── QualitySlider.tsx
│   │   ├── ImagePreview.tsx
│   │   ├── CompressionStats.tsx
│   │   └── DownloadButton.tsx
│   └── lib/
│       ├── compress.ts
│       ├── download.ts
│       └── filesize.ts
├── public/
├── decisions/
├── PRD.md
├── TECH_SPEC.md
├── UI_PLAN.md
├── TASKS.md
├── ROADMAP.md
├── CHECKLIST.md
├── DECISIONS.md
├── README.md
├── STATUS.md
├── CHANGELOG.md
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
└── .gitignore
```

---

## Component Specifications

| Component | File | Responsibility |
|---|---|---|
| `DropZone` | `src/components/DropZone.tsx` | Drag-and-drop and click-to-upload area. Emits File on selection. |
| `FormatSelector` | `src/components/FormatSelector.tsx` | Radio button group: JPEG | WebP | PNG. Controlled component. |
| `QualitySlider` | `src/components/QualitySlider.tsx` | Range input 10–100 with live numeric display. |
| `ImagePreview` | `src/components/ImagePreview.tsx` | Side-by-side before/after. Takes originalSrc + compressedSrc. |
| `CompressionStats` | `src/components/CompressionStats.tsx` | Displays: original KB, new KB, savings %, dimensions. |
| `DownloadButton` | `src/components/DownloadButton.tsx` | Triggers Blob URL download. Disabled when no compressed output. |

---

## Library Modules

| Module | File | Responsibility |
|---|---|---|
| — | `src/lib/compress.ts` | Wraps browser-image-compression. Returns Blob + metadata. |
| — | `src/lib/download.ts` | createObjectURL → anchor.click → revokeObjectURL. generateFilename(). |
| — | `src/lib/filesize.ts` | Formats bytes → "42.3 KB". Computes savings percentage. |

---

## State Design

All state lives in `src/app/page.tsx`. Components are stateless — they receive props and call callbacks.

| State | Type | Default | Description |
|---|---|---|---|
| `selectedFile` | `File | null` | `null` | Original image file from DropZone |
| `originalUrl` | `string | null` | `null` | Object URL for original preview |
| `outputFormat` | `'jpeg' | 'webp' | 'png'` | `'jpeg'` | Selected output format |
| `quality` | `number` | `80` | Compression quality 10–100 |
| `compressedBlob` | `Blob | null` | `null` | Result from compression engine |
| `compressedUrl` | `string | null` | `null` | Object URL for compressed preview |
| `isCompressing` | `boolean` | `false` | Loading state — disables controls |
| `error` | `string | null` | `null` | Compression error message |

---

## Data Flow

```
User drops file
  → selectedFile ← File
  → originalUrl  ← URL.createObjectURL(file)
  → useEffect [selectedFile, outputFormat, quality]
      → compress(file, { format, quality })
      → compressedBlob ← Blob
      → compressedUrl  ← URL.createObjectURL(blob)
  → ImagePreview renders both URLs
  → DownloadButton: downloadBlob(compressedBlob, generateFilename(format))
```

---

## No Backend Required

| Concern | Resolution |
|---|---|
| Storage | None — files never leave the browser |
| Auth | None — no accounts |
| API | None — Canvas API + Web Worker |
| GDPR | Trivially compliant — zero data retention |
| Hosting | Vercel free tier, static CDN |

---

## Performance Targets

| Metric | Target | How |
|---|---|---|
| First Load JS | < 100 KB | Static export, no unnecessary deps |
| Compression time (2MB JPEG) | < 2 000ms | browser-image-compression Web Worker |
| Preview update after slider | < 300ms | Debounce + Web Worker |
| Lighthouse Performance | ≥ 90 | Static export + no blocking resources |

---

*Generated by DevOS Planner Agent v1 — 2026-07-06*
