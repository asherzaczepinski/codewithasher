'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Actually Is">
        <p>
          This is the tutorial I wish existed. We break down neural networks from the ground up. Every concept is explained with real math you can
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

      <ExplanationBox title="The Project: Predicting Rain">
        <p>
          Throughout this course, we use one example: a neural network that predicts whether
          it will rain based on temperature, humidity, and pressure.
        </p>
        <p>
          It&apos;s simple enough to understand completely, but complex enough to teach you
          everything that matters.
        </p>
      </ExplanationBox>
    </div>
  );
}
