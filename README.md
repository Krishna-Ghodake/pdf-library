# PDF Library — Fast, Minimalist In-Browser Document Viewer

A production-ready, responsive PDF document library built with **Next.js (App Router)**, **TypeScript**, and **PDF.js (`pdfjs-dist`)**, designed specifically for fast reference during practical lab exams.

Hosted on Vercel with a single public URL (e.g. `your-pdf-library.vercel.app`), this application enables users to view multi-page PDFs directly in the browser, zoom in/out, fit to width, search with highlighted results, select and copy text via the native PDF.js text layer, jump to any page, and download the original PDF files.

---

## 📁 Installed PDF Documents

The Operating Systems Practical Slips PDF document is installed in `public/pdfs/`:

| Document | Location | File Name | Details |
| :--- | :--- | :--- | :--- |
| **Operating Systems Practical Slips** | `public/pdfs/` | `os-practical-slips.pdf` | **76 Pages** • Slips 1, 3, 4, 5, 9, 10, 11, 12, 13, 16, 20, 23, 25, 27, 28 (C programs) |

```text
Pdf viewer/
├── public/
│   ├── pdfs/
│   │   ├── os-practical-slips.pdf   <-- Operating Systems Practical Slips (76 Pages)
│   │   └── os-practical.pdf         <-- Friendly alias
│   ├── pdf.worker.min.mjs           <-- PDF.js Web Worker (configured)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx                 <-- Homepage with card
│   │   └── viewer/[id]/page.tsx     <-- Fullscreen reader
│   ├── components/
│   │   ├── DocumentCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PdfPage.tsx              <-- Lazy Canvas + TextLayer renderer
│   │   └── PdfViewer.tsx            <-- Toolbar, Zoom, Search, Navigation
│   └── config/
│       └── documents.ts             <-- Titles, descriptions & metadata
├── package.json
└── README.md
```

> **Note:** Backward-compatible aliases (`os-practical`) are preserved in routing and documents config.

---

## ✏️ How to Change Document Titles and Descriptions

All document titles, subtitles, descriptions, badges, tags, and download filenames are centrally defined in **`src/config/documents.ts`**.

To customize how documents are displayed:

1. Open [`src/config/documents.ts`](file:///Users/krishna_ghodake_018/Development/Pdf%20viewer/src/config/documents.ts).
2. Edit any of the fields:

```typescript
export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'os-practical-slips',
    title: 'Operating Systems Practical Slips',           // Display Title
    subtitle: 'Final Slips Selection: 1, 3, 4, 5...',     // Subtitle
    description: 'Complete lab manual covering...',       // Description
    filePath: '/pdfs/os-practical-slips.pdf',             // Path in /public
    downloadFilename: 'OS-Practical-Slips.pdf',           // Download filename
    badge: 'OS Practical',                                // Badge text
    category: 'Operating Systems',
    pageCountText: '76 Pages • PDF',
    // ...
  },
];
```

---

## 🚀 Running the Website Locally

### 1. Install dependencies:
```bash
npm install
```

### 2. Start the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Build and test the production bundle:
```bash
npm run build
npm run start
```

---

## 🛠 Features Included

- **Native PDF.js Rendering:** Uses `pdfjs-dist` to render crisp vector graphics using HTML5 Canvas with device pixel ratio scaling for Retina and 4K displays.
- **Selectable & Copyable Text:** Text layer positioned over each page enables highlighting and copying actual PDF text directly to clipboard (`Cmd+C` / `Ctrl+C`).
- **Interactive Find/Search:** Search across all pages with total match counter (`Match X of Y`), previous/next navigation buttons, and yellow/orange highlights.
- **Zoom & Fit-to-Width:** Zoom In, Zoom Out, Fit-to-Width, and Reset Zoom controls.
- **Direct Page Jump:** Smooth vertical continuous scrolling with a direct page jump number input (`Page [ 3 ] of 5`) and next/previous page buttons.
- **Quick Document Switcher:** Switch between documents directly from the viewer toolbar.
- **Direct PDF Downloads:** Clean downloads with custom filenames (e.g. `Java-Practical-Programs.pdf`) from both homepage and viewer.
- **Full Screen Reading Mode:** Distraction-free exam reading mode.
- **Keyboard Shortcuts:**
  - `ArrowLeft` / `ArrowRight`: Previous / Next Page
  - `+` / `-`: Zoom In / Zoom Out
  - `0`: Reset Zoom
  - `Cmd+F` or `Ctrl+F`: Open Search
  - `Esc`: Close Search / Exit Fullscreen
- **Graceful Error Handling:** If a PDF file is missing, displays a helpful card explaining where to place the file rather than a blank or broken page.

---

## 🚢 Pushing to GitHub

To put your project on GitHub:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Complete PDF Library website ready for Vercel deployment"

# 4. Create a repository on GitHub (e.g. https://github.com/your-username/pdf-library)

# 5. Link and push to GitHub:
git branch -M main
git remote add origin https://github.com/your-username/pdf-library.git
git push -u origin main
```

---

## 🌐 Step-by-Step Vercel Deployment

Once pushed to GitHub, deploying to Vercel takes less than 2 minutes and runs 24/7 independently of your computer:

1. Go to **[https://vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository (`pdf-library`).
4. Keep the default settings:
   - **Framework Preset:** Next.js (automatically detected)
   - **Root Directory:** `./`
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
5. Click **"Deploy"**.
6. In ~45 seconds, your site will be live at a public URL:
   `https://<your-project-name>.vercel.app`

---

## ✅ Deployment & Verification Checklist

- [x] **Homepage Loads:** Displays "PDF Library" header, subtitle, and card for the Operating Systems Practical Slips.
- [x] **Document (OS Slips):** Opens `/viewer/os-practical-slips` (and alias `/viewer/os-practical`), renders 76 pages smoothly, supports zoom, text selection, and search.
- [x] **Text Selection:** Users can drag-select text on any page and copy it with `Cmd+C` / `Ctrl+C`.
- [x] **Search Works:** Search toolbar indexes all 76 pages, displays match count, and jumps to highlighted matching terms.
- [x] **Downloads:** Clicking "Download PDF" from either the homepage or viewer initiates download of `OS-Practical-Slips.pdf`.
- [x] **Page Jump:** Typing a page number and pressing Enter scrolls directly to that page.
- [x] **Responsive Mobile Layout:** Clean layout on phones, tablets, and desktops.
- [x] **Missing PDF Resilience:** Shows informative guide card if a file cannot be loaded.
