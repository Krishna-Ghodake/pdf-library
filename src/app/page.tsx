import { Metadata } from 'next';
import { DOCUMENTS } from '@/config/documents';
import PdfViewer from '@/components/PdfViewer';

export const metadata: Metadata = {
  title: 'Artificial Intelligence Practical Slips — Fast PDF Reader',
  description:
    'Complete Artificial Intelligence (AI) practical solutions in Python. View, search, zoom, and download PDF files directly in your browser.',
};

export default function HomePage() {
  const currentDoc = DOCUMENTS[0];
  return <PdfViewer documentItem={currentDoc} />;
}
