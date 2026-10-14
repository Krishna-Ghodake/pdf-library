import { Metadata } from 'next';
import { DOCUMENTS } from '@/config/documents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DocumentCard from '@/components/DocumentCard';

export const metadata: Metadata = {
  title: 'PDF Library — Fast Document Viewer',
  description:
    'Fast, minimalist PDF library for Data Science practical programs and solutions. View, search, zoom, and download PDF files directly in your browser.',
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
          {/* Responsive Document Cards */}
          <div className="docs-grid">
            {DOCUMENTS.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
