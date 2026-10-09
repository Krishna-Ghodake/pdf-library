'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentItem, DOCUMENTS } from '@/config/documents';
import { PdfPage } from './PdfPage';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  Search,
  X,
  ChevronUp,
  ChevronDown,
  Printer,
  FileText,
  AlertTriangle,
  RotateCcw,
  Scan,
} from 'lucide-react';

interface PdfViewerProps {
  documentItem: DocumentItem;
}

interface SearchMatch {
  pageNum: number;
  matchIndexOnPage: number;
  textSnippet: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ documentItem }) => {
  const router = useRouter();
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string>('1');
  const [scale, setScale] = useState<number>(1.15);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingMsg, setLoadingMsg] = useState<string>('Initializing PDF reader engine...');
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(-1);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const viewerRootRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageTextsRef = useRef<{ [page: number]: string }>({});

  // Auto-fit on mobile screens initially
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setScale(0.75);
    }
  }, []);

  // Initialize PDF.js and load document
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setPdfDoc(null);
    setCurrentPage(1);
    setInputPage('1');
    setSearchResults([]);
    setCurrentMatchIndex(-1);
    pageTextsRef.current = {};

    async function loadPdf() {
      try {
        setLoadingMsg('Loading PDF.js engine...');
        const lib = await import('pdfjs-dist');
        lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        if (!isMounted) return;
        setPdfjsLib(lib);

        setLoadingMsg(`Loading "${documentItem.title}"...`);
        const loadingTask = lib.getDocument({
          url: documentItem.filePath,
          cMapUrl: '/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: '/standard_fonts/',
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);

        // Pre-extract text from pages for instant search indexing
        indexDocumentText(doc);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        if (isMounted) {
          setIsLoading(false);
          const is404 =
            err?.status === 404 ||
            err?.message?.includes('Missing PDF') ||
            err?.name === 'MissingPDFException';

          if (is404) {
            setError(
              `The PDF document could not be found at "${documentItem.filePath}". Please ensure that the file exists in your "public/pdfs/" folder.`
            );
          } else {
            setError(
              err?.message ||
                `Failed to load PDF document from "${documentItem.filePath}". Please check the file format.`
            );
          }
        }
      }
    }

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, [documentItem]);

  // Index text for rapid search
  const indexDocumentText = async (doc: any) => {
    try {
      const pageCount = doc.numPages;
      const texts: { [page: number]: string } = {};

      for (let i = 1; i <= pageCount; i++) {
        const page = await doc.getPage(i);
        const textContent = await page.getTextContent();
        const pageStr = textContent.items.map((item: any) => item.str).join(' ');
        texts[i] = pageStr;
      }
      pageTextsRef.current = texts;
    } catch (e) {
      console.warn('Text indexing background notice:', e);
    }
  };

  // Perform search across indexed pages
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const matches: SearchMatch[] = [];

    setIsSearching(true);

    Object.entries(pageTextsRef.current).forEach(([pageNumStr, text]) => {
      const pageNum = parseInt(pageNumStr, 10);
      const textLower = text.toLowerCase();
      let matchIdxOnPage = 0;
      let pos = textLower.indexOf(query);

      while (pos !== -1) {
        const start = Math.max(0, pos - 20);
        const end = Math.min(text.length, pos + query.length + 20);
        const snippet = text.substring(start, end);

        matches.push({
          pageNum,
          matchIndexOnPage: matchIdxOnPage,
          textSnippet: snippet,
        });

        matchIdxOnPage++;
        pos = textLower.indexOf(query, pos + query.length);
      }
    });

    setSearchResults(matches);
    setIsSearching(false);

    if (matches.length > 0) {
      setCurrentMatchIndex(0);
      scrollToPage(matches[0].pageNum);
    } else {
      setCurrentMatchIndex(-1);
    }
  }, [searchQuery]);

  // Jump to next search match
  const handleNextMatch = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % searchResults.length;
    setCurrentMatchIndex(nextIdx);
    scrollToPage(searchResults[nextIdx].pageNum);
  };

  // Jump to previous search match
  const handlePrevMatch = () => {
    if (searchResults.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + searchResults.length) % searchResults.length;
    setCurrentMatchIndex(prevIdx);
    scrollToPage(searchResults[prevIdx].pageNum);
  };

  // Scroll smoothly to a specific page
  const scrollToPage = (pageNum: number) => {
    const target = document.getElementById(`pdf-page-${pageNum}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNum);
      setInputPage(String(pageNum));
    }
  };

  // Page input jump
  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputPage, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      scrollToPage(parsed);
    } else {
      setInputPage(String(currentPage));
    }
  };

  // Page visible callback from IntersectionObserver
  const handlePageVisible = useCallback((pageNum: number) => {
    setCurrentPage(pageNum);
    setInputPage(String(pageNum));
  }, []);

  // Zoom controls
  const handleZoomIn = () => setScale((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setScale((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
  const handleZoomReset = () => setScale(1.0);

  const handleFitToWidth = () => {
    if (!scrollContainerRef.current) return;
    const containerWidth = scrollContainerRef.current.clientWidth - 48; // padding
    const standardPageWidth = 595.28; // standard A4 pt
    const calculatedScale = +(containerWidth / standardPageWidth).toFixed(2);
    setScale(Math.max(0.5, Math.min(2.0, calculatedScale)));
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRootRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Download PDF
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentItem.filePath;
    link.download = documentItem.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF
  const handlePrint = () => {
    window.print();
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut if user is typing in an input
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.tagName === 'SELECT';

      if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          setSearchQuery('');
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }

      if (isInput) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentPage < numPages) scrollToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentPage > 1) scrollToPage(currentPage - 1);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        handleZoomReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages, isSearchOpen]);

  const activeMatch = searchResults[currentMatchIndex] || null;

  return (
    <div ref={viewerRootRef} className="pdf-viewer-root">
      {/* Top Main Toolbar */}
      <header className="pdf-toolbar">
        {/* Left Section: Back, Doc Switcher, Title */}
        <div className="pdf-toolbar-left">
          <Link
            href="/"
            className="toolbar-btn"
            title="Return to PDF Library"
            aria-label="Back to Library"
          >
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Library</span>
          </Link>

          {/* Quick Switcher Dropdown */}
          <select
            className="doc-switcher-select"
            value={documentItem.id}
            onChange={(e) => router.push(`/viewer/${e.target.value}`)}
            aria-label="Switch Document"
          >
            {DOCUMENTS.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>

          <span className="toolbar-doc-badge hide-on-mobile">{documentItem.badge}</span>
        </div>

        {/* Center Section: Page Jump Navigation */}
        <div className="pdf-toolbar-center">
          <button
            className="toolbar-btn icon-only"
            onClick={() => scrollToPage(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            title="Previous Page (Left Arrow)"
            aria-label="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <form onSubmit={handlePageInputSubmit} className="page-input-wrapper">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onBlur={() => setInputPage(String(currentPage))}
              className="page-input"
              aria-label="Current page number"
            />
            <span>of {numPages || '–'}</span>
          </form>

          <button
            className="toolbar-btn icon-only"
            onClick={() => scrollToPage(currentPage + 1)}
            disabled={currentPage >= numPages || isLoading}
            title="Next Page (Right Arrow)"
            aria-label="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Right Section: Zoom, Search, Fullscreen, Download */}
        <div className="pdf-toolbar-right">
          {/* Zoom Controls */}
          <div className="pdf-toolbar-section hide-on-mobile">
            <button
              className="toolbar-btn icon-only"
              onClick={handleZoomOut}
              disabled={scale <= 0.5 || isLoading}
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              className="toolbar-btn"
              onClick={handleFitToWidth}
              title="Fit to Width"
              aria-label="Fit to Width"
              style={{ minWidth: '58px' }}
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              className="toolbar-btn icon-only"
              onClick={handleZoomIn}
              disabled={scale >= 2.5 || isLoading}
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              className="toolbar-btn icon-only"
              onClick={handleFitToWidth}
              title="Fit to Page Width"
              aria-label="Fit to Page Width"
            >
              <Scan size={16} />
            </button>
          </div>

          {/* Search Toggle */}
          <button
            className={`toolbar-btn icon-only ${isSearchOpen ? 'active' : ''}`}
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              if (!isSearchOpen) {
                setTimeout(() => searchInputRef.current?.focus(), 50);
              }
            }}
            title="Search within document (Cmd+F / Ctrl+F)"
            aria-label="Search within document"
          >
            <Search size={16} />
          </button>

          {/* Print Button */}
          <button
            className="toolbar-btn icon-only hide-on-mobile"
            onClick={handlePrint}
            title="Print Document"
            aria-label="Print Document"
          >
            <Printer size={16} />
          </button>

          {/* Fullscreen */}
          <button
            className="toolbar-btn icon-only hide-on-mobile"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Reading Mode'}
            aria-label="Toggle Full Screen"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>

          {/* Download Original PDF */}
          <button
            className="toolbar-btn primary"
            onClick={handleDownload}
            title={`Download ${documentItem.downloadFilename}`}
            aria-label="Download PDF"
          >
            <Download size={15} />
            <span className="hide-on-mobile">Download</span>
          </button>
        </div>
      </header>

      {/* Floating Sub-Toolbar: Search Bar */}
      {isSearchOpen && (
        <div className="pdf-search-bar">
          <div className="pdf-search-input-wrap">
            <Search size={14} className="pdf-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Find in document... (Enter for next match)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) handlePrevMatch();
                  else handleNextMatch();
                }
              }}
              className="pdf-search-input"
              aria-label="Search text"
            />
          </div>

          <span className="search-matches-count">
            {searchQuery.trim().length === 0
              ? ''
              : searchResults.length > 0
              ? `${currentMatchIndex + 1} of ${searchResults.length}`
              : 'No matches'}
          </span>

          <button
            className="toolbar-btn icon-only"
            onClick={handlePrevMatch}
            disabled={searchResults.length === 0}
            title="Previous match (Shift+Enter)"
            aria-label="Previous match"
          >
            <ChevronUp size={16} />
          </button>

          <button
            className="toolbar-btn icon-only"
            onClick={handleNextMatch}
            disabled={searchResults.length === 0}
            title="Next match (Enter)"
            aria-label="Next match"
          >
            <ChevronDown size={16} />
          </button>

          <button
            className="toolbar-btn icon-only"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
            title="Close search (Esc)"
            aria-label="Close search"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Scrollable Document Container */}
      <main ref={scrollContainerRef} className="pdf-scroll-container">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="pdf-loading-container">
            <div className="loading-spinner" />
            <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>
              {loadingMsg}
            </p>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="pdf-error-container">
            <div className="pdf-error-card">
              <AlertTriangle
                size={40}
                color="#dc2626"
                style={{ marginBottom: '1rem', display: 'inline-block' }}
              />
              <h2 className="pdf-error-title">Document Not Found</h2>
              <p className="pdf-error-desc">{error}</p>
              <div className="pdf-error-path">Expected location: public{documentItem.filePath}</div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                To fix this, save your PDF file into the project directory at{' '}
                <strong>public{documentItem.filePath}</strong> and refresh this page.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Link href="/" className="btn btn-secondary">
                  ← Back to Library
                </Link>
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Document Pages Rendering */}
        {!isLoading &&
          !error &&
          pdfDoc &&
          Array.from({ length: numPages }, (_, index) => {
            const pageNum = index + 1;
            return (
              <PdfPage
                key={`${documentItem.id}-page-${pageNum}`}
                pdfDoc={pdfDoc}
                pageNum={pageNum}
                scale={scale}
                searchQuery={searchQuery}
                activeMatchPage={activeMatch ? activeMatch.pageNum : null}
                activeMatchIndexOnPage={activeMatch ? activeMatch.matchIndexOnPage : null}
                onVisible={handlePageVisible}
                pdfjsLib={pdfjsLib}
              />
            );
          })}
      </main>
    </div>
  );
};

export default PdfViewer;
