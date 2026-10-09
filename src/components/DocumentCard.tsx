'use client';

import React from 'react';
import Link from 'next/link';
import { DocumentItem } from '@/config/documents';
import { Eye, Download, Code2, Globe, FileCheck, Sparkles } from 'lucide-react';

interface DocumentCardProps {
  doc: DocumentItem;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = doc.filePath;
    link.download = doc.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <article className="doc-card" id={`card-${doc.id}`}>
      {/* Card Header with Icon & Badges */}
      <div className="card-top">
        <div className={`card-icon-box ${doc.iconType}`}>
          {doc.iconType === 'java' ? <Code2 size={24} /> : <Globe size={24} />}
        </div>
        <div className="badge-row">
          <span className={`card-badge ${doc.iconType === 'java' ? 'blue' : 'green'}`}>
            {doc.badge}
          </span>
          <span className="card-badge neutral">{doc.pageCountText || 'PDF'}</span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h2 className="card-title">{doc.title}</h2>
      <p className="card-subtitle">{doc.subtitle}</p>

      {/* Description */}
      <p className="card-desc">{doc.description}</p>

      {/* Program Highlights */}
      {doc.highlights && doc.highlights.length > 0 && (
        <div className="highlights-list">
          {doc.highlights.map((highlight, idx) => (
            <span key={idx} className="highlight-pill">
              {highlight}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons: View PDF & Download PDF */}
      <div className="card-actions">
        <Link href={`/viewer/${doc.id}`} className="btn btn-primary" title={`View ${doc.title}`}>
          <Eye size={16} />
          View PDF
        </Link>
        <button
          onClick={handleDownload}
          className="btn btn-secondary"
          title={`Download ${doc.downloadFilename}`}
          aria-label={`Download ${doc.downloadFilename}`}
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>
    </article>
  );
};

export default DocumentCard;
