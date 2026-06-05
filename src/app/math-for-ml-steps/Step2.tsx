'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Variables and Equations">
        <p>
          A <strong>variable</strong> is just a named placeholder for a number we don&apos;t know
          yet — or a number that can change. When we write x = 3, we are saying &quot;the variable
          x holds the value 3 right now.&quot;
        </p>
        <p>
          An <strong>equation</strong> is a statement that two expressions are equal. The goal of
          algebra is usually to find the value of a variable that makes the equation true.
        </p>

        <MathFormula label="Example equation">
          2x + 5 = 11 &nbsp;&nbsp;→&nbsp;&nbsp; x = 3
        </MathFormula>

        <p>
          In ML, variables appear everywhere: x might be a pixel value, w a weight, b a bias. We
          are always solving for the values that make the model perform best.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Is a Function?">
        <p>
          A <strong>function</strong> is an input-output machine. You put one number in; exactly
          one number comes out. We write f(x) = ... to describe the rule.
        </p>

        <MathFormula label="A simple function">
          f(x) = 3x - 2
        </MathFormula>

        <p>
          Feed in x = 4: the machine computes 3 × 4 − 2 = 10 and outputs 10. Feed in x = 0: it
          outputs −2. The function is the <em>rule</em>; the output depends entirely on the input.
        </p>
        <p>
          Two key terms: the set of allowed inputs is the <strong>domain</strong>, and the set of
          possible outputs is the <strong>range</strong>. For f(x) = 3x − 2, both are all real
          numbers. For f(x) = 1/x the domain excludes zero (you cannot divide by zero).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Linear vs. Nonlinear Functions">
        <p>
          A <strong>linear function</strong> has the form f(x) = mx + b. Its graph is a straight
          line. m is the slope (how steeply it rises) and b is the y-intercept (where it crosses
          the vertical axis).
        </p>

        <MathFormula label="Linear function">
          f(x) = mx + b &nbsp;&nbsp;(slope m, intercept b)
        </MathFormula>

        <p>
          A <strong>nonlinear function</strong> bends — its graph is a curve, not a line. The most
          important nonlinear functions in ML include:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Quadratic</strong>: f(x) = x² — a parabola, key for understanding loss landscapes.</li>
          <li><strong>Sigmoid</strong>: f(x) = 1 / (1 + e^(−x)) — squashes any number into (0, 1). Used in logistic regression and as a neuron activation.</li>
          <li><strong>ReLU</strong>: f(x) = max(0, x) — outputs x for positive inputs, zero otherwise. The most common activation in deep networks.</li>
        </ul>
        <p>
          Why does nonlinearity matter? A model made of only linear functions is itself linear,
          no matter how many layers it has. Nonlinear activations are what let networks learn
          curved, complex decision boundaries.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Composing Functions">
        <p>
          <strong>Function composition</strong> means chaining functions: the output of one becomes
          the input of the next. We write (g ∘ f)(x) = g(f(x)), read &quot;g of f of x.&quot;
        </p>

        <MathFormula label="Composition">
          h(x) = g(f(x))
        </MathFormula>

        <p>
          A neural network is literally a long chain of composed functions: each layer applies a
          linear transformation and then a nonlinear activation. Understanding composition is
          essential for understanding why the chain rule (coming in Module 5) is needed to train
          such networks.
        </p>
      </ExplanationBox>

      <WorkedExample title="Evaluating and Composing Functions">
        <p>
          Let f(x) = 2x + 1 and g(x) = x². We want to find g(f(3)).
        </p>
        <CalcStep number={1}>Evaluate the inner function first: f(3) = 2 × 3 + 1 = 7</CalcStep>
        <CalcStep number={2}>Feed that result into the outer function: g(7) = 7² = 49</CalcStep>
        <CalcStep number={3}>So g(f(3)) = 49</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice: if we reversed the order, f(g(3)) = f(9) = 2 × 9 + 1 = 19, which is completely
          different. <strong>Order of composition matters</strong> — just like the order of layers
          in a neural network matters.
        </p>
      </WorkedExample>

      <WorkedExample title="Finding the Domain">
        <p>
          Suppose a model uses the function f(x) = 1 / (x − 5). What values of x are allowed?
        </p>
        <CalcStep number={1}>Division by zero is undefined, so we need x − 5 ≠ 0.</CalcStep>
        <CalcStep number={2}>Solving: x ≠ 5.</CalcStep>
        <CalcStep number={3}>Domain: all real numbers except x = 5.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          In ML, domain restrictions often appear as numerical stability concerns — for example,
          log(x) requires x &gt; 0, so we add a tiny constant (log(x + ε)) to avoid feeding zero
          to a logarithm. You will see this in Module 4.
        </p>
      </WorkedExample>
    </div>
  );
}
