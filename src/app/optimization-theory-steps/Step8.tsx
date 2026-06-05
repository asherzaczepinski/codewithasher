'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="The Fundamental Question: Will It Generalize?">
        <p>
          We have optimized the loss on our training set. But the real test is whether the
          model works on <em>new data it has never seen</em>. Statistical learning theory is
          the mathematical framework that answers this question rigorously. It tells us:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Under what conditions can we guarantee that low training loss implies low test loss?</li>
          <li>How much data do we need for those guarantees to hold?</li>
          <li>How does model complexity affect the answer?</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="PAC Learning: Probably Approximately Correct">
        <p>
          The dominant theoretical framework is <strong>PAC learning</strong>, introduced by
          Leslie Valiant in 1984. A learning algorithm is PAC-learnable if, given enough data,
          it produces a hypothesis h that is approximately correct with high probability.
          Formally:
        </p>
        <p>
          For any &epsilon; &gt; 0 (the accuracy tolerance, how close to correct we need) and
          any &delta; &gt; 0 (the failure probability, how often we allow the algorithm to
          fail), there exists a sample size n(&epsilon;, &delta;) such that with n training
          examples, the learned hypothesis has test error at most &epsilon; with probability
          at least 1&minus;&delta;.
        </p>
        <p>
          <em>Probably</em> &mdash; the guarantee holds with probability 1&minus;&delta; over
          the random draw of the training set. <em>Approximately</em> &mdash; the error is at
          most &epsilon;, not necessarily zero.
        </p>
      </ExplanationBox>

      <MathFormula label="PAC sample complexity (finite hypothesis class)">
        n &ge; (1/&epsilon;) &times; (log|H| + log(1/&delta;))
      </MathFormula>

      <ExplanationBox title="VC Dimension: Measuring Model Capacity">
        <p>
          For infinite hypothesis classes (like neural networks, which have a continuous
          parameter space), the size |H| is infinite and the formula above breaks down. We need
          a different measure of complexity. Enter <strong>VC dimension</strong> (Vapnik &amp;
          Chervonenkis, 1971), named for its inventors.
        </p>
        <p>
          The VC dimension of a hypothesis class H is the size of the largest set of points
          that H can <em>shatter</em>. A set of m points is shattered if, for every possible
          labeling of those m points (there are 2^m of them), there exists some h in H that
          assigns exactly that labeling.
        </p>
        <p>
          Intuitively, VC dimension measures how flexible H is &mdash; how many different
          patterns it can represent. A class with higher VC dimension is more expressive but
          also harder to control.
        </p>
      </ExplanationBox>

      <WorkedExample title="VC Dimension of Linear Classifiers in 2D">
        <CalcStep number={1}>
          Can a line shatter 2 points? Yes. Any labeling of 2 points (00, 01, 10, 11) can be
          realized by some line. The line just needs to separate the two points correctly.
        </CalcStep>
        <CalcStep number={2}>
          Can a line shatter 3 points? Yes, as long as the 3 points are not collinear. For
          any of the 8 labelings, a line can be found that correctly classifies all three.
        </CalcStep>
        <CalcStep number={3}>
          Can a line shatter 4 points? No. Place 4 points at the corners of a square and
          label alternate corners positive (like a checkerboard). No single line can separate
          the two diagonal positive corners from the two diagonal negative corners.
        </CalcStep>
        <CalcStep number={4}>
          Therefore: VC dimension of linear classifiers in 2D = 3. In general, linear
          classifiers in d dimensions have VC dimension d+1.
        </CalcStep>
      </WorkedExample>

      <ExplanationBox title="Generalization Bounds">
        <p>
          With VC dimension d_VC and n training examples, the <strong>VC generalization
          bound</strong> guarantees that with probability at least 1&minus;&delta;:
        </p>
      </ExplanationBox>

      <MathFormula label="VC generalization bound (simplified)">
        error_test &le; error_train + &radic;( (d_VC &times; log(n/d_VC) + log(1/&delta;)) / n )
      </MathFormula>

      <ExplanationBox title="Reading the Bound">
        <p>
          The bound has two terms. The first is the training error &mdash; how well the model
          fits the data. The second is the <strong>complexity penalty</strong> &mdash; a gap
          that grows with VC dimension and shrinks with sample size. The sum is a guaranteed
          upper bound on test error.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>More data (larger n)</strong> &mdash; the gap shrinks. The test error
            approaches the training error. Generalization improves.
          </li>
          <li>
            <strong>Higher capacity (larger d_VC)</strong> &mdash; the gap grows. Even if
            training error is zero, test error could be large. This is overfitting.
          </li>
          <li>
            <strong>Lower training error</strong> &mdash; the total bound decreases. Fit the
            data better without increasing complexity.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Sample Complexity: How Much Data Do You Need?">
        <p>
          Rearranging the VC bound gives <strong>sample complexity</strong>: the number of
          training examples needed to guarantee &epsilon; generalization error with probability
          1&minus;&delta;.
        </p>
      </ExplanationBox>

      <MathFormula label="Sample complexity (VC-based, order of magnitude)">
        n = O( (d_VC + log(1/&delta;)) / &epsilon;&sup2; )
      </MathFormula>

      <ExplanationBox title="The Core Intuition">
        <p>
          More capacity means you need more data to generalize. A linear classifier in 10
          dimensions has VC dimension 11 and needs O(11/&epsilon;&sup2;) examples. A deep
          neural network with millions of parameters has an enormous VC dimension and in
          principle needs astronomically more data &mdash; yet in practice it generalizes
          well with far less than the bound suggests.
        </p>
        <p>
          This is an active research puzzle. The classical VC bounds are <em>worst-case</em>
          bounds and are often very loose. Modern explanations invoke implicit regularization
          from gradient descent (which prefers simpler solutions), the structure of real data
          (which lives on low-dimensional manifolds), and the phenomenon of
          <strong> benign overfitting</strong> (overparameterized models can interpolate all
          training data and still generalize). The theory is still catching up to practice.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Tying It Back to Bias and Variance">
        <p>
          The VC bound formalizes the bias-variance trade-off you already know intuitively:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>High bias (underfitting)</strong> &mdash; low capacity, large training error.
            The first term dominates the bound. No amount of data will help if the model
            cannot represent the true function.
          </li>
          <li>
            <strong>High variance (overfitting)</strong> &mdash; high capacity, small training
            error, but large complexity penalty. The second term dominates. More data directly
            reduces this gap.
          </li>
          <li>
            <strong>Sweet spot</strong> &mdash; the right capacity for the amount of data you
            have. Both terms are small. This is where regularization, early stopping, and
            careful model selection aim to place you.
          </li>
        </ul>
        <p>
          You now have the complete picture: from the optimizer that descends the loss surface,
          to the regularizer that constrains the model, to the statistical theory that explains
          when and why the resulting model will work on new data. These are not separate ideas
          &mdash; they are one coherent story about how learning happens.
        </p>
      </ExplanationBox>
    </div>
  );
}
