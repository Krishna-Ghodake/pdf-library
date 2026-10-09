import { Metadata } from 'next';
import { DOCUMENTS } from '@/config/documents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentCard from '@/components/DocumentCard';
import { FileText, FolderCheck, Sparkles, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF Library — Practical Reference Documents',
  description:
    'Fast, minimalist PDF library for Java Practical Programs and Web Technology Practical Programs. View, search, zoom, and download PDF lab manuals directly in your browser.',
};

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: '1 0 auto' }}>
        <section className="container hero-section">
          <h1 className="hero-title">PDF Library</h1>
          <p className="hero-subtitle">Your practical reference documents, all in one place.</p>
        </section>

        <section className="container">
          {/* Responsive Grid of Document Cards */}
          <div className="docs-grid">
            {DOCUMENTS.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>

          {/* Quick PDF Placement & Configuration Guide Card */}
          <div className="info-box">
            <div className="info-box-header">
              <FolderCheck size={18} color="#2563eb" />
              <h3 className="info-box-title">Document Setup & Customization Guide</h3>
            </div>
            <div className="info-box-body">
              <p style={{ marginBottom: '0.6rem' }}>
                Both documents are served locally from your project repository. To replace the
                current sample documents with your actual lab PDFs:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
                <li style={{ marginBottom: '0.35rem' }}>
                  <strong>PDF 1 (Java):</strong> Save your PDF file as{' '}
                  <span className="info-code">public/pdfs/java-practical.pdf</span>
                </li>
                <li style={{ marginBottom: '0.35rem' }}>
                  <strong>PDF 2 (Web Tech):</strong> Save your PDF file as{' '}
                  <span className="info-code">public/pdfs/web-technology.pdf</span>
                </li>
              </ul>
              <p>
                To customize document titles, descriptions, badges, or tags, simply edit{' '}
                <span className="info-code">src/config/documents.ts</span>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
