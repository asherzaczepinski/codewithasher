'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="The Problem: Too Many Lines Work">
        <p>
          Imagine you have a set of data points on a flat surface — say, measurements of two flower
          species. Each flower has two features: petal length and petal width. Species A clusters in
          one region, Species B in another. When you plot them, they separate cleanly.
        </p>
        <p>
          Now you want to draw a line that divides Species A from Species B so you can classify new
          flowers. Here&apos;s the uncomfortable truth: infinitely many lines can do this correctly.
          You could tilt the line left, right, nudge it toward one cluster or the other — and every
          single one of those lines would still get every training point right.
        </p>
        <p>
          So which line should you choose? A randomly chosen line that just barely squeaks between
          the clusters is fragile. A new flower that sits slightly off the beaten path could land on
          the wrong side purely because of where you happened to draw the boundary.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The SVM Answer: Find the Widest Gap">
        <p>
          A <strong>Support Vector Machine (SVM)</strong> solves this problem with a beautifully
          simple idea: among all lines that correctly separate the classes, pick the one that keeps
          the largest possible empty gap between itself and the nearest points on either side.
        </p>
        <p>
          Think of that gap as a <em>street</em>. The street runs between the two flower clusters.
          The SVM finds the widest street that fits without any points inside it, then places the
          decision boundary down the center of that street.
        </p>
        <p>
          A wider street means more breathing room. New points have to stray further from their
          cluster before the classifier makes a mistake. That robustness is the core promise of the
          SVM.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example">
        <p>
          Throughout this course we work with two species of flowers — call them <strong>Setosa</strong>{' '}
          and <strong>Versicolor</strong> — plotted by petal length (x-axis) and petal width (y-axis).
          Setosa points sit in the lower-left; Versicolor points sit in the upper-right.
        </p>
        <p>
          We will find the SVM boundary — the line down the center of the widest street — and follow
          its math step by step from the raw geometry all the way through to handling data that cannot
          be separated by any straight line at all.
        </p>
      </ExplanationBox>
    </div>
  );
}
