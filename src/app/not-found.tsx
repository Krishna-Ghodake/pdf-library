import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <BookOpen size={28} />
      </div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '0.5rem',
        }}
      >
        Document Not Found
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: '#64748b',
          maxWidth: '460px',
          lineHeight: 1.5,
          marginBottom: '1.75rem',
        }}
      >
        The PDF document you requested is not available in the library. Please return to the homepage to select from available documents.
      </p>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft size={16} />
        Return to PDF Library
      </Link>
    </div>
  );
}
