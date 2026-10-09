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
    id: 'java-wt',
    title: 'Java and WT',
    subtitle: 'Practical Slips 1 to 29 • Java & Web Technology Programs',
    description:
      'Complete lab practical slips manual containing Java programs (Arrays, Armstrong numbers, File I/O with reverse/case conversion, OOP, Inheritance, Interfaces) and Web Technology exercises (HTML5/CSS3 Registration Forms, Image Gallery with hover, DOM manipulation, Arrow functions, and Node.js fs/path modules).',
    filePath: '/pdfs/java-wt.pdf',
    downloadFilename: 'Java-and-WT.pdf',
    badge: 'Java and WT',
    category: 'Practical Slips',
    pageCountText: '41 Pages • PDF',
    iconType: 'java',
    accentColor: '#2563eb',
    highlights: [
      'Slips 1 to 29 Practical Code',
      'Java File Handling & Inheritance',
      'HTML5/CSS3 Registration Forms',
      'Node.js Path & File Operations',
    ],
  },
  {
    id: 'f-java-wt',
    title: 'F Java WT',
    subtitle: 'Practical Exam Solutions & Ubuntu Step-by-Step Guide',
    description:
      'Detailed exam solutions with Ubuntu terminal commands (gedit, javac, java, firefox, node) for Slips 5 through 29 covering Java text file reversal, Account/Driver classes, CSS Grid responsive image galleries, JavaScript arrow functions, async/await login simulation, and Node.js file management.',
    filePath: '/pdfs/f-java-wt.pdf',
    downloadFilename: 'F-Java-WT.pdf',
    badge: 'F Java WT',
    category: 'Exam Solutions',
    pageCountText: '30 Pages • PDF',
    iconType: 'web',
    accentColor: '#059669',
    highlights: [
      'Ubuntu Execution Commands',
      'Slips 5 to 29 Full Solutions',
      'CSS Grid & DOM Manipulations',
      'Async/Await & Node.js Scripts',
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  // Support both new IDs and original routes for backwards compatibility
  if (id === 'java-practical') return DOCUMENTS[0];
  if (id === 'web-technology') return DOCUMENTS[1];
  return DOCUMENTS.find((doc) => doc.id === id);
}
