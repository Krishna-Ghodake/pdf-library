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
  iconType: 'terminal' | 'code' | 'java' | 'web';
  accentColor: string;
  highlights: string[];
}

export const DOCUMENTS: DocumentItem[] = [
  {
    id: 'os-practical-slips',
    title: 'Operating Systems Practical Slips',
    subtitle: 'Final Slips Selection: 1, 3, 4, 5, 9, 10, 11, 12, 13, 16, 20, 23, 25, 27, 28',
    description:
      'Complete Operating Systems (OS) lab manual in C covering Banker\'s Algorithm for Deadlock Avoidance, Custom Shell implementation with count and search commands, Disk Scheduling algorithms (SSTF, SCAN, LOOK), Page Replacement algorithms (FIFO, LRU, MFU), CPU Scheduling algorithms (Non-preemptive SJF, Round Robin, FCFS), and Process Management (fork, wait, orphan process).',
    filePath: '/pdfs/os-practical-slips.pdf',
    downloadFilename: 'OS-Practical-Slips.pdf',
    badge: 'OS Practical',
    category: 'Operating Systems',
    pageCountText: '76 Pages • PDF',
    iconType: 'terminal',
    accentColor: '#2563eb',
    highlights: [
      'Slips 1, 3, 4, 5, 9, 10, 11, 12, 13, 16, 20, 23, 25, 27, 28',
      'Banker\'s Deadlock Avoidance Algorithm',
      'Custom Unix Shell in C (fork, execvp, wait)',
      'Disk & CPU Scheduling + Page Replacement',
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  if (id === 'os-practical' || id === 'os-practical-slips') return DOCUMENTS[0];
  // Fallback to first document for any route
  return DOCUMENTS.find((doc) => doc.id === id) || DOCUMENTS[0];
}
