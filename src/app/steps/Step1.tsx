'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Actually Is">
        <p>
          This is the tutorial I wish existed. We break down neural networks from the ground up—no
          hand-waving, no &quot;just trust me.&quot; Every concept is explained with real math you can
          actually follow.
        </p>
        <p>
          By the end, you&apos;ll understand every equation that makes a neural network work.
          You&apos;ll know what backpropagation <em>really</em> does, not just that it
          &quot;helps the network learn by correcting weights.&quot;
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need to Know">
        <p>
          <strong>Algebra</strong> — Seriously, that&apos;s it. We&apos;ll explain derivatives
          from scratch when we need them. No calculus prerequisite.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We'll Cover">
        <p>
          This course has two parts:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Part 1: The Overview</strong> — First, we build intuition. You&apos;ll understand
          what neurons are, how they connect into networks, and how networks learn — all without a
          single formula. Just diagrams, analogies, and the rain example. By the end of Part 1,
          you&apos;ll know the <em>why</em> behind every piece.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Part 2: The Math</strong> — Then we do the real thing. Every concept from Part 1
          gets its equation: weights, bias, sigmoid, forward propagation, loss functions,
          backpropagation, and gradient descent. No hand-waving — we derive it, visualize it,
          and build intuition for <em>why</em> it has to be that way.
        </p>
        <p style={{ marginTop: '1rem' }}>
          By the end, you&apos;ll understand every equation that makes a neural network work.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Project: Predicting Rain">
        <p>
          Throughout this course, we use one example: a neural network that predicts whether
          it will rain based on temperature and humidity.
        </p>
        <p>
          It&apos;s simple enough to understand completely, but complex enough to teach you
          everything that matters. By module 23, you&apos;ll understand how a network learns
          from data—and exactly how every piece works.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Let's Go">
        <p>
          No account required. No email signup. No upsells. Just scroll down and let&apos;s
          learn something real.
        </p>
      </ExplanationBox>
    </div>
  );
}
