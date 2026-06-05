'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Why Math? Why Now?">
        <p>
          Machine learning can feel like magic: you feed data in, a model trains, and predictions
          come out. But behind every model is a small collection of mathematical ideas doing all the
          work. This course demystifies exactly those ideas — not in the abstract, but in the
          specific forms ML actually uses them.
        </p>
        <p>
          You don&apos;t need a university math background. You need middle-school algebra and
          curiosity. We will build everything else from scratch, step by step, with worked examples
          at every turn.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Course Covers">
        <p>
          Seven modules, three parts. Here is the full roadmap:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Part 1 — Functions &amp; Their Shapes</strong>
            <ul style={{ lineHeight: '1.8', marginTop: '4px' }}>
              <li><em>Algebra &amp; Functions</em> — what a function is, linear vs. nonlinear, composition.</li>
              <li><em>Exponentials</em> — the number e, exponential growth, sigmoid, softmax.</li>
              <li><em>Logarithms</em> — inverses of exponentials, log rules, log-likelihood, log loss.</li>
            </ul>
          </li>
          <li style={{ marginTop: '8px' }}>
            <strong>Part 2 — Calculus &amp; Optimization Glue</strong>
            <ul style={{ lineHeight: '1.8', marginTop: '4px' }}>
              <li><em>Derivatives &amp; Gradients</em> — slope, partial derivatives, the chain rule, gradient descent.</li>
              <li><em>Integrals</em> — area under a curve, probability as area, expected values.</li>
              <li><em>Convexity &amp; Optimization</em> — convex bowls, guaranteed minima, the full picture.</li>
            </ul>
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="How This Fits with the Other Courses">
        <p>
          The <strong>Linear Algebra</strong> course on this platform covers vectors, matrices, and
          dot products in depth — the language of data and layers. The <strong>Calculus</strong>{' '}
          course goes deep on derivatives and differentiation rules. The <strong>Probability</strong>{' '}
          course covers distributions, Bayes&apos; theorem, and statistical reasoning.
        </p>
        <p>
          This course fills the remaining prerequisite math and acts as the <em>glue</em>: it
          covers the algebra and function intuition those courses assume, adds exponentials,
          logarithms, integrals, and convexity, and shows clearly where each idea appears in ML.
          You can take these courses in any order, but if you are starting fresh, this one is a
          great first stop.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Principle to Keep in Mind">
        <p>
          Every formula in ML is trying to do one of two things: <strong>measure something</strong>{' '}
          (how wrong is the model? how likely is the data?) or <strong>improve something</strong>{' '}
          (move the weights in the direction that reduces error). All the math here serves one of
          those two goals. Keep that in mind and everything will feel motivated, not arbitrary.
        </p>
      </ExplanationBox>
    </div>
  );
}
