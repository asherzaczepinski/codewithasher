'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Three Operations, One Idea">
        <p>
          Vectors aren&apos;t just static lists of numbers — we can <strong>combine</strong> them and
          <strong> scale</strong> them. These operations are what make vectors genuinely useful: they let
          us express &quot;move from one data point toward another&quot; or &quot;make all features
          twice as influential&quot; in a single, clean notation.
        </p>
        <p>
          There are three fundamental operations: <strong>addition</strong>, <strong>subtraction</strong>,
          and <strong>scalar multiplication</strong>. All three follow the same golden rule —
          <em> operate component by component</em>.
        </p>
      </ExplanationBox>

      <MathFormula label="Vector Addition">
        a + b = [a₁ + b₁,  a₂ + b₂,  ...,  aₙ + bₙ]
      </MathFormula>

      <ExplanationBox title="Addition: Combining Two Houses">
        <p>
          Adding two vectors means adding each pair of matching components. Geometrically, it&apos;s
          the &quot;tip-to-tail&quot; rule: place the second arrow at the tip of the first and draw
          a new arrow from the origin to the new tip. The result is a third vector pointing to a new
          location in feature space.
        </p>
        <p>
          In our house example, adding two house vectors doesn&apos;t represent a real estate transaction —
          it&apos;s a mathematical stepping stone. But the same operation <em>does</em> have direct
          meaning when we talk about updating model weights during training: a gradient vector is
          added (with a negative sign) to the current weight vector to nudge it in the right direction.
        </p>
      </ExplanationBox>

      <MathFormula label="Scalar Multiplication">
        c · v = [c·v₁,  c·v₂,  ...,  c·vₙ]
      </MathFormula>

      <ExplanationBox title="Scalar Multiplication: Stretching or Flipping">
        <p>
          A <strong>scalar</strong> is just a plain number (no list, no grid). Multiplying a vector by
          a scalar stretches or shrinks the arrow without changing its direction. Multiply by −1 and
          you flip it to point the opposite way.
        </p>
        <p>
          This is exactly what happens in gradient descent: the <strong>learning rate</strong> is a
          scalar that multiplies the gradient vector, controlling how big a step the model takes.
          A learning rate of 0.01 means &quot;take 1% of the gradient step.&quot;
        </p>
      </ExplanationBox>

      <WorkedExample title="Adding and Scaling House Vectors">
        <p>
          We have two house listings and a scalar (the learning rate, for illustration). Let:
        </p>
        <ul style={{ lineHeight: '1.9', marginBottom: '0.75rem' }}>
          <li><strong>h₁ = [1400, 3, 2, 0.8]</strong> — House 1 (sqft, beds, baths, km-to-school)</li>
          <li><strong>h₂ = [900, 2, 1, 1.5]</strong> — House 2</li>
          <li><strong>c = 0.5</strong> — scalar</li>
        </ul>

        <CalcStep number={1}>Compute h₁ + h₂ component by component:</CalcStep>
        <CalcStep number={2}>sqft: 1400 + 900 = 2300</CalcStep>
        <CalcStep number={3}>beds: 3 + 2 = 5</CalcStep>
        <CalcStep number={4}>baths: 2 + 1 = 3</CalcStep>
        <CalcStep number={5}>km-to-school: 0.8 + 1.5 = 2.3</CalcStep>
        <CalcStep number={6}>Result: h₁ + h₂ = [2300, 5, 3, 2.3]</CalcStep>
        <CalcStep number={7}>Now compute 0.5 · h₁ — multiply every component by 0.5:</CalcStep>
        <CalcStep number={8}>sqft: 0.5 × 1400 = 700</CalcStep>
        <CalcStep number={9}>beds: 0.5 × 3 = 1.5</CalcStep>
        <CalcStep number={10}>baths: 0.5 × 2 = 1.0</CalcStep>
        <CalcStep number={11}>km-to-school: 0.5 × 0.8 = 0.4</CalcStep>
        <CalcStep number={12}>Result: 0.5 · h₁ = [700, 1.5, 1.0, 0.4]</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice that scaling h₁ by 0.5 halved every feature uniformly — it represents a house that
          is proportionally half the size in every dimension. That &quot;uniform scaling&quot; intuition
          is exactly why the learning rate scalar works: it scales the entire gradient step, not just
          one weight at a time.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          All three operations — addition, subtraction, and scalar multiplication — are a single
          operator in NumPy. Python&apos;s <code>+</code>, <code>-</code>, and <code>*</code> work
          componentwise on arrays automatically.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="linalg.py"
        caption="Vector addition, subtraction, and scalar multiplication are all componentwise in NumPy."
        code={`import numpy as np

# Two house feature vectors: [sqft, beds, baths, km_to_school]
h1 = np.array([1400, 3, 2, 0.8])
h2 = np.array([900, 2, 1, 1.5])

# --- Addition ---
# The + operator adds matching components: h1[0]+h2[0], h1[1]+h2[1], ...
# No loop needed; NumPy handles every component at once.
h_sum = h1 + h2
print("h1 + h2:", h_sum)
# -> [2300, 5, 3, 2.3]

# --- Subtraction ---
# Subtraction works exactly the same way, component by component.
# This gives the "difference vector" pointing from h2 to h1 in feature space.
h_diff = h1 - h2
print("h1 - h2:", h_diff)
# -> [500, 1, 1, -0.7]

# --- Scalar multiplication ---
# A plain Python number times a NumPy array scales every component equally.
# This is exactly what the learning rate does to a gradient vector during training.
lr = 0.5   # scalar (learning rate in this illustration)
scaled = lr * h1
print("0.5 * h1:", scaled)
# -> [700.0, 1.5, 1.0, 0.4]

# All three operations produce a NEW vector; the originals are unchanged.
print("h1 still:", h1)
# -> [1400, 3, 2, 0.8]  -- untouched`}
      />
    </div>
  );
}
