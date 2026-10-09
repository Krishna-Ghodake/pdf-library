export interface DocumentItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  filePath: string;
  downloadFilename: string;
  badge: string;
  category: string;
  pageCountText?: string;
  iconType: 'java' | 'web';
  accentColor: string;
  highlights: string[];
}

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'java-practical',
    title: 'Java Practical Programs',
    subtitle: 'Core Java, Concurrency & Networking Lab Manual',
    description:
      'Complete lab manual and reference implementations covering multithreading synchronization, client-server socket communication, JDBC database transactions, Collections framework, and Stream API pipelines.',
    filePath: '/pdfs/java-practical.pdf',
    downloadFilename: 'Java-Practical-Programs.pdf',
    badge: 'Core Java',
    category: 'Backend & Systems',
    pageCountText: '5 Pages • PDF',
    iconType: 'java',
    accentColor: '#3b82f6',
    highlights: [
      'Producer-Consumer Multithreading',
      'TCP/IP Echo Socket Server',
      'JDBC Database CRUD Operations',
      'Stream API & Lambda Expressions',
    ],
  },
  {
    id: 'web-technology',
    title: 'Web Technology Practical Programs',
    subtitle: 'HTML5, Modern CSS & Asynchronous JavaScript',
    description:
      'Comprehensive practical lab guide demonstrating responsive multi-column layouts using CSS Grid and Flexbox, real-time client-side form validation, RESTful API data fetching with error handling, and persistent storage caching.',
    filePath: '/pdfs/web-technology.pdf',
    downloadFilename: 'Web-Technology-Practical-Programs.pdf',
    badge: 'Web Tech',
    category: 'Frontend & Full-Stack',
    pageCountText: '5 Pages • PDF',
    iconType: 'web',
    accentColor: '#0ea5e9',
    highlights: [
      'Fluid CSS Grid & Flexbox Layouts',
      'Event-Driven Form Validation',
      'Async Fetch API with Retry Logic',
      'LocalStorage Session Caching',
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  return DOCUMENTS.find((doc) => doc.id === id);
}
