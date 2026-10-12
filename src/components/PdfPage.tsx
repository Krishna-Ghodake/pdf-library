'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PdfPageProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  basePageSize?: { width: number; height: number };
  searchQuery: string;
  activeMatchPage: number | null;
  activeMatchIndexOnPage: number | null;
  onVisible: (pageNum: number) => void;
  pdfjsLib: any;
}

export const PdfPage: React.FC<PdfPageProps> = ({
  pdfDoc,
  pageNum,
  scale,
  basePageSize,
  searchQuery,
  activeMatchPage,
  activeMatchIndexOnPage,
  onVisible,
  pdfjsLib,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState<boolean>(pageNum <= 2);
  const renderTaskRef = useRef<any>(null);
  const textContentCacheRef = useRef<any>(null);
  const viewportRef = useRef<any>(null);

  // If this page is the active search match, force it to render immediately
  useEffect(() => {
    if (activeMatchPage === pageNum) {
      setIsNearViewport(true);
    }
  }, [activeMatchPage, pageNum]);

  // IntersectionObserver for lazy rendering and current page tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
          }
        });
      },
      { rootMargin: '1200px 0px 1200px 0px' }
    );

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            onVisible(pageNum);
          }
        });
      },
      { threshold: [0.35, 0.7] }
    );

    lazyObserver.observe(el);
    visibilityObserver.observe(el);

    return () => {
      lazyObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [pageNum, onVisible]);

  // Method to render TextLayer cleanly
  const renderTextLayer = useCallback(
    async (textContent: any, viewport: any) => {
      const textLayerDiv = textLayerRef.current;
      if (!textLayerDiv || !pdfjsLib) return;

      textLayerDiv.innerHTML = '';
      textLayerDiv.style.width = `${Math.floor(viewport.width)}px`;
      textLayerDiv.style.height = `${Math.floor(viewport.height)}px`;
      textLayerDiv.style.setProperty('--scale-factor', `${viewport.scale}`);

      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport: viewport,
      });

      await textLayer.render();

      // Append endOfContent helper for smooth selection boundaries
      const endOfContent = document.createElement('div');
      endOfContent.className = 'endOfContent';
      textLayerDiv.appendChild(endOfContent);

      setIsRendered(true);
    },
    [pdfjsLib]
  );

  // Page Rendering (Canvas + TextLayer)
  useEffect(() => {
    if (!isNearViewport) return;

    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc || !pdfjsLib || !canvasRef.current || !textLayerRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        viewportRef.current = viewport;
        setDimensions({ width: viewport.width, height: viewport.height });

        if (containerRef.current) {
          containerRef.current.style.setProperty('--scale-factor', `${viewport.scale}`);
        }

        // Cancel previous canvas render task if active
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore
          }
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const outputScale = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
          canvasContext: ctx,
          transform: transform,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;

        if (isCancelled) return;

        // Fetch text content and render text layer
        const textContent = await page.getTextContent();
        textContentCacheRef.current = textContent;
        if (isCancelled) return;

        await renderTextLayer(textContent, viewport);
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error(`Error rendering page ${pageNum}:`, err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfDoc, pageNum, scale, pdfjsLib, isNearViewport, renderTextLayer]);

  // Apply search highlighting ONLY when a query exists; re-render clean textLayer when cleared
  useEffect(() => {
    if (!isRendered || !textLayerRef.current) return;

    const query = searchQuery ? searchQuery.trim() : '';

    if (!query) {
      // If search query is cleared, ensure text layer spans are restored cleanly
      if (textContentCacheRef.current && viewportRef.current) {
        const hasMarks = textLayerRef.current.querySelector('mark');
        if (hasMarks) {
          renderTextLayer(textContentCacheRef.current, viewportRef.current);
        }
      }
      return;
    }

    // Highlight search query
    const spans = textLayerRef.current.querySelectorAll('span');
    const queryLower = query.toLowerCase();
    let matchIdxCounter = 0;

    spans.forEach((span) => {
      let orig = span.getAttribute('data-original-text');
      if (!orig) {
        orig = span.textContent || '';
        span.setAttribute('data-original-text', orig);
      }

      const origLower = orig.toLowerCase();
      if (origLower.includes(queryLower)) {
        let html = '';
        let lastIndex = 0;
        let index = origLower.indexOf(queryLower, lastIndex);

        while (index !== -1) {
          html += escapeHtml(orig.substring(lastIndex, index));
          const matchText = orig.substring(index, index + query.length);
          const isCurrentActive =
            activeMatchPage === pageNum && activeMatchIndexOnPage === matchIdxCounter;

          html += `<mark class="search-highlight ${
            isCurrentActive ? 'active-match' : ''
          }">${escapeHtml(matchText)}</mark>`;

          matchIdxCounter++;
          lastIndex = index + query.length;
          index = origLower.indexOf(queryLower, lastIndex);
        }

        html += escapeHtml(orig.substring(lastIndex));
        span.innerHTML = html;
      }
    });
  }, [searchQuery, activeMatchPage, activeMatchIndexOnPage, isRendered, renderTextLayer]);

  const defaultWidth = (basePageSize?.width || 612) * scale;
  const defaultHeight = (basePageSize?.height || 792) * scale;
  const containerWidth = dimensions ? dimensions.width : defaultWidth;
  const containerHeight = dimensions ? dimensions.height : defaultHeight;

  return (
    <div
      ref={containerRef}
      id={`pdf-page-${pageNum}`}
      data-page-num={pageNum}
      className={`pdf-page-wrapper ${!isNearViewport ? 'placeholder' : ''}`}
      style={{
        width: Math.floor(containerWidth),
        minHeight: Math.floor(containerHeight),
        height: Math.floor(containerHeight),
      }}
    >
      {isNearViewport ? (
        <>
          <canvas ref={canvasRef} className="pdf-canvas" />
          <div ref={textLayerRef} className="textLayer" />
        </>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#94a3b8',
            fontSize: '0.85rem',
          }}
        >
          Page {pageNum}
        </div>
      )}
      <div className="pdf-page-number-tag">Page {pageNum}</div>
    </div>
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
