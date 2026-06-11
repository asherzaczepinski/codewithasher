'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Featured course (always available)
import { TOTAL_STEPS } from '@/lib/store';
import { getCompletedSteps as nnDone } from '@/lib/progress';

// Math Foundations
import { LA_TOTAL_STEPS } from '@/lib/linear-algebraStore';
import { getCompletedSteps as laDone } from '@/lib/linear-algebraProgress';
import { CALC_TOTAL_STEPS } from '@/lib/calculusStore';
import { getCompletedSteps as calcDone } from '@/lib/calculusProgress';
import { PROB_TOTAL_STEPS } from '@/lib/probabilityStore';
import { getCompletedSteps as probDone } from '@/lib/probabilityProgress';

// ML Foundations & Workflow
import { MLF_TOTAL_STEPS } from '@/lib/ml-foundationsStore';
import { getCompletedSteps as mlfDone } from '@/lib/ml-foundationsProgress';
import { EVAL_TOTAL_STEPS } from '@/lib/model-evaluationStore';
import { getCompletedSteps as evalDone } from '@/lib/model-evaluationProgress';
import { FE_TOTAL_STEPS } from '@/lib/feature-engineeringStore';
import { getCompletedSteps as feDone } from '@/lib/feature-engineeringProgress';
import { GD_TOTAL_STEPS } from '@/lib/gradient-descentStore';
import { getCompletedSteps as gdDone } from '@/lib/gradient-descentProgress';
import { OPT_TOTAL_STEPS } from '@/lib/optimization-theoryStore';
import { getCompletedSteps as optDone } from '@/lib/optimization-theoryProgress';

// Supervised Learning
import { LR_TOTAL_STEPS } from '@/lib/linear-regressionStore';
import { getCompletedSteps as lrDone } from '@/lib/linear-regressionProgress';
import { LOG_TOTAL_STEPS } from '@/lib/logistic-regressionStore';
import { getCompletedSteps as logDone } from '@/lib/logistic-regressionProgress';
import { KNN_TOTAL_STEPS } from '@/lib/knnStore';
import { getCompletedSteps as knnDone } from '@/lib/knnProgress';
import { NB_TOTAL_STEPS } from '@/lib/naive-bayesStore';
import { getCompletedSteps as nbDone } from '@/lib/naive-bayesProgress';
import { DT_TOTAL_STEPS } from '@/lib/decision-treesStore';
import { getCompletedSteps as dtDone } from '@/lib/decision-treesProgress';
import { SVM_TOTAL_STEPS } from '@/lib/svmStore';
import { getCompletedSteps as svmDone } from '@/lib/svmProgress';
import { ENS_TOTAL_STEPS } from '@/lib/ensemble-methodsStore';
import { getCompletedSteps as ensDone } from '@/lib/ensemble-methodsProgress';

// Unsupervised & Probabilistic
import { KM_TOTAL_STEPS } from '@/lib/kmeansStore';
import { getCompletedSteps as kmDone } from '@/lib/kmeansProgress';
import { PCA_TOTAL_STEPS } from '@/lib/pcaStore';
import { getCompletedSteps as pcaDone } from '@/lib/pcaProgress';
import { UL_TOTAL_STEPS } from '@/lib/unsupervised-learningStore';
import { getCompletedSteps as ulDone } from '@/lib/unsupervised-learningProgress';
import { PML_TOTAL_STEPS } from '@/lib/probabilistic-mlStore';
import { getCompletedSteps as pmlDone } from '@/lib/probabilistic-mlProgress';

// Deep Learning
import { TNN_TOTAL_STEPS } from '@/lib/training-neural-networksStore';
import { getCompletedSteps as tnnDone } from '@/lib/training-neural-networksProgress';
import { CNN_TOTAL_STEPS } from '@/lib/cnnStore';
import { getCompletedSteps as cnnDone } from '@/lib/cnnProgress';
import { RNN_TOTAL_STEPS } from '@/lib/rnnStore';
import { getCompletedSteps as rnnDone } from '@/lib/rnnProgress';
import { AED_TOTAL_STEPS } from '@/lib/autoencoders-diffusionStore';
import { getCompletedSteps as aedDone } from '@/lib/autoencoders-diffusionProgress';
import { GAN_TOTAL_STEPS } from '@/lib/gansStore';
import { getCompletedSteps as ganDone } from '@/lib/gansProgress';

// Transformers & LLMs
import { TF_TOTAL_STEPS } from '@/lib/transformersStore';
import { getCompletedSteps as tfDone } from '@/lib/transformersProgress';
import { LLM_TOTAL_STEPS } from '@/lib/llmStore';
import { getCompletedSteps as llmDone } from '@/lib/llmProgress';
import { LLME_TOTAL_STEPS } from '@/lib/llm-engineeringStore';
import { getCompletedSteps as llmeDone } from '@/lib/llm-engineeringProgress';

// Reinforcement Learning
import { RL_TOTAL_STEPS } from '@/lib/reinforcement-learningStore';
import { getCompletedSteps as rlDone } from '@/lib/reinforcement-learningProgress';
import { RLA_TOTAL_STEPS } from '@/lib/rl-advancedStore';
import { getCompletedSteps as rlaDone } from '@/lib/rl-advancedProgress';

// Advanced & Applied
import { ADV_TOTAL_STEPS } from '@/lib/advanced-mlStore';
import { getCompletedSteps as advDone } from '@/lib/advanced-mlProgress';
import { OD_TOTAL_STEPS } from '@/lib/object-detectionStore';
import { getCompletedSteps as odDone } from '@/lib/object-detectionProgress';
import { SDC_TOTAL_STEPS } from '@/lib/self-drivingStore';
import { getCompletedSteps as sdcDone } from '@/lib/self-drivingProgress';
import { SYS_TOTAL_STEPS } from '@/lib/applied-ml-systemsStore';
import { getCompletedSteps as sysDone } from '@/lib/applied-ml-systemsProgress';

interface CourseMeta {
  slug: string;
  name: string;
  description: string;
  total: number;
  getCompleted: () => Set<number>;
}

interface Category {
  name: string;
  blurb: string;
  courses: CourseMeta[];
}

const CATEGORIES: Category[] = [
  {
    name: 'Math Foundations',
    blurb: 'The language every model is written in.',
    courses: [
      { slug: 'linear-algebra', name: 'Linear Algebra', description: 'Vectors, matrices, the dot product, and eigenvectors — the language of machine learning.', total: LA_TOTAL_STEPS, getCompleted: laDone },
      { slug: 'calculus', name: 'Calculus for ML', description: 'Derivatives, the chain rule, partial derivatives, and gradients — the math behind learning.', total: CALC_TOTAL_STEPS, getCompleted: calcDone },
      { slug: 'probability', name: 'Probability & Statistics', description: 'Distributions, expectation, variance, and Bayes’ theorem — reasoning under uncertainty.', total: PROB_TOTAL_STEPS, getCompleted: probDone },
    ],
  },
  {
    name: 'ML Foundations & Workflow',
    blurb: 'How real machine learning projects actually work.',
    courses: [
      { slug: 'ml-foundations', name: 'ML Foundations', description: 'Types of ML, problem framing, train/test splits, data leakage, EDA, and preprocessing.', total: MLF_TOTAL_STEPS, getCompleted: mlfDone },
      { slug: 'model-evaluation', name: 'Model Evaluation', description: 'Precision, recall, F1, ROC/AUC, cross-validation, and the bias-variance tradeoff.', total: EVAL_TOTAL_STEPS, getCompleted: evalDone },
      { slug: 'feature-engineering', name: 'Feature Engineering', description: 'Encoding, selection, extraction, TF-IDF, time features, and handling imbalance.', total: FE_TOTAL_STEPS, getCompleted: feDone },
      { slug: 'gradient-descent', name: 'Gradient Descent', description: 'Cost functions, the update rule, and learning rates — how models actually learn.', total: GD_TOTAL_STEPS, getCompleted: gdDone },
      { slug: 'optimization-theory', name: 'Optimization & Learning Theory', description: 'Adam, learning-rate schedules, regularization, MLE/MAP, and generalization theory.', total: OPT_TOTAL_STEPS, getCompleted: optDone },
    ],
  },
  {
    name: 'Supervised Learning',
    blurb: 'Learning from labeled examples.',
    courses: [
      { slug: 'linear-regression', name: 'Linear Regression', description: 'Fit a line, measure error with MSE, and predict continuous numbers from features.', total: LR_TOTAL_STEPS, getCompleted: lrDone },
      { slug: 'logistic-regression', name: 'Logistic Regression', description: 'The sigmoid, decision boundaries, cross-entropy, and softmax — classifying with probabilities.', total: LOG_TOTAL_STEPS, getCompleted: logDone },
      { slug: 'knn', name: 'K-Nearest Neighbors', description: 'Distance metrics, majority voting, and the curse of dimensionality.', total: KNN_TOTAL_STEPS, getCompleted: knnDone },
      { slug: 'naive-bayes', name: 'Naive Bayes', description: 'Bayes’ rule, the naive independence assumption, and a spam filter built from scratch.', total: NB_TOTAL_STEPS, getCompleted: nbDone },
      { slug: 'decision-trees', name: 'Decision Trees & Forests', description: 'Splits, entropy, information gain, and random forests — learning with yes/no questions.', total: DT_TOTAL_STEPS, getCompleted: dtDone },
      { slug: 'svm', name: 'Support Vector Machines', description: 'Margins, support vectors, soft margins, and the kernel trick.', total: SVM_TOTAL_STEPS, getCompleted: svmDone },
      { slug: 'ensemble-methods', name: 'Ensemble Methods & Boosting', description: 'Bagging, gradient boosting, and XGBoost / LightGBM / CatBoost — why many models beat one.', total: ENS_TOTAL_STEPS, getCompleted: ensDone },
    ],
  },
  {
    name: 'Unsupervised & Probabilistic',
    blurb: 'Finding structure and modeling uncertainty.',
    courses: [
      { slug: 'kmeans', name: 'K-Means Clustering', description: 'Centroids, assignment and update steps, and choosing k — grouping unlabeled data.', total: KM_TOTAL_STEPS, getCompleted: kmDone },
      { slug: 'pca', name: 'PCA & Dimensionality Reduction', description: 'Variance, covariance, and principal components — compressing data without losing signal.', total: PCA_TOTAL_STEPS, getCompleted: pcaDone },
      { slug: 'unsupervised-learning', name: 'Unsupervised Learning', description: 'DBSCAN, GMMs and EM, SVD, t-SNE, UMAP, anomaly detection, and association rules.', total: UL_TOTAL_STEPS, getCompleted: ulDone },
      { slug: 'probabilistic-ml', name: 'Probabilistic ML', description: 'Bayesian networks, HMMs, MCMC, and variational inference — modeling hidden structure.', total: PML_TOTAL_STEPS, getCompleted: pmlDone },
    ],
  },
  {
    name: 'Deep Learning',
    blurb: 'Neural networks and the architectures built on them.',
    courses: [
      { slug: 'training-neural-networks', name: 'Training Neural Networks', description: 'Activations, initialization, vanishing gradients, dropout, and batch/layer norm.', total: TNN_TOTAL_STEPS, getCompleted: tnnDone },
      { slug: 'cnn', name: 'Convolutional Neural Networks', description: 'Convolution, filters, feature maps, and pooling — how machines see images.', total: CNN_TOTAL_STEPS, getCompleted: cnnDone },
      { slug: 'rnn', name: 'RNNs & LSTMs', description: 'Hidden state, recurrence, vanishing gradients, and gates — networks with memory.', total: RNN_TOTAL_STEPS, getCompleted: rnnDone },
      { slug: 'autoencoders-diffusion', name: 'Autoencoders & Diffusion', description: 'Autoencoders, VAEs, and diffusion models — compressing and generating data.', total: AED_TOTAL_STEPS, getCompleted: aedDone },
      { slug: 'gans', name: 'Generative Adversarial Networks', description: 'Generator vs discriminator, the adversarial game, and mode collapse.', total: GAN_TOTAL_STEPS, getCompleted: ganDone },
    ],
  },
  {
    name: 'Transformers & LLMs',
    blurb: 'The architecture behind modern AI.',
    courses: [
      { slug: 'transformers', name: 'Transformers', description: 'Tokenization, self-attention, multi-head attention, and the full transformer block.', total: TF_TOTAL_STEPS, getCompleted: tfDone },
      { slug: 'llms', name: 'Large Language Models', description: 'Tokenization, embeddings, attention, and generation — build an LLM from the ground up.', total: LLM_TOTAL_STEPS, getCompleted: llmDone },
      { slug: 'llm-engineering', name: 'LLM Engineering', description: 'Pretraining, instruction tuning, RLHF, LoRA, RAG, and serving — building real assistants.', total: LLME_TOTAL_STEPS, getCompleted: llmeDone },
    ],
  },
  {
    name: 'Reinforcement Learning',
    blurb: 'Learning to act through trial and error.',
    courses: [
      { slug: 'reinforcement-learning', name: 'Reinforcement Learning', description: 'Agents, rewards, value functions, and Q-learning — learning from rewards.', total: RL_TOTAL_STEPS, getCompleted: rlDone },
      { slug: 'rl-advanced', name: 'Advanced Reinforcement Learning', description: 'MDPs, policy gradients, actor-critic, deep RL, bandits, and offline/multi-agent RL.', total: RLA_TOTAL_STEPS, getCompleted: rlaDone },
    ],
  },
  {
    name: 'Advanced & Applied',
    blurb: 'The frontier, and how it all ships to production.',
    courses: [
      { slug: 'advanced-ml', name: 'Advanced ML Topics', description: 'Adversarial examples, causal inference, fairness, meta-learning, and graph neural nets.', total: ADV_TOTAL_STEPS, getCompleted: advDone },
      { slug: 'object-detection', name: 'Object Detection & YOLO', description: 'Bounding boxes, IoU, the YOLO grid, anchors, and non-max suppression.', total: OD_TOTAL_STEPS, getCompleted: odDone },
      { slug: 'self-driving', name: 'Self-Driving Cars', description: 'Sensors, perception, sensor fusion, planning, and control — how autonomous cars drive.', total: SDC_TOTAL_STEPS, getCompleted: sdcDone },
      { slug: 'applied-ml-systems', name: 'Applied ML & MLOps', description: 'Pipelines, deployment, monitoring, drift, A/B testing, and governance.', total: SYS_TOTAL_STEPS, getCompleted: sysDone },
    ],
  },
];

function CourseCard({ course, completed, unlocked }: { course: CourseMeta; completed: number; unlocked: boolean }) {
  const percent = Math.round((completed / course.total) * 100);

  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: unlocked ? '#222' : '#9ca3af' }}>{course.name}</span>
        {unlocked ? (
          <span style={{ fontSize: 12, fontWeight: 500, color: '#888', whiteSpace: 'nowrap' }}>{course.total} modules</span>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', background: '#f0f1f3', border: '1px solid #e5e7eb', borderRadius: 999, padding: '2px 9px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.4 }}>
            Coming Soon
          </span>
        )}
      </div>
      <p style={{ fontSize: 14, color: unlocked ? '#444' : '#aab0b8', lineHeight: 1.55, margin: unlocked ? '0 0 14px' : 0 }}>{course.description}</p>

      {unlocked && (
        <>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{completed}/{course.total} completed</span>
              <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>{percent}%</span>
            </div>
            <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: '#2563eb', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>
            {completed > 0 ? 'Continue learning →' : 'Start learning →'}
          </span>
        </>
      )}
    </>
  );

  const baseStyle: React.CSSProperties = {
    display: 'block',
    padding: 22,
    background: unlocked ? '#f9fafb' : '#fcfcfd',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    color: 'inherit',
  };

  if (!unlocked) {
    return (
      <div style={{ ...baseStyle, opacity: 0.7, cursor: 'default' }} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <a href={`/${course.slug}`} style={{ ...baseStyle, textDecoration: 'none' }}>
      {inner}
    </a>
  );
}

export default function HomePage() {
  const [nnCompleted, setNnCompleted] = useState(0);
  const [progress, setProgress] = useState<Record<string, number>>({});
  // Other courses are "Coming Soon" in production and only unlock on localhost for testing.
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    setUnlocked(isLocal);

    setNnCompleted(nnDone().size);

    if (isLocal) {
      const next: Record<string, number> = {};
      for (const category of CATEGORIES) {
        for (const course of category.courses) {
          next[course.slug] = course.getCompleted().size;
        }
      }
      setProgress(next);
    }
  }, []);

  const nnPercent = Math.round((nnCompleted / TOTAL_STEPS) * 100);
  const totalCourses = CATEGORIES.reduce((sum, c) => sum + c.courses.length, 0) + 1;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#222' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 56, paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src="/logo.png" alt="codewithasher logo" width={180} height={98} style={{ objectFit: 'contain', marginBottom: 20 }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, margin: 0, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1 }}>
            codewithasher
          </h1>
        </div>

        {/* Featured courses */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 14 }}>Start Here</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a
              href="/neural-networks"
              style={{
                display: 'block',
                padding: 28,
                background: '#f9fafb',
                border: '1px solid #2563eb',
                borderRadius: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>Neural Networks</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#888', whiteSpace: 'nowrap' }}>{TOTAL_STEPS} modules</span>
              </div>
              <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>
                Build a neural network from scratch — no libraries, just pure math and real understanding.
                The best place to start.
              </p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{nnCompleted}/{TOTAL_STEPS} completed</span>
                  <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{nnPercent}%</span>
                </div>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${nnPercent}%`, background: '#2563eb', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>
                {nnCompleted > 0 ? 'Continue learning →' : 'Start learning →'}
              </span>
            </a>

            <a
              href="/llms"
              style={{
                display: 'block',
                padding: 28,
                background: '#f9fafb',
                border: '1px solid #7c3aed',
                borderRadius: 10,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 600, color: '#222' }}>Large Language Models</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#888', whiteSpace: 'nowrap' }}>{LLM_TOTAL_STEPS} modules</span>
              </div>
              <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>
                Tokenization, embeddings, attention, and generation — understand exactly how ChatGPT and friends work under the hood.
              </p>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{progress['llms'] ?? 0}/{LLM_TOTAL_STEPS} completed</span>
                  <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{Math.round(((progress['llms'] ?? 0) / LLM_TOTAL_STEPS) * 100)}%</span>
                </div>
                <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(((progress['llms'] ?? 0) / LLM_TOTAL_STEPS) * 100)}%`, background: '#7c3aed', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#7c3aed' }}>
                {(progress['llms'] ?? 0) > 0 ? 'Continue learning →' : 'Start learning →'}
              </span>
            </a>
          </div>
        </div>

        {/* About */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 32, marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Image
                src="/asher.png"
                alt="Asher Zaczepinski"
                width={80}
                height={80}
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', margin: 0 }}>About</h2>
          </div>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            Hey, I&apos;m Asher Zaczepinski — a 10th grader who got frustrated with traditional coding tutorials.
            I tried everything. YouTube tutorials. The fancy 3Blue1Brown series. Stanford lectures. Blog posts. Nothing worked.
            Every explanation either hand-waved the hard parts or drowned me in notation I didn&apos;t know.
          </p>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            So I built this platform where each coding concept is broken down with real math and
            step-by-step explanations so you can build genuine intuition. Whether you&apos;re a student,
            a developer, or just curious, if you want to truly understand what&apos;s happening under
            the hood, you&apos;re in the right place.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <a
              href="https://www.linkedin.com/in/asher-zaczepinski-755651373/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}
            >
              LinkedIn →
            </a>
            <a
              href="https://github.com/asherzaczepinski"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}
            >
              GitHub →
            </a>
          </div>
        </div>

        {/* Full curriculum */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', margin: 0 }}>Full Curriculum Coming Soon</h2>
            <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{totalCourses} courses</span>
          </div>
          <p style={{ fontSize: 15, color: '#666', lineHeight: 1.6, margin: '0 0 28px' }}>
            Every major machine learning concept, built from first principles with real math you can actually follow —
            from vectors and matrices all the way to transformers, YOLO, and self-driving cars. More courses are on the way.
          </p>

          {CATEGORIES.map(category => (
            <div key={category.name} style={{ marginBottom: 36 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#222', margin: '0 0 2px' }}>{category.name}</h3>
              <p style={{ fontSize: 14, color: '#888', margin: '0 0 14px' }}>{category.blurb}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {category.courses.map(course => (
                  <CourseCard key={course.slug} course={course} completed={progress[course.slug] ?? 0} unlocked={unlocked} />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
