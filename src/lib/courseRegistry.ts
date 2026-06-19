import type { ComponentType } from 'react';
import type { CourseStep } from '@/components/CourseShell';

// Step metadata + part names for every course. The neural-networks store uses
// bare STEPS (no part names), so its part names are supplied inline below.
import { STEPS as NN_STEPS } from '@/lib/store';
import { LA_STEPS, LA_PART_NAMES } from '@/lib/linear-algebraStore';
import { CALC_STEPS, CALC_PART_NAMES } from '@/lib/calculusStore';
import { PROB_STEPS, PROB_PART_NAMES } from '@/lib/probabilityStore';
import { MLF_STEPS, MLF_PART_NAMES } from '@/lib/ml-foundationsStore';
import { EVAL_STEPS, EVAL_PART_NAMES } from '@/lib/model-evaluationStore';
import { FE_STEPS, FE_PART_NAMES } from '@/lib/feature-engineeringStore';
import { GD_STEPS, GD_PART_NAMES } from '@/lib/gradient-descentStore';
import { OPT_STEPS, OPT_PART_NAMES } from '@/lib/optimization-theoryStore';
import { LR_STEPS, LR_PART_NAMES } from '@/lib/linear-regressionStore';
import { LOG_STEPS, LOG_PART_NAMES } from '@/lib/logistic-regressionStore';
import { KNN_STEPS, KNN_PART_NAMES } from '@/lib/knnStore';
import { NB_STEPS, NB_PART_NAMES } from '@/lib/naive-bayesStore';
import { DT_STEPS, DT_PART_NAMES } from '@/lib/decision-treesStore';
import { SVM_STEPS, SVM_PART_NAMES } from '@/lib/svmStore';
import { ENS_STEPS, ENS_PART_NAMES } from '@/lib/ensemble-methodsStore';
import { KM_STEPS, KM_PART_NAMES } from '@/lib/kmeansStore';
import { PCA_STEPS, PCA_PART_NAMES } from '@/lib/pcaStore';
import { UL_STEPS, UL_PART_NAMES } from '@/lib/unsupervised-learningStore';
import { PML_STEPS, PML_PART_NAMES } from '@/lib/probabilistic-mlStore';
import { TNN_STEPS, TNN_PART_NAMES } from '@/lib/training-neural-networksStore';
import { CNN_STEPS, CNN_PART_NAMES } from '@/lib/cnnStore';
import { RNN_STEPS, RNN_PART_NAMES } from '@/lib/rnnStore';
import { AED_STEPS, AED_PART_NAMES } from '@/lib/autoencoders-diffusionStore';
import { GAN_STEPS, GAN_PART_NAMES } from '@/lib/gansStore';
import { TF_STEPS, TF_PART_NAMES } from '@/lib/transformersStore';
import { LLM_STEPS, LLM_PART_NAMES } from '@/lib/llmStore';
import { LLME_STEPS, LLME_PART_NAMES } from '@/lib/llm-engineeringStore';
import { RL_STEPS, RL_PART_NAMES } from '@/lib/reinforcement-learningStore';
import { RLA_STEPS, RLA_PART_NAMES } from '@/lib/rl-advancedStore';
import { ADV_STEPS, ADV_PART_NAMES } from '@/lib/advanced-mlStore';
import { OD_STEPS, OD_PART_NAMES } from '@/lib/object-detectionStore';
import { SDC_STEPS, SDC_PART_NAMES } from '@/lib/self-drivingStore';
import { SYS_STEPS, SYS_PART_NAMES } from '@/lib/applied-ml-systemsStore';

export interface PrintableCourse {
  slug: string;
  name: string;
  category: string;
  steps: CourseStep[];
  partNames: Record<number, string>;
  /** Lazily load one step component (literal import paths so the bundler can resolve them). */
  load: (stepNum: number) => Promise<{ default: ComponentType }>;
}

const NN_PART_NAMES: Record<number, string> = {
  0: 'Introduction',
  1: 'The Neuron',
  2: 'Activation Functions',
  3: 'How the Network Learns',
};

export const PRINTABLE_COURSES: PrintableCourse[] = [
  // ── Featured ──────────────────────────────────────────────────────────────
  { slug: 'neural-networks', name: 'Neural Networks', category: 'Featured', steps: NN_STEPS, partNames: NN_PART_NAMES, load: n => import(`@/app/steps/Step${n}`) },

  // ── Math Foundations ────────────────────────────────────────────────────────
  { slug: 'linear-algebra', name: 'Linear Algebra', category: 'Math Foundations', steps: LA_STEPS, partNames: LA_PART_NAMES, load: n => import(`@/app/linear-algebra-steps/Step${n}`) },
  { slug: 'calculus', name: 'Calculus for ML', category: 'Math Foundations', steps: CALC_STEPS, partNames: CALC_PART_NAMES, load: n => import(`@/app/calculus-steps/Step${n}`) },
  { slug: 'probability', name: 'Probability & Statistics', category: 'Math Foundations', steps: PROB_STEPS, partNames: PROB_PART_NAMES, load: n => import(`@/app/probability-steps/Step${n}`) },

  // ── ML Foundations & Workflow ────────────────────────────────────────────────
  { slug: 'ml-foundations', name: 'ML Foundations', category: 'ML Foundations & Workflow', steps: MLF_STEPS, partNames: MLF_PART_NAMES, load: n => import(`@/app/ml-foundations-steps/Step${n}`) },
  { slug: 'model-evaluation', name: 'Model Evaluation', category: 'ML Foundations & Workflow', steps: EVAL_STEPS, partNames: EVAL_PART_NAMES, load: n => import(`@/app/model-evaluation-steps/Step${n}`) },
  { slug: 'feature-engineering', name: 'Feature Engineering', category: 'ML Foundations & Workflow', steps: FE_STEPS, partNames: FE_PART_NAMES, load: n => import(`@/app/feature-engineering-steps/Step${n}`) },
  { slug: 'gradient-descent', name: 'Gradient Descent', category: 'ML Foundations & Workflow', steps: GD_STEPS, partNames: GD_PART_NAMES, load: n => import(`@/app/gradient-descent-steps/Step${n}`) },
  { slug: 'optimization-theory', name: 'Optimization & Learning Theory', category: 'ML Foundations & Workflow', steps: OPT_STEPS, partNames: OPT_PART_NAMES, load: n => import(`@/app/optimization-theory-steps/Step${n}`) },

  // ── Supervised Learning ──────────────────────────────────────────────────────
  { slug: 'linear-regression', name: 'Linear Regression', category: 'Supervised Learning', steps: LR_STEPS, partNames: LR_PART_NAMES, load: n => import(`@/app/linear-regression-steps/Step${n}`) },
  { slug: 'logistic-regression', name: 'Logistic Regression', category: 'Supervised Learning', steps: LOG_STEPS, partNames: LOG_PART_NAMES, load: n => import(`@/app/logistic-regression-steps/Step${n}`) },
  { slug: 'knn', name: 'K-Nearest Neighbors', category: 'Supervised Learning', steps: KNN_STEPS, partNames: KNN_PART_NAMES, load: n => import(`@/app/knn-steps/Step${n}`) },
  { slug: 'naive-bayes', name: 'Naive Bayes', category: 'Supervised Learning', steps: NB_STEPS, partNames: NB_PART_NAMES, load: n => import(`@/app/naive-bayes-steps/Step${n}`) },
  { slug: 'decision-trees', name: 'Decision Trees & Forests', category: 'Supervised Learning', steps: DT_STEPS, partNames: DT_PART_NAMES, load: n => import(`@/app/decision-trees-steps/Step${n}`) },
  { slug: 'svm', name: 'Support Vector Machines', category: 'Supervised Learning', steps: SVM_STEPS, partNames: SVM_PART_NAMES, load: n => import(`@/app/svm-steps/Step${n}`) },
  { slug: 'ensemble-methods', name: 'Ensemble Methods & Boosting', category: 'Supervised Learning', steps: ENS_STEPS, partNames: ENS_PART_NAMES, load: n => import(`@/app/ensemble-methods-steps/Step${n}`) },

  // ── Unsupervised & Probabilistic ─────────────────────────────────────────────
  { slug: 'kmeans', name: 'K-Means Clustering', category: 'Unsupervised & Probabilistic', steps: KM_STEPS, partNames: KM_PART_NAMES, load: n => import(`@/app/kmeans-steps/Step${n}`) },
  { slug: 'pca', name: 'PCA & Dimensionality Reduction', category: 'Unsupervised & Probabilistic', steps: PCA_STEPS, partNames: PCA_PART_NAMES, load: n => import(`@/app/pca-steps/Step${n}`) },
  { slug: 'unsupervised-learning', name: 'Unsupervised Learning', category: 'Unsupervised & Probabilistic', steps: UL_STEPS, partNames: UL_PART_NAMES, load: n => import(`@/app/unsupervised-learning-steps/Step${n}`) },
  { slug: 'probabilistic-ml', name: 'Probabilistic ML', category: 'Unsupervised & Probabilistic', steps: PML_STEPS, partNames: PML_PART_NAMES, load: n => import(`@/app/probabilistic-ml-steps/Step${n}`) },

  // ── Deep Learning ────────────────────────────────────────────────────────────
  { slug: 'training-neural-networks', name: 'Training Neural Networks', category: 'Deep Learning', steps: TNN_STEPS, partNames: TNN_PART_NAMES, load: n => import(`@/app/training-neural-networks-steps/Step${n}`) },
  { slug: 'cnn', name: 'Convolutional Neural Networks', category: 'Deep Learning', steps: CNN_STEPS, partNames: CNN_PART_NAMES, load: n => import(`@/app/cnn-steps/Step${n}`) },
  { slug: 'rnn', name: 'RNNs & LSTMs', category: 'Deep Learning', steps: RNN_STEPS, partNames: RNN_PART_NAMES, load: n => import(`@/app/rnn-steps/Step${n}`) },
  { slug: 'autoencoders-diffusion', name: 'Autoencoders & Diffusion', category: 'Deep Learning', steps: AED_STEPS, partNames: AED_PART_NAMES, load: n => import(`@/app/autoencoders-diffusion-steps/Step${n}`) },
  { slug: 'gans', name: 'Generative Adversarial Networks', category: 'Deep Learning', steps: GAN_STEPS, partNames: GAN_PART_NAMES, load: n => import(`@/app/gans-steps/Step${n}`) },

  // ── Transformers & LLMs ──────────────────────────────────────────────────────
  { slug: 'transformers', name: 'Transformers', category: 'Transformers & LLMs', steps: TF_STEPS, partNames: TF_PART_NAMES, load: n => import(`@/app/transformers-steps/Step${n}`) },
  { slug: 'llms', name: 'Large Language Models', category: 'Transformers & LLMs', steps: LLM_STEPS, partNames: LLM_PART_NAMES, load: n => import(`@/app/llm-steps/Step${n}`) },
  { slug: 'llm-engineering', name: 'LLM Engineering', category: 'Transformers & LLMs', steps: LLME_STEPS, partNames: LLME_PART_NAMES, load: n => import(`@/app/llm-engineering-steps/Step${n}`) },

  // ── Reinforcement Learning ───────────────────────────────────────────────────
  { slug: 'reinforcement-learning', name: 'Reinforcement Learning', category: 'Reinforcement Learning', steps: RL_STEPS, partNames: RL_PART_NAMES, load: n => import(`@/app/reinforcement-learning-steps/Step${n}`) },
  { slug: 'rl-advanced', name: 'Advanced Reinforcement Learning', category: 'Reinforcement Learning', steps: RLA_STEPS, partNames: RLA_PART_NAMES, load: n => import(`@/app/rl-advanced-steps/Step${n}`) },

  // ── Advanced & Applied ───────────────────────────────────────────────────────
  { slug: 'advanced-ml', name: 'Advanced ML Topics', category: 'Advanced & Applied', steps: ADV_STEPS, partNames: ADV_PART_NAMES, load: n => import(`@/app/advanced-ml-steps/Step${n}`) },
  { slug: 'object-detection', name: 'Object Detection & YOLO', category: 'Advanced & Applied', steps: OD_STEPS, partNames: OD_PART_NAMES, load: n => import(`@/app/object-detection-steps/Step${n}`) },
  { slug: 'self-driving', name: 'Self-Driving Cars', category: 'Advanced & Applied', steps: SDC_STEPS, partNames: SDC_PART_NAMES, load: n => import(`@/app/self-driving-steps/Step${n}`) },
  { slug: 'applied-ml-systems', name: 'Applied ML & MLOps', category: 'Advanced & Applied', steps: SYS_STEPS, partNames: SYS_PART_NAMES, load: n => import(`@/app/applied-ml-systems-steps/Step${n}`) },
];

/** Distinct categories in registry order, for grouping the picker UI. */
export const PRINTABLE_CATEGORIES: string[] = PRINTABLE_COURSES.reduce<string[]>((acc, c) => {
  if (!acc.includes(c.category)) acc.push(c.category);
  return acc;
}, []);

export const getPrintableCourse = (slug: string): PrintableCourse | undefined =>
  PRINTABLE_COURSES.find(c => c.slug === slug);
