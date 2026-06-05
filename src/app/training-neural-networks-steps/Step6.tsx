'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Problem with Going Very Deep">
        <p>
          We know deeper networks can represent more complex functions. But in practice,
          simply stacking more layers makes training harder, not easier. Before residual
          connections were invented, networks deeper than about 20 layers would
          consistently perform <em>worse</em> than shallower networks — not because of
          overfitting, but because of pure optimization difficulty. The gradients
          reaching the early layers were too small to drive any learning.
        </p>
        <p>
          In 2015, Kaiming He and colleagues proposed a strikingly simple fix: let the
          network learn modifications to the identity, rather than learning arbitrary
          transformations from scratch.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Skip Connection Idea">
        <p>
          A standard layer computes: <strong>output = F(x)</strong>, where F is a stack
          of weight matrices, biases, and activation functions. The layer must learn
          whatever transformation is useful.
        </p>
        <p>
          A <strong>residual block</strong> adds the input directly to the output of F:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', margin: '8px 0' }}>
          output = F(x) + x
        </p>
        <p>
          Now the layer only needs to learn the <em>residual</em> — how much to deviate
          from the identity. If the optimal transformation for a layer is close to the
          identity (which is often true, especially early in training), F just needs to
          output near-zero, which is easy. Without the skip, F would need to reconstruct
          the identity mapping from scratch, which is hard.
        </p>
      </ExplanationBox>

      <MathFormula label="Residual block output">
        y = F(x, W) + x
      </MathFormula>

      <ExplanationBox title="How Skip Connections Fix the Gradient Problem">
        <p>
          The skip connection creates a <strong>gradient highway</strong>. When the
          backward pass reaches a residual block, it computes:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', margin: '8px 0' }}>
          dL/dx = dL/dy * (dF/dx + 1)
        </p>
        <p>
          The +1 term comes from differentiating the skip connection x with respect to x.
          This means that even if dF/dx is nearly zero (vanishing gradient through the
          learned path), the gradient still flows back unchanged through the skip. The
          gradient of x is at least as large as the gradient of y — it cannot vanish
          through a residual block.
        </p>
        <p>
          This is why ResNets (Residual Networks) with 50, 100, or even 1000 layers can
          be trained successfully, while plain deep networks of the same depth cannot.
        </p>
      </ExplanationBox>

      <WorkedExample title="Forward and Backward Through a Residual Block">
        <p>
          Our MLP adds a residual block with two linear layers. Let x = 0.6. The block
          computes F(x) = W2 * ReLU(W1 * x) with W1 = 0.5, W2 = 0.4.
        </p>

        <CalcStep number={1}>Inner pre-activation: z1 = W1 * x = 0.5 * 0.6 = 0.30</CalcStep>
        <CalcStep number={2}>Inner activation: a1 = ReLU(0.30) = 0.30</CalcStep>
        <CalcStep number={3}>F(x) = W2 * a1 = 0.4 * 0.30 = 0.12</CalcStep>
        <CalcStep number={4}>Residual block output: y = F(x) + x = 0.12 + 0.6 = 0.72</CalcStep>
        <CalcStep number={5}>Suppose dL/dy = 0.5 (gradient flowing in from later layers)</CalcStep>
        <CalcStep number={6}>Gradient through F path: dL/dy * dF/dx = 0.5 * (W2 * 1 * W1) = 0.5 * (0.4 * 0.5) = 0.5 * 0.2 = 0.10</CalcStep>
        <CalcStep number={7}>Gradient through skip path: dL/dy * 1 = 0.5 * 1 = 0.50</CalcStep>
        <CalcStep number={8}>Total gradient dL/dx = 0.10 + 0.50 = 0.60</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Without the skip connection, only 0.10 would flow back to earlier layers — a
          fifth of the incoming gradient. With the skip, 0.60 flows back — more than the
          incoming signal at the forward path alone. Earlier layers receive strong,
          reliable gradients.
        </p>
      </WorkedExample>

      <ExplanationBox title="Practical Considerations">
        <p>
          For the skip connection output = F(x) + x to work, F(x) and x must have the
          same dimensions. In practice:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Same dimensions:</strong> add directly, no modification needed.
          </li>
          <li>
            <strong>Different dimensions</strong> (e.g., when changing layer width or
            downsampling): multiply x by a learned projection matrix W_s so that
            output = F(x) + W_s * x.
          </li>
        </ul>
        <p>
          Residual connections are now standard practice in image models (ResNet),
          language models (Transformers use them between every attention and feed-forward
          block), and nearly every state-of-the-art deep network. Once you know to look,
          you will see them everywhere.
        </p>
      </ExplanationBox>
    </div>
  );
}
