'use client';

import ExplanationBox from '@/components/ExplanationBox';
import LayerCollapseDemo from '@/components/LayerCollapseDemo';

export default function Step11() {
  return (
    <div>
      <p>
        <strong>Where we are: </strong> Our rain neuron outputs a confidence level (≈35% for Cool Moisture) thanks to sigmoid.
        But sigmoid does more than just give us probabilities — it&apos;s what makes multi-layer networks
        actually useful. Without it, stacking layers does literally nothing.
      </p>

      <ExplanationBox title="Why Sigmoid Also Enables Deep Learning">
        <p>
          Sigmoid doesn&apos;t just give us nice probabilities — it&apos;s also what makes
          multi-layer networks actually work. Without it, adding more layers does literally
          nothing. Let&apos;s trace the same inputs through a 2-layer network both ways to see why.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Same Inputs, Same Weights — Two Different Networks">
        <p>
          We&apos;ll use <strong>temp = 0.7</strong> and <strong>humidity = 0.8 </strong> with the
          same weights in both networks. The only difference: one applies sigmoid after each
          layer, the other doesn&apos;t.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {/* WITHOUT SIGMOID */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>Without Sigmoid</h4>

            <div style={{ fontSize: '14px', lineHeight: '2' }}>
              <p><strong>Layer 1:</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                z = 0.7 × (-0.3) + 0.8 × 2.0 = <strong>1.39</strong>
                <br />
                output = 1.39 (no sigmoid, just pass it through)
              </div>

              <p><strong>Layer 2:</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                z = 1.39 × 0.5 = <strong>0.695</strong>
                <br />
                output = 0.695
              </div>

              <p style={{ marginTop: '0.75rem' }}><strong>But wait — can one layer do this?</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                Combined weights: [-0.3×0.5, 2.0×0.5] = [-0.15, 1.0]
                <br />
                One layer: 0.7×(-0.15) + 0.8×1.0 = <strong>0.695</strong>
              </div>

              <div style={{
                background: '#dc2626',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontFamily: 'inherit',
                fontWeight: 600
              }}>
                Same answer. The 2nd layer added nothing.
              </div>
            </div>
          </div>

          {/* WITH SIGMOID */}
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#16a34a' }}>With Sigmoid</h4>

            <div style={{ fontSize: '14px', lineHeight: '2' }}>
              <p><strong>Layer 1:</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                z = 0.7 × (-0.3) + 0.8 × 2.0 = 1.39
                <br />
                output = sigmoid(1.39) ≈ <strong>0.801</strong>
              </div>

              <p><strong>Layer 2:</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                z = 0.801 × 0.5 = 0.4005
                <br />
                output = sigmoid(0.4005) ≈ <strong>0.599</strong>
              </div>

              <p style={{ marginTop: '0.75rem' }}><strong>Can one layer do this?</strong></p>
              <div style={{ fontFamily: 'monospace', background: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                Try any weights you want — no single layer
                <br />
                can produce 0.599 from [0.7, 0.8].
              </div>

              <div style={{
                background: '#16a34a',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontFamily: 'inherit',
                fontWeight: 600
              }}>
                Can&apos;t be collapsed. Each layer truly adds power.
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop: '1rem' }}>
          Without sigmoid, multiplying by layer 2&apos;s weight is the same as just changing
          layer 1&apos;s weights — you can always combine them into one. Sigmoid breaks this by
          <em> warping</em> the numbers between layers. Once you squish 1.39 into 0.801, there&apos;s
          no way to &quot;un-squish&quot; it with a simple multiplication. The layers become
          fundamentally different steps, not redundant ones.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Means: One Line vs. Curved Boundaries">
        <p>
          Without sigmoid, no matter how many layers you stack, the network can only draw
          one straight line to separate &quot;rain&quot; from &quot;no rain&quot; — and every point on one
          side is 100% rain, every point on the other is 0%. No nuance, no in-between.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          With sigmoid, each layer adds curvature. The network can learn that rain needs
          humidity AND the right temperature — not too hot, not too cold. And instead of
          hard 0%/100% cutoffs, it gives actual probabilities: 88% chance, 23% chance, etc.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Play with the sliders below to see the difference. Notice how the linear graph only
          shows two flat colors (0% or 100%), while the sigmoid graph shows a smooth gradient
          of probabilities:
        </p>
        <LayerCollapseDemo />
      </ExplanationBox>

      <ExplanationBox title="Why Sigmoid Makes Each Layer 'Mean Something Different'">
        <p>
          Here&apos;s the key insight: sigmoid <strong>warps</strong> the numbers.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Without sigmoid, if layer 1 outputs 1.39, layer 2 just multiplies it.
          The 1.39 passes through unchanged in meaning — it&apos;s still just &quot;1.39&quot;.
        </p>
        <p style={{ marginTop: '1rem' }}>
          With sigmoid, that 1.39 gets transformed to 0.801. But here&apos;s the magic:
          sigmoid doesn&apos;t transform all numbers the same way. Small numbers get
          pushed toward 0.5. Big positive numbers get pushed toward 1. Big negative
          numbers get pushed toward 0.
        </p>
        <p style={{ marginTop: '1rem' }}>
          This &quot;warping&quot; means <strong>each layer&apos;s output now has a different meaning</strong>.
          Layer 1&apos;s output of 0.801 isn&apos;t just a number anymore — it&apos;s been squeezed
          into a range where it represents &quot;how confident am I about this first question?&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          When layer 2 receives 0.801, it&apos;s receiving a <em>confidence level</em>, not just
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
            Without sigmoid, you just get a raw number. Is −0.6 high? Is -2.3 low? Who knows!
            But sigmoid <strong>squishes everything into the 0-1 range</strong>, giving you actual probabilities.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Now instead of &quot;rain&quot; or &quot;no rain&quot;, you get <strong>&quot;≈35% confidence&quot;</strong>.
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

      <ExplanationBox title="How This Lets Us Check Multiple Conditions">
        <p>
          Because sigmoid keeps each layer&apos;s meaning separate, we can stack layers
          where each one asks a different question:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 1 asks: </strong> &quot;Is it warm enough for rain?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 2 asks: </strong> &quot;Is it too hot for rain?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Layer 3 asks:</strong> &quot;Is humidity high enough?&quot;
          <br />
          Outputs high confidence (near 1) if yes, low confidence (near 0) if no.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Final layer combines them: </strong> &quot;Warm enough AND not too hot AND humid?&quot;
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
          <strong>Without sigmoid: </strong> Your network can only learn one simple rule,
          no matter how many layers you add. &quot;If X is above some number, predict yes.&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>With sigmoid: </strong> Each layer can ask a new question. More layers
          means you can check more conditions. &quot;Is A true? Is B true? Is C true?
          Only if all of them, predict yes.&quot;
        </p>
        <p style={{ marginTop: '1rem' }}>
          That&apos;s why sigmoid (and activation functions like it) are essential.
          They let neural networks learn complex patterns instead of just simple rules.
        </p>
      </ExplanationBox>

      <p>
        <strong>Progress check: </strong> Our rain neuron with sigmoid converts z = −0.6 into ≈35% confidence.
        Sigmoid also enables multi-layer networks — each layer can ask a different question about the weather
        (is it humid? is it warm? are both true?), building up to a smarter final rain prediction.
        Next, we&apos;ll assemble the complete neuron function.
      </p>
    </div>
  );
}
