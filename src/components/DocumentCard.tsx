'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DocumentItem } from '@/config/documents';
import { Eye, Download, Code2, Globe } from 'lucide-react';

interface DocumentCardProps {
  doc: DocumentItem;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc }) => {
  const router = useRouter();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = doc.filePath;
    link.download = doc.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCardClick = () => {
    router.push(`/viewer/${doc.id}`);
  };

  return (
    <article
      className="doc-card clean-card"
      id={`card-${doc.id}`}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Card Header with Icon & Page Count Badge */}
      <div className="card-top">
        <div className={`card-icon-box ${doc.iconType}`}>
          {doc.iconType === 'java' ? <Code2 size={26} /> : <Globe size={26} />}
        </div>
        <div className="badge-row">
          <span className="card-badge neutral">{doc.pageCountText || 'PDF'}</span>
        </div>
      </div>

      {/* Main Document Title */}
      <h2 className="card-title" style={{ fontSize: '1.45rem', marginBottom: '1.25rem' }}>
        {doc.title}
      </h2>

      {/* Action Buttons: View PDF & Download PDF */}
      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
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
