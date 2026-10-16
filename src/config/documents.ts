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
    id: 'ai-practical-slips',
    title: 'Artificial Intelligence Practical Slips',
    subtitle: 'Python Lab Programs • Slips 1, 2, 3, 4, 7, 8, 9, 14, 15, 16, 17, 21, 22, 23, 25',
    description:
      'Complete Artificial Intelligence (AI) practical solutions in Python covering BFS (Monkey Banana, Water Jug, Graph traversal), A* Search (Shortest Path, 4-Puzzle), AO* Algorithm, Minimax & Alpha-Beta Pruning, Map Coloring (CSP Backtracking), N-Queens Problem, Hill Climbing, Propositional & Predicate Logic, Forward & Backward Chaining Inference, Expert Systems, Naive Bayes, Decision Trees, and K-Means Clustering.',
    filePath: '/pdfs/ai-practical-slips.pdf',
    downloadFilename: 'AI-Practical-Slips.pdf',
    badge: 'AI Practical',
    category: 'Artificial Intelligence',
    pageCountText: '29 Pages • PDF',
    iconType: 'code',
    accentColor: '#2563eb',
    highlights: [
      'Slips 1, 2, 3, 4, 7, 8, 9, 14, 15, 16, 17, 21, 22, 23, 25',
      'Search: BFS, A*, AO*, IDS, Hill Climbing',
      'Game Playing: Minimax & Alpha-Beta Pruning, Tic-Tac-Toe',
      'CSPs: Map Coloring & N-Queens Backtracking',
      'Inference: Propositional Logic, Forward/Backward Chaining',
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  if (
    id === 'ai-practical' ||
    id === 'ai-practical-slips' ||
    id === 'data-science' ||
    id === 'data-science-slips' ||
    id === 'os-practical' ||
    id === 'os-practical-slips'
  ) {
    return DOCUMENTS[0];
  }
  // Fallback to first document for any route
  return DOCUMENTS.find((doc) => doc.id === id) || DOCUMENTS[0];
}
