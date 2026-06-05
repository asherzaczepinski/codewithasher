export const UL_TOTAL_STEPS = 8;

export const UL_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Clustering',
  2: 'Reducing & Discovering Structure',
};

export const UL_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Clustering
  { id: 2, title: 'Clustering & Centroid Methods', shortTitle: 'Clustering', part: 1 },
  { id: 3, title: 'Hierarchical Clustering & DBSCAN', shortTitle: 'Hierarchical & DBSCAN', part: 1 },
  { id: 4, title: 'Gaussian Mixture Models & EM', shortTitle: 'GMM & EM', part: 1 },
  // Part 2: Reducing & Discovering Structure
  { id: 5, title: 'PCA & SVD', shortTitle: 'PCA & SVD', part: 2 },
  { id: 6, title: 't-SNE & UMAP', shortTitle: 't-SNE & UMAP', part: 2 },
  { id: 7, title: 'Anomaly Detection', shortTitle: 'Anomaly Detection', part: 2 },
  { id: 8, title: 'Association Rules & Matrix Factorization', shortTitle: 'Associations & MF', part: 2 },
];
