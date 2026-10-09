# PDF Library — Fast, Minimalist In-Browser Document Viewer

A production-ready, responsive PDF document library built with **Next.js (App Router)**, **TypeScript**, and **PDF.js (`pdfjs-dist`)**, designed specifically for fast reference during practical lab exams.

Hosted on Vercel with a single public URL (e.g. `your-pdf-library.vercel.app`), this application enables users to view multi-page PDFs directly in the browser, zoom in/out, fit to width, search with highlighted results, select and copy text via the native PDF.js text layer, jump to any page, and download the original PDF files.

---

## 📁 Installed PDF Documents

Both of your actual PDF files are integrated directly into the `public/pdfs/` directory:

| Document | Location | File Name | Details |
| :--- | :--- | :--- | :--- |
| **PDF 1 — Java and WT** | `public/pdfs/` | `java-wt.pdf` | **41 Pages** • Slips 1 through 29 (Java & Web Technology) |
| **PDF 2 — F Java WT** | `public/pdfs/` | `f-java-wt.pdf` | **30 Pages** • Practical Exam Solutions & Ubuntu execution steps |

```text
Pdf viewer/
├── public/
│   ├── pdfs/
│   │   ├── java-wt.pdf              <-- Java and WT (41 Pages)
│   │   └── f-java-wt.pdf            <-- F Java WT (30 Pages)
│   ├── pdf.worker.min.mjs           <-- PDF.js Web Worker (configured)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx                 <-- Homepage with cards
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

> **Note:** Both PDFs are fully installed and configured. Backward-compatible aliases (`java-practical.pdf` and `web-technology.pdf`) are also preserved.

---

## ✏️ How to Change Document Titles and Descriptions

All document titles, subtitles, descriptions, badges, tags, and download filenames are centrally defined in **`src/config/documents.ts`**.

To customize how documents are displayed:

1. Open [`src/config/documents.ts`](file:///Users/krishna_ghodake_018/Development/Pdf%20viewer/src/config/documents.ts).
2. Edit any of the fields:

```typescript
export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'java-practical',
    title: 'Java Practical Programs',                     // Display Title
    subtitle: 'Core Java, Concurrency & Networking Lab',   // Subtitle
    description: 'Complete lab manual covering...',       // Description
    filePath: '/pdfs/java-practical.pdf',                // Path in /public
    downloadFilename: 'Java-Practical-Programs.pdf',     // Download filename
    badge: 'Core Java',                                   // Badge text
    category: 'Backend & Systems',
    pageCountText: '5 Pages • PDF',
    // ...
  },
  // Repeat for 'web-technology' or add new documents
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

- [x] **Homepage Loads:** Displays "PDF Library" header, subtitle, and cards for both documents.
- [x] **Document 1 (Java):** Opens `/viewer/java-practical`, renders pages, supports zoom, text selection, and search.
- [x] **Document 2 (Web Tech):** Opens `/viewer/web-technology`, renders pages, supports zoom, text selection, and search.
- [x] **Text Selection:** Users can drag-select text on any page and copy it with `Cmd+C` / `Ctrl+C`.
- [x] **Search Works:** Search toolbar displays match count and highlights matching terms on the document.
- [x] **Downloads:** Clicking "Download PDF" from either the homepage or viewer initiates download of the original `.pdf` file.
- [x] **Page Jump:** Typing a page number and pressing Enter scrolls directly to that page.
- [x] **Document Switcher:** Dropdown in reader header switches between documents instantly.
- [x] **Responsive Mobile Layout:** Clean layout on phones, tablets, and desktops.
- [x] **Missing PDF Resilience:** Shows informative guide card if a file cannot be loaded.
