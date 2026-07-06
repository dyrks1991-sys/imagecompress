# Tasks — ImageCompress

> Version: 0.1.0
> Sprint: 1
> Generated: 2026-07-06
> Total estimated: 19.5h (~2.4 days)

---

## Task Status Key

| Status | Meaning |
|---|---|
| `pending` | Not started |
| `in_progress` | Currently being worked on |
| `done` | Complete, AC verified |
| `blocked` | Waiting on dependency |

---

## Epic: Foundation

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E1-T1` | Bootstrap project | 0.5h | — | done |
| `E1-T2` | Install browser-image-compression | 0.5h | E1-T1 | done |

### E1-T1 — Bootstrap project

**Estimate:** 0.5h  
**Dependencies:** none  
**Description:** Run `node agents/bootstrap.js ImageCompress`. Verify build passes. Commit.

### E1-T2 — Install browser-image-compression

**Estimate:** 0.5h  
**Dependencies:** E1-T1  
**Description:** npm install browser-image-compression. Add to package.json.

## Epic: Upload

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E2-T1` | DropZone component | 2h | E1-T2 | done |

### E2-T1 — DropZone component

**Estimate:** 2h  
**Dependencies:** E1-T2  
**Description:** Accept File via drag-drop and click. Emit onChange(File). Show filename + original size. Validate: image/* only, max 50MB.

## Epic: Compression

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E3-T1` | compress.ts lib | 2h | E1-T2 | done |
| `E3-T2` | Trigger compression on input | 1h | E2-T1, E3-T1 | done |

### E3-T1 — compress.ts lib

**Estimate:** 2h  
**Dependencies:** E1-T2  
**Description:** Wrap browser-image-compression. Input: File + { format, quality }. Output: Promise<{ blob: Blob, originalSize: number, compressedSize: number }>.

### E3-T2 — Trigger compression on input

**Estimate:** 1h  
**Dependencies:** E2-T1, E3-T1  
**Description:** In page.tsx: useEffect watching [selectedFile, outputFormat, quality]. Debounce 300ms. Set isCompressing during run.

## Epic: Controls

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E4-T1` | FormatSelector component | 1h | E1-T1 | done |
| `E4-T2` | QualitySlider component | 1h | E1-T1 | done |

### E4-T1 — FormatSelector component

**Estimate:** 1h  
**Dependencies:** E1-T1  
**Description:** Controlled radio group: JPEG | WebP | PNG. Default JPEG. Passes value + onChange.

### E4-T2 — QualitySlider component

**Estimate:** 1h  
**Dependencies:** E1-T1  
**Description:** Range 10–100, default 80. Show numeric value. Passes value + onChange.

## Epic: Preview

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E5-T1` | ImagePreview component | 2h | E3-T2 | done |
| `E5-T2` | CompressionStats component | 1h | E5-T1 | done |
| `E5-T3` | filesize.ts lib | 0.5h | — | done |

### E5-T1 — ImagePreview component

**Estimate:** 2h  
**Dependencies:** E3-T2  
**Description:** Side-by-side: takes originalUrl + compressedUrl + originalSize + compressedSize. Shows each with size label below. Loading skeleton when isCompressing.

### E5-T2 — CompressionStats component

**Estimate:** 1h  
**Dependencies:** E5-T1  
**Description:** Reads originalSize + compressedSize. Displays: "X KB → Y KB (Z% smaller)". Red text if Z < 0 (compressed is larger).

### E5-T3 — filesize.ts lib

**Estimate:** 0.5h  
**Dependencies:** none  
**Description:** formatBytes(n): "42.3 KB". savingsPercent(orig, new): number.

## Epic: Download

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E6-T1` | download.ts lib | 0.5h | — | done |
| `E6-T2` | DownloadButton component | 0.5h | E3-T2, E6-T1 | done |

### E6-T1 — download.ts lib

**Estimate:** 0.5h  
**Dependencies:** none  
**Description:** generateFilename(ext): imagecompress-YYYYMMDD-HHMMSS.ext. downloadBlob(blob, filename): URL → anchor → revoke.

### E6-T2 — DownloadButton component

**Estimate:** 0.5h  
**Dependencies:** E3-T2, E6-T1  
**Description:** Disabled when no compressedBlob. On click: downloadBlob(). Shows "Download JPEG" (format-aware label).

## Epic: Integration

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E7-T1` | Wire all in page.tsx | 2h | E2-T1, E4-T1, E4-T2, E5-T1, E5-T2, E6-T2 | done |
| `E7-T2` | Empty state (no file selected) | 0.5h | E7-T1 | done |
| `E7-T3` | Error state | 0.5h | E7-T1 | done |

### E7-T1 — Wire all in page.tsx

**Estimate:** 2h  
**Dependencies:** E2-T1, E4-T1, E4-T2, E5-T1, E5-T2, E6-T2  
**Description:** All state in page.tsx. Render DropZone → (if file) FormatSelector + QualitySlider + ImagePreview + CompressionStats + DownloadButton.

### E7-T2 — Empty state (no file selected)

**Estimate:** 0.5h  
**Dependencies:** E7-T1  
**Description:** Show placeholder text and DropZone cue when selectedFile is null.

### E7-T3 — Error state

**Estimate:** 0.5h  
**Dependencies:** E7-T1  
**Description:** Catch errors from compress.ts. Show inline error message. Allow retry by selecting new file.

## Epic: Quality

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E8-T1` | Responsive layout | 1h | E7-T1 | done |
| `E8-T2` | Lighthouse audit | 1h | E8-T1 | done |
| `E8-T3` | Cross-browser smoke test | 1h | E8-T1 | done |

### E8-T1 — Responsive layout

**Estimate:** 1h  
**Dependencies:** E7-T1  
**Description:** Mobile-first Tailwind classes. Desktop: 2-col preview. Mobile: stacked. Test at 375px and 1280px.

### E8-T2 — Lighthouse audit

**Estimate:** 1h  
**Dependencies:** E8-T1  
**Description:** Run Lighthouse in Chrome. Fix any score < 90. Common fixes: image alt text, font loading, meta description.

### E8-T3 — Cross-browser smoke test

**Estimate:** 1h  
**Dependencies:** E8-T1  
**Description:** Verify in Chrome, Firefox, Safari (macOS). Check: compression works, download works, no console errors.

## Epic: Deploy

| ID | Task | Est | Deps | Status |
|---|---|---|---|---|
| `E9-T1` | GitHub + Vercel deploy | 0.5h | E8-T2, E8-T3 | done |
| `E9-T2` | Production smoke test | 0.5h | E9-T1 | done |

### E9-T1 — GitHub + Vercel deploy

**Estimate:** 0.5h  
**Dependencies:** E8-T2, E8-T3  
**Description:** git push to main. Connect Vercel. Verify production URL returns 200.

### E9-T2 — Production smoke test

**Estimate:** 0.5h  
**Dependencies:** E9-T1  
**Description:** On production URL: upload real image, compress, download, verify file is smaller. Update STATUS.md.

---

## Completion Criteria

Sprint 1 is done when:
- All tasks above are `done`
- Production URL returns HTTP 200
- Lighthouse Performance ≥ 90
- At least one real image compressed and downloaded successfully

---

*Generated by DevOS Planner Agent v1 — 2026-07-06*
