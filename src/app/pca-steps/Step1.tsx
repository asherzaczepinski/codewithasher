'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Imagine you&apos;re studying students&apos; exam performance and you collect 20 different test
          scores per student. Many of those scores will be correlated — students who do well on
          the algebra test tend to do well on the geometry test too. You have 20 numbers, but
          they don&apos;t all carry independent information.
        </p>
        <p>
          PCA — <strong>Principal Component Analysis</strong> — is a technique that finds the
          directions in your data that carry the most information, and discards the rest.
          Instead of 20 test scores you might end up with just 2 or 3 numbers that capture
          almost everything meaningful about a student&apos;s performance.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Compress Features at All?">
        <p>
          Too many features cause three serious problems:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Slow models</strong> — every extra feature adds computation. Training a
            model on 1,000 features takes far longer than training it on 10.
          </li>
          <li>
            <strong>Hard to visualize</strong> — humans can see 2D and 3D plots. Data in
            100 dimensions is invisible to us. Reducing to 2 components lets you actually
            look at the structure of your data.
          </li>
          <li>
            <strong>Overfitting</strong> — with many redundant features a model can memorize
            noise rather than learning real patterns. Fewer, well-chosen features make models
            generalize better.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Running Example">
        <p>
          Throughout this course we&apos;ll use a small, concrete dataset: students described by
          many correlated exam scores. Think of two features to start — a score out of 100 on
          a <strong>math exam</strong> and a score out of 100 on a <strong>physics exam</strong>.
          Because these subjects overlap, students who score high on one tend to score high on
          the other.
        </p>
        <p>
          PCA will find a single new direction — one number per student — that captures most
          of the variation in both scores combined. We&apos;ll build up every piece of that
          process from scratch: what &quot;direction&quot; means, how to measure which directions
          carry the most information, and how to project each student&apos;s data onto those
          directions to get their compressed representation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Road Ahead">
        <p>
          This course is organized into five parts, each building on the last:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Introduction</strong> — what PCA does and the geometric shape of
            correlated data.
          </li>
          <li>
            <strong>The Problem</strong> — why high-dimensional data breaks ordinary machine
            learning (the curse of dimensionality).
          </li>
          <li>
            <strong>Measuring Spread</strong> — variance, variance along any direction,
            covariance, and the covariance matrix.
          </li>
          <li>
            <strong>The Method</strong> — eigenvectors as principal components, finding them by
            hand, projecting and reconstructing the data.
          </li>
          <li>
            <strong>Using PCA</strong> — choosing how many components to keep, the full
            pipeline, and where PCA shows up in the real world.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="What You Need">
        <p>
          Basic algebra and a rough idea of what a <em>mean</em> and <em>variance</em> are.
          We&apos;ll reintroduce everything else as we go — including a gentle reminder about
          eigenvectors when we need them.
        </p>
      </ExplanationBox>
    </div>
  );
}
