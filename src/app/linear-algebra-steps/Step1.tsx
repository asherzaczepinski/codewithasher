'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Why Linear Algebra?">
        <p>
          Every time a machine learning model makes a prediction — whether it&apos;s recognising a face,
          recommending a film, or translating a sentence — it is doing linear algebra. Not as a convenience,
          but as the fundamental mechanism of computation. Linear algebra is the language ML is written in.
        </p>
        <p>
          The reason is simple: <strong>data is just numbers, and numbers arranged in an organised way are exactly
          what linear algebra studies.</strong> The moment you represent a house as a list of its features
          (size, bedrooms, distance to school) you have a vector. The moment you collect a thousand such houses
          into a spreadsheet you have a matrix. Every algorithm that learns from that spreadsheet — from the
          simplest linear regression to a billion-parameter transformer — is performing matrix operations under the hood.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Data Is Just Numbers in a Shape">
        <p>
          Here is the core insight this course will build on: a <strong>data point is a vector</strong> and a
          <strong> dataset is a matrix</strong>. Once you see data that way, the operations that algorithms perform
          stop looking like magic and start looking obvious.
        </p>
        <p>
          To keep things concrete, we will use one running example throughout the entire course:
          a <strong>house listing</strong>. Every house can be described by a handful of numbers —
          square footage, number of bedrooms, number of bathrooms, distance to the nearest school in kilometres.
          Those four numbers, written in order, form a vector. A thousand house listings form a matrix with
          1 000 rows and 4 columns.
        </p>
        <p>
          By the end of this course you will see exactly how a model reads that matrix, multiplies it by
          a matrix of learned weights, and produces a prediction — all as one elegant operation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Course Covers">
        <p>
          <strong>Part 1 — Vectors:</strong> what a vector is geometrically and as a list of features;
          how to add, subtract, and scale vectors; the dot product and why it measures similarity; how a
          neural network neuron is literally a dot product.
        </p>
        <p>
          <strong>Part 2 — Matrices:</strong> grids of numbers and their shape notation; the rule of matrix
          multiplication and why it generalises the dot product; special matrices (identity, transpose, inverse)
          that every practitioner encounters daily; eigenvectors and eigenvalues as a preview of dimensionality
          reduction and PCA.
        </p>
        <p>
          Each module contains real calculations you can follow step by step — not just formulas, but the
          arithmetic behind them, using our house-listing example. Let&apos;s start.
        </p>
      </ExplanationBox>
    </div>
  );
}
