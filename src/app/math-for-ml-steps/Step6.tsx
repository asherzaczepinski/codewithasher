'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Integral as Accumulated Area">
        <p>
          If a derivative asks &quot;how fast is this function changing at this point?&quot;, an
          integral asks the reverse: &quot;how much does this function accumulate between these
          two points?&quot;
        </p>
        <p>
          Geometrically, the <strong>definite integral</strong> of f(x) from a to b is the area
          of the region bounded below by the x-axis and above by the curve f(x), between x = a
          and x = b.
        </p>

        <MathFormula label="Definite integral">
          Area = ∫ from a to b of f(x) dx
        </MathFormula>

        <p>
          The ∫ symbol (an elongated S for &quot;sum&quot;) and dx (an infinitesimally thin
          strip) remind us that we are summing infinitely many infinitely thin rectangles under
          the curve. This idea — dividing something into tiny pieces and adding them up — is the
          heart of integration.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fundamental Theorem of Calculus">
        <p>
          The deeply satisfying fact connecting derivatives and integrals: if F(x) is a function
          whose derivative is f(x) (we call F an <em>antiderivative</em> of f), then:
        </p>

        <MathFormula label="Fundamental theorem">
          ∫ from a to b of f(x) dx = F(b) − F(a)
        </MathFormula>

        <p>
          We rarely need this theorem directly in ML, but it tells us that integration and
          differentiation are two sides of the same coin — and it explains why probability
          densities, expected values, and normalising constants are all integrals.
        </p>
        <p>
          One useful antiderivative to remember: ∫ x^n dx = x^(n+1) / (n+1) + C. For our
          worked example we will use ∫ 2x dx = x².
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why ML Cares About Integrals">
        <p>
          <strong>Probability as area.</strong> A probability density function (PDF) p(x) does
          not directly give you a probability — it gives you a density. To get the actual
          probability that a random variable X falls in an interval [a, b], you integrate:
        </p>

        <MathFormula label="Probability from a density">
          P(a ≤ X ≤ b) = ∫ from a to b of p(x) dx
        </MathFormula>

        <p>
          The entire probability space must integrate to 1: ∫ from −∞ to +∞ of p(x) dx = 1.
          Every time you work with a Gaussian distribution or any continuous distribution, this
          is silently true in the background.
        </p>

        <p>
          <strong>Expected values.</strong> The expected (average) value of a function g(X) is:
        </p>

        <MathFormula label="Expected value">
          E[g(X)] = ∫ from −∞ to +∞ of g(x) · p(x) dx
        </MathFormula>

        <p>
          Expected values appear constantly in ML theory — expected loss, expected reward (in
          reinforcement learning), expected log-likelihood (in EM algorithms).
        </p>

        <p>
          <strong>Normalising constants.</strong> Bayesian models often produce an unnormalised
          distribution — one that does not integrate to 1 yet. The normalising constant (also
          called the partition function) is the integral of the unnormalised density. Computing
          it is often the hard part of Bayesian inference; approximations like MCMC and
          variational inference exist specifically to avoid computing it directly.
        </p>
      </ExplanationBox>

      <WorkedExample title="Area Under a Simple Curve">
        <p>
          Find the area under f(x) = 2x from x = 1 to x = 4.
        </p>
        <CalcStep number={1}>We need ∫ from 1 to 4 of 2x dx</CalcStep>
        <CalcStep number={2}>Find the antiderivative: F(x) = x² (since d/dx [x²] = 2x)</CalcStep>
        <CalcStep number={3}>Evaluate at the upper limit: F(4) = 4² = 16</CalcStep>
        <CalcStep number={4}>Evaluate at the lower limit: F(1) = 1² = 1</CalcStep>
        <CalcStep number={5}>Area = F(4) − F(1) = 16 − 1 = 15</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          We can verify this geometrically: f(x) = 2x is a straight line. The region from x = 1
          to x = 4 is a trapezoid with parallel sides of height 2 and 8 and width 3. Area = (2
          + 8) / 2 × 3 = 15. The integral gives the same answer — good.
        </p>
      </WorkedExample>

      <WorkedExample title="Checking a Probability Density">
        <p>
          Verify that the &quot;uniform&quot; density p(x) = 1 on the interval [0, 1] (and 0
          elsewhere) is a valid probability density — i.e., it integrates to 1.
        </p>
        <CalcStep number={1}>∫ from 0 to 1 of 1 dx</CalcStep>
        <CalcStep number={2}>Antiderivative of 1 is x: F(x) = x</CalcStep>
        <CalcStep number={3}>F(1) − F(0) = 1 − 0 = 1</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Confirmed: total probability is 1. Every probability density you encounter in ML — the
          Gaussian, the Bernoulli, the softmax distribution — satisfies this same requirement.
          The integral is the sanity check that keeps probability consistent.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We can approximate a definite integral numerically using the{' '}
          <strong>trapezoid rule</strong>: slice the area into thin trapezoids and sum them up.
          NumPy&apos;s <code>np.trapz</code> does this efficiently. The code below shows the
          trapezoid approximation and then uses it to verify that a probability density integrates
          to 1 — the fundamental sanity check for every distribution in ML.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="integrals_and_probability.py"
        caption="Approximating area with the trapezoid rule and verifying that a probability density integrates to 1."
        code={`import numpy as np

# --- Trapezoid rule: approximating a definite integral numerically ---
# Idea: divide [a, b] into n thin strips. Approximate each strip as a trapezoid.
# Area of one trapezoid = 0.5 * (f_left + f_right) * width.
# np.trapz(y, x) sums all these trapezoids automatically.

# Approximate the area under f(x) = 2x from x=1 to x=4.
# Exact answer (from the worked example above): 15.
a, b = 1.0, 4.0
n = 1000   # more strips -> better approximation

x = np.linspace(a, b, n)   # n evenly spaced x-values from a to b
y = 2 * x                  # evaluate f(x) = 2x at every x

area = np.trapz(y, x)   # sum of all tiny trapezoid areas
print("Approximated area:", round(area, 6))   # very close to 15.0
print("Exact answer:     ", 15.0)

# --- Verifying a probability density integrates to 1 ---
# A probability density function (PDF) must satisfy: integral over all x = 1.
# Otherwise probabilities would not add up correctly.

# Uniform distribution on [0, 1]: p(x) = 1 for x in [0,1], 0 elsewhere.
x_uniform = np.linspace(0, 1, 10000)
p_uniform  = np.ones_like(x_uniform)   # constant height of 1 everywhere
total_uniform = np.trapz(p_uniform, x_uniform)
print("Uniform PDF integrates to:", round(total_uniform, 6))   # 1.0

# --- Standard Normal (Gaussian) distribution ---
# The bell curve you see everywhere: p(x) = (1/sqrt(2*pi)) * e^(-x^2/2)
# The normalising constant 1/sqrt(2*pi) is chosen specifically so the area = 1.
x_norm = np.linspace(-5, 5, 100000)   # wide enough to capture essentially all area
p_norm  = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x_norm ** 2)   # Gaussian formula
total_norm = np.trapz(p_norm, x_norm)
print("Gaussian PDF integrates to:", round(total_norm, 6))   # very close to 1.0

# --- Probability as area: P(-1 <= X <= 1) for a standard Normal ---
# This is the famous "68% rule": ~68% of data lies within one standard deviation.
mask = (x_norm >= -1) & (x_norm <= 1)   # boolean index for the interval [-1, 1]
prob_one_sigma = np.trapz(p_norm[mask], x_norm[mask])
print("P(-1 <= X <= 1) under Gaussian:", round(prob_one_sigma, 4))   # ~0.6827`}
      />
    </div>
  );
}
