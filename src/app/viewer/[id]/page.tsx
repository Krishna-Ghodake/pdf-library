import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDocumentById, DOCUMENTS } from '@/config/documents';
import PdfViewer from '@/components/PdfViewer';

interface ViewerPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DOCUMENTS.map((doc) => ({
    id: doc.id,
  }));
}

export async function generateMetadata({ params }: ViewerPageProps): Promise<Metadata> {
  const { id } = await params;
  const doc = getDocumentById(id);

  if (!doc) {
    return {
      title: 'Document Not Found — PDF Library',
      description: 'The requested PDF document was not found.',
    };
  }

  return {
    title: `${doc.title} — PDF Library`,
    description: doc.description,
  };
}

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { id } = await params;
  const doc = getDocumentById(id);

  if (!doc) {
    notFound();
  }

  return <PdfViewer documentItem={doc} />;
}
