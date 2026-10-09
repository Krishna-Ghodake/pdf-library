'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PdfPageProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
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
  const renderTaskRef = useRef<any>(null);

  // IntersectionObserver to signal visibility for page tracking & rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            onVisible(pageNum);
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNum, onVisible]);

  // Page Rendering (Canvas + TextLayer)
  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!pdfDoc || !pdfjsLib || !canvasRef.current || !textLayerRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        setDimensions({ width: viewport.width, height: viewport.height });

        // Cancel previous render if any
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore cancel error
          }
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const outputScale = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

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

        // Render Text Layer
        const textLayerDiv = textLayerRef.current;
        textLayerDiv.innerHTML = '';
        textLayerDiv.style.width = `${Math.floor(viewport.width)}px`;
        textLayerDiv.style.height = `${Math.floor(viewport.height)}px`;

        const textContent = await page.getTextContent();
        if (isCancelled) return;

        const textLayer = new pdfjsLib.TextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: viewport,
        });

        await textLayer.render();
        setIsRendered(true);

        // Apply search highlights if search query is active
        applyHighlights();
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
  }, [pdfDoc, pageNum, scale, pdfjsLib]);

  // Apply search highlighting inside textLayer spans
  const applyHighlights = () => {
    if (!textLayerRef.current) return;
    const spans = textLayerRef.current.querySelectorAll('span');

    if (!searchQuery || searchQuery.trim().length === 0) {
      // Clear highlights if query is empty
      spans.forEach((span) => {
        if (span.getAttribute('data-original-text')) {
          span.textContent = span.getAttribute('data-original-text') || '';
          span.removeAttribute('data-original-text');
        }
      });
      return;
    }

    const query = searchQuery.trim();
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
      } else {
        span.textContent = orig;
      }
    });
  };

  // Re-apply highlights whenever search query or active match changes
  useEffect(() => {
    if (isRendered) {
      applyHighlights();
    }
  }, [searchQuery, activeMatchPage, activeMatchIndexOnPage, isRendered]);

  return (
    <div
      ref={containerRef}
      id={`pdf-page-${pageNum}`}
      data-page-num={pageNum}
      className="pdf-page-wrapper"
      style={{
        width: dimensions ? dimensions.width : 595 * scale,
        minHeight: dimensions ? dimensions.height : 842 * scale,
      }}
    >
      <canvas ref={canvasRef} className="pdf-canvas" />
      <div ref={textLayerRef} className="textLayer" />
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
