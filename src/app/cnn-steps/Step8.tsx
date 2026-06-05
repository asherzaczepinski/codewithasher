'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Putting the Pieces Together">
        <p>
          Every CNN is built from the same small vocabulary of operations you have now learned:
          convolution, ReLU activation, pooling, and finally fully-connected layers for
          classification. The art lies in deciding how many of each to stack and in what order.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Classic Stack">
        <p>
          The fundamental repeating unit of a CNN is:
        </p>
        <div style={{ background: '#f5f7ff', border: '1px solid #c5ccee', borderRadius: '8px', padding: '1rem 1.25rem', margin: '0.75rem 0', fontFamily: 'monospace', lineHeight: '2' }}>
          Input Image<br />
          ↓<br />
          Conv (learned filters) → ReLU → Pool<br />
          ↓<br />
          Conv (more filters, deeper features) → ReLU → Pool<br />
          ↓<br />
          Conv → ReLU → Pool  (repeat as needed)<br />
          ↓<br />
          Flatten (or Global Average Pool)<br />
          ↓<br />
          Dense (fully-connected) layer<br />
          ↓<br />
          Softmax → class probabilities
        </div>
        <p>
          Each Conv → ReLU → Pool block reduces spatial size while increasing depth (more feature
          maps). By the time you reach the flatten step you have a compact but rich descriptor of
          what the image contains.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why ReLU After Convolution?">
        <p>
          The convolution is a linear operation. Stack two linear operations and you still have a
          linear operation — the whole stack collapses to a single matrix multiply. To give the
          network the ability to learn non-linear decision boundaries (which you need to distinguish
          a 7 from a 1 from a 4), we apply a non-linear activation after every convolution.
        </p>
        <p>
          <strong>ReLU</strong> (Rectified Linear Unit) is the standard choice: it outputs 0 for
          any negative value and passes positive values through unchanged. It is fast to compute and
          does not suffer from the vanishing-gradient problems of sigmoid at large values. Negative
          filter responses (the filter did not match) are zeroed out; positive responses (good match)
          are kept as-is.
        </p>
      </ExplanationBox>

      <MathFormula label="ReLU activation">
        ReLU(x) = max(0, x)
      </MathFormula>

      <ExplanationBox title="What Each Layer Learns">
        <p>
          The depth of features extracted grows with each convolutional block:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Layer 1</strong> — edge detectors: horizontal bars, vertical strokes, diagonal lines, colour transitions</li>
          <li><strong>Layer 2</strong> — combinations of edges: corners, curves, T-junctions, simple textures</li>
          <li><strong>Layer 3+</strong> — parts of shapes: the closed loop of a 0, the two bumps of an 8, the crossing strokes of a 7</li>
          <li><strong>Final dense layers</strong> — global composition: &quot;this arrangement of parts means digit 7 with high confidence&quot;</li>
        </ul>
        <p>
          This hierarchical feature extraction is the reason CNNs generalise so well. They do not
          memorise specific pixel patterns; they decompose images into increasingly abstract
          building blocks.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Back to Our Digit: End to End">
        <p>
          Let&apos;s trace our 5 × 5 handwritten 7 through the full pipeline:
        </p>
        <ol style={{ lineHeight: '2.2' }}>
          <li>
            <strong>Input</strong>: 5 × 5 × 1 grayscale tensor (25 numbers)
          </li>
          <li>
            <strong>Conv (8 filters, 3×3, no padding)</strong>: produces 8 feature maps of size
            3 × 3 → tensor 3 × 3 × 8
          </li>
          <li>
            <strong>ReLU</strong>: zeros out any negative convolution output — 3 × 3 × 8 tensor
            unchanged in shape
          </li>
          <li>
            <strong>2×2 Max Pool</strong>: spatial size halves → but 3 is odd, so with this tiny
            image we might skip pooling or use global average pool directly
          </li>
          <li>
            <strong>Flatten</strong>: 3 × 3 × 8 = 72 values in a 1-D vector
          </li>
          <li>
            <strong>Dense (10 neurons)</strong>: one per digit class (0–9); each combines all
            72 values with learned weights
          </li>
          <li>
            <strong>Softmax</strong>: converts the 10 raw scores to probabilities that sum to 1;
            the highest probability is the predicted digit
          </li>
        </ol>
        <p>
          Training adjusts both the filter weights (via backpropagation through the convolutions)
          and the dense layer weights until the network reliably outputs high probability for the
          correct digit.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From Pixels to Perception">
        <p>
          You have now seen the full picture. CNNs are not magic — they are a principled stack of
          local dot products, non-linearities, and downsampling operations, with all the weights
          learned from data. The same architecture that classifies our tiny hand-drawn 7 scales,
          with more layers and filters, to recognise faces, detect tumours in MRI scans, and
          identify objects in real-time video.
        </p>
        <p>
          Every time you see a CNN perform a seemingly &quot;intelligent&quot; visual task, you now
          know exactly what is happening at each layer: convolutions detecting local patterns,
          ReLUs enforcing non-linearity, pooling building translation invariance, and dense layers
          making the final global judgement. The mystery is gone — the math is yours.
        </p>
      </ExplanationBox>
    </div>
  );
}
