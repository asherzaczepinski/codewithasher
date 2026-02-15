'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import LayerCollapseDemo from '@/components/LayerCollapseDemo';

export default function Step10() {
  return (
    <div>
      <ExplanationBox title="Why Sigmoid Also Enables Deep Learning">
        <p>
          Sigmoid doesn&apos;t just give us nice probabilities — it&apos;s also what makes
          multi-layer networks actually work. Let&apos;s see this with our weather example.
        </p>
      </ExplanationBox>

      <WorkedExample title="Without Sigmoid: Layers Collapse">
        <p>Imagine a two-layer network for rain prediction, but WITHOUT sigmoid:</p>

        <p style={{ marginTop: '1rem' }}><strong>Layer 1:</strong></p>
        <CalcStep number={1}>Input: [temp=0.7, humid=0.8], weights=[-0.3, 0.9]</CalcStep>
        <CalcStep number={2}>Output: 0.7×(-0.3) + 0.8×0.9 = 0.51</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Layer 2:</strong></p>
        <CalcStep number={3}>Input: 0.51, weight=0.5</CalcStep>
        <CalcStep number={4}>Output: 0.51 × 0.5 = 0.255</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>But here&apos;s the problem:</strong></p>
        <p>
          We can get the EXACT same result with just ONE layer using combined weights:
        </p>
        <CalcStep number={5}>Combined weights: [-0.3×0.5, 0.9×0.5] = [-0.15, 0.45]</CalcStep>
        <CalcStep number={6}>Single layer: 0.7×(-0.15) + 0.8×0.45 = 0.255</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          <strong>Same answer!</strong> The second layer did nothing useful. We wasted
          computation on a layer that added zero capability.
        </p>
      </WorkedExample>

      <WorkedExample title="With Sigmoid: Each Layer Adds Power">
        <p>Now the SAME network, but with sigmoid after each layer:</p>

        <p style={{ marginTop: '1rem' }}><strong>Layer 1:</strong></p>
        <CalcStep number={1}>Linear: 0.7×(-0.3) + 0.8×0.9 = 0.51</CalcStep>
        <CalcStep number={2}>After sigmoid: sigmoid(0.51) = 0.625</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Layer 2:</strong></p>
        <CalcStep number={3}>Linear: 0.625 × 0.5 = 0.3125</CalcStep>
        <CalcStep number={4}>After sigmoid: sigmoid(0.3125) = 0.578</CalcStep>

      </WorkedExample>

      <ExplanationBox title="But Real Weather Doesn't Follow One Simple Rule">
        <p>
          Real rain depends on <strong>combinations</strong> of things:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li>High humidity AND moderate temperature → rain</li>
          <li>High humidity BUT freezing cold → snow, not rain</li>
          <li>High humidity BUT extremely hot → the moisture evaporates, no rain</li>
          <li>Low humidity → no rain, regardless of temperature</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          See how the answer depends on checking multiple conditions together?
          A single layer can&apos;t do this. It can only check one thing at a time.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Sigmoid Makes Each Layer 'Mean Something Different'">
        <p>
          Here&apos;s the key insight: sigmoid <strong>warps</strong> the numbers.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Without sigmoid, if layer 1 outputs 0.51, layer 2 just multiplies it.
          The 0.51 passes through unchanged in meaning — it&apos;s still just &quot;0.51&quot;.
        </p>
        <p style={{ marginTop: '1rem' }}>
          With sigmoid, that 0.51 gets transformed to 0.625. But here&apos;s the magic:
          sigmoid doesn&apos;t transform all numbers the same way. Small numbers get
          pushed toward 0.5. Big positive numbers get pushed toward 1. Big negative
          numbers get pushed toward 0.
        </p>
        <p style={{ marginTop: '1rem' }}>
          This &quot;warping&quot; means <strong>each layer&apos;s output now has a different meaning</strong>.
          Layer 1&apos;s output of 0.625 isn&apos;t just a number anymore — it&apos;s been squeezed
          into a range where it represents &quot;how confident am I about this first question?&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          When layer 2 receives 0.625, it&apos;s receiving a <em>confidence level</em>, not just
          a raw number. It can then ask its own question and output its own confidence.
          The layers stay separate because each one is working with transformed,
          meaningful values — not just raw numbers that can be collapsed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Two Big Things Sigmoid Does">
        <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
          Sigmoid isn&apos;t just a fancy mathematical trick — it fundamentally changes what neural networks can do:
        </p>

        <div style={{
          background: '#f0f9ff',
          border: '2px solid #0ea5e9',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0369a1' }}>
            1. True Probabilities, Not Just Yes/No
          </h4>
          <p>
            Without sigmoid, you just get a raw number. Is 0.61 high? Is -2.3 low? Who knows!
            But sigmoid <strong>squishes everything into the 0-1 range</strong>, giving you actual probabilities.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Now instead of &quot;rain&quot; or &quot;no rain&quot;, you get <strong>&quot;64.8% chance of rain&quot;</strong>.
            That&apos;s real information you can use! You could still take derivatives from the slope
            to measure certainty, but sigmoid condenses everything into one intuitive probability value.
          </p>
        </div>

        <div style={{
          background: '#fdf4ff',
          border: '2px solid #c026d3',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#a21caf' }}>
            2. Curved Boundaries That Can Learn Complex Patterns
          </h4>
          <p>
            This is where it gets interesting. When we &quot;squish&quot; the function down, different
            input values get squished by different amounts. This creates <strong>curvature</strong>.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Think about our 2D temperature/humidity graph. With a linear function, you can only
            draw one straight line to divide &quot;rain&quot; from &quot;no rain&quot;. That&apos;s pretty limiting!
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            But with sigmoid&apos;s curvature, the boundary can <strong>bend and curve</strong> to
            capture more complex relationships. The network can learn that rain happens when
            it&apos;s humid AND warm, but NOT when it&apos;s too hot (even if humid).
          </p>
        </div>

        <div style={{
          background: '#fefce8',
          border: '2px solid #ca8a04',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#a16207' }}>
            What About Higher Dimensions?
          </h4>
          <p>
            Our weather example uses 2 inputs (temperature, humidity), so we can visualize it
            on a 2D graph. But real neural networks might have 4, 100, or even millions of inputs!
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            With 3 inputs, you&apos;d need a 3D space. With 4 inputs, a 4D space (which we can&apos;t
            visualize!). This is where <strong>Euclidean geometry</strong> comes in — it&apos;s the
            math that lets us work with distances and boundaries in any number of dimensions.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            The cool part: sigmoid&apos;s curvature works the same way in 4D, 100D, or any dimension.
            Instead of a curved line, you get a curved &quot;hypersurface&quot; that can divide up the
            space in complex ways. Each neuron carves out its own region, and stacking layers
            lets you combine these regions into incredibly sophisticated decision boundaries.
          </p>
          <p style={{ marginTop: '0.75rem', fontStyle: 'italic', color: '#666' }}>
            Example: To find how &quot;far&quot; a point is from a decision boundary in 4D, you use
            the Euclidean distance formula: √(x₁² + x₂² + x₃² + x₄²). The math scales perfectly!
          </p>
        </div>
      </ExplanationBox>

      <ExplanationBox title="See It For Yourself">
        <p>
          Play with the sliders below. Watch how the linear version always collapses
          to one layer, but the sigmoid version creates something unique. Notice how
          the sigmoid graph shows a <strong>gradient of colors</strong> — that&apos;s the
          probability changing smoothly, not just jumping between &quot;rain&quot; and &quot;no rain&quot;:
        </p>
        <LayerCollapseDemo />
      </ExplanationBox>

      <ExplanationBox title="How This Lets Us Check Multiple Conditions">
        <p>
          Because sigmoid keeps each layer&apos;s meaning separate, we can stack layers
          where each one asks a different question:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 1 asks:</strong> &quot;Is it warm enough for rain?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 2 asks:</strong> &quot;Is it too hot for rain?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 3 asks:</strong> &quot;Is humidity high enough?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Final layer combines them:</strong> &quot;Warm enough AND not too hot AND humid?&quot;
          <br />
          Only if ALL conditions are right, predict rain.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Without sigmoid, all these layers would mathematically collapse into one.
          You&apos;d be stuck with one simple rule. Sigmoid is what keeps each layer&apos;s
          question separate and meaningful.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Simple Summary">
        <p>
          <strong>Without sigmoid:</strong> Your network can only learn one simple rule,
          no matter how many layers you add. &quot;If X is above some number, predict yes.&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>With sigmoid:</strong> Each layer can ask a new question. More layers
          means you can check more conditions. &quot;Is A true? Is B true? Is C true?
          Only if all of them, predict yes.&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          That&apos;s why sigmoid (and activation functions like it) are essential.
          They let neural networks learn complex patterns instead of just simple rules.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Complete Picture So Far">
        <p>
          You now have all the pieces for a complete neuron:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Inputs</strong> — temperature (0.7) and humidity (0.8)</li>
          <li><strong>Weights</strong> — how much each input matters (-0.3 and 0.9)</li>
          <li><strong>Bias</strong> — the baseline tendency (0.1)</li>
          <li><strong>Weighted sum + bias</strong> — gives us z = 0.61</li>
          <li><strong>Sigmoid</strong> — converts z to probability = 0.648 (64.8%)</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          In the next step, we&apos;ll combine all these pieces into a single, reusable
          <code>neuron()</code> function. Then we&apos;ll build layers of neurons and
          connect them into a full network!
        </p>
      </ExplanationBox>
    </div>
  );
}
