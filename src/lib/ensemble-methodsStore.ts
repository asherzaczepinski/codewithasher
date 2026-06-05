export const ENS_TOTAL_STEPS = 7;

export const ENS_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'Bagging',
  2: 'Boosting',
};

export const ENS_STEPS = [
  // Part 0: Introduction
  { id: 1, title: 'Welcome', shortTitle: 'Intro', part: 0 },
  // Part 1: Bagging
  { id: 2, title: 'Bagging & Random Forests', shortTitle: 'Bagging', part: 1 },
  { id: 3, title: 'Extra Trees & Feature Importance', shortTitle: 'Extra Trees', part: 1 },
  // Part 2: Boosting
  { id: 4, title: 'Boosting Fundamentals', shortTitle: 'Boosting', part: 2 },
  { id: 5, title: 'Gradient Boosting', shortTitle: 'Gradient Boosting', part: 2 },
  { id: 6, title: 'XGBoost, LightGBM & CatBoost', shortTitle: 'XGBoost & Friends', part: 2 },
  { id: 7, title: 'Stacking & Class Imbalance', shortTitle: 'Stacking', part: 2 },
];
