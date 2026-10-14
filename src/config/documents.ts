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
    id: 'data-science-slips',
    title: 'Data Science Practical Slips',
    subtitle: 'Python Lab Programs • Slips 4, 5, 6, 7, 11, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25',
    description:
      'Complete Data Science practical solutions in Python covering Pandas, Matplotlib, Scikit-Learn (Logistic Regression, Linear Regression, Polynomial Regression, KNN, Random Forest, KMeans Clustering), Hierarchical Clustering (Dendrograms), Association Rule Mining (Apriori), Data Preprocessing, Feature Scaling, Outlier Detection, Venn Diagrams, and Treemaps.',
    filePath: '/pdfs/data-science-slips.pdf',
    downloadFilename: 'Data-Science-Practical-Slips.pdf',
    badge: 'Data Science',
    category: 'Data Science & Machine Learning',
    pageCountText: '37 Pages • PDF',
    iconType: 'code',
    accentColor: '#2563eb',
    highlights: [
      'Slips 4, 5, 6, 7, 11, 14, 15, 16, 17, 18, 19, 20, 22, 23, 25',
      'Machine Learning: Classification, Regression & Clustering',
      'Data Preprocessing, Scaling & Outlier Detection',
      'Visualizations: Heatmaps, Treemaps, Dendrograms & Venn',
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  if (
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
