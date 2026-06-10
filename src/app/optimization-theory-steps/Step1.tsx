'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Every machine learning model has two intertwined problems to solve. The first is{' '}
          <strong>optimization</strong>: given a loss surface — a landscape of error values
          over all possible parameter settings — how do we efficiently find parameters that
          make the loss small? The second is <strong>learning theory</strong>: once we find
          those parameters, will the model actually work on data it has never seen before?
        </p>
        <p>
          These two questions are not independent. The way you optimize affects how well you
          generalize, and the theory of generalization tells you how much data you need and
          how complex your model should be. This course covers both sides in depth.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Quick Recap: Gradient Descent and SGD">
        <p>
          You already know the core loop of training: compute a loss, take its gradient with
          respect to every parameter, and nudge each parameter in the direction that reduces
          the loss. The <strong>update rule</strong> is:
        </p>
      </ExplanationBox>

      <MathFormula label="Vanilla gradient descent update">
        w_new = w_old &minus; &alpha; &times; &nabla;L(w_old)
      </MathFormula>

      <ExplanationBox title="From Full-Batch to Mini-Batch">
        <p>
          <strong>Full-batch gradient descent</strong> computes the gradient over the entire
          dataset before taking one step. That gradient is exact, but on a dataset of a
          million examples it is extremely slow — you wait through a million forward passes
          just to move once.
        </p>
        <p>
          <strong>Stochastic gradient descent (SGD)</strong> takes the opposite extreme:
          compute the gradient on a single randomly chosen example and step immediately. Each
          step is cheap, but the gradient is noisy — a single example&apos;s loss can point
          in a slightly wrong direction.
        </p>
        <p>
          <strong>Mini-batch SGD</strong> splits the difference. You sample a small batch
          (typically 32&ndash;512 examples), average their gradients, and step. The resulting
          gradient is much less noisy than single-sample SGD, and you get many more steps
          per second than full-batch. Mini-batch SGD is what virtually every modern model
          uses in practice.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Roadmap for This Course">
        <p>
          <strong>Part 1 &mdash; Optimizers</strong> dives into the problems that plain SGD
          leaves unsolved and the algorithms that fix them:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Momentum &amp; Nesterov</strong> &mdash; smoothing noisy gradients and accelerating through flat regions.</li>
          <li><strong>Adaptive optimizers</strong> &mdash; AdaGrad, RMSProp, and Adam give each parameter its own effective learning rate.</li>
          <li><strong>Learning-rate schedules</strong> &mdash; starting large and shrinking over time to land precisely at a good minimum.</li>
          <li><strong>Convex vs. nonconvex</strong> &mdash; why the math is easy for convex problems and what saves us in deep nets.</li>
        </ul>
        <p>
          <strong>Part 2 &mdash; Regularization &amp; Theory</strong> asks the harder question:
          why does a good training loss translate into good test performance?
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>L1, L2, and Elastic Net</strong> &mdash; penalty terms that prevent overfitting and control model complexity.</li>
          <li><strong>MLE &amp; MAP</strong> &mdash; the probabilistic roots of training and the deep connection between regularization and priors.</li>
          <li><strong>Statistical learning theory</strong> &mdash; PAC learning, VC dimension, generalization bounds, and sample complexity.</li>
        </ul>
        <p>
          By the end you will be able to look at a training run and diagnose what is going
          wrong — and pick the right tool to fix it.
        </p>
      </ExplanationBox>
    </div>
  );
}
