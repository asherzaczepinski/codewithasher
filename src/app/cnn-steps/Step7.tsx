'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Problem Pooling Solves">
        <p>
          After a convolutional layer, the feature map can still be quite large. Running more
          convolutions on a large feature map is expensive, and deep networks would quickly
          accumulate millions of activations. We also want the network to be somewhat
          <strong> translation invariant</strong> — if the digit shifts a few pixels to the right,
          we want the same classification output.
        </p>
        <p>
          <strong>Pooling</strong> is a downsampling operation that shrinks the spatial dimensions
          of a feature map while retaining the most important information. It has no learnable
          parameters — it is a fixed operation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Max Pooling: Keep the Strongest Signal">
        <p>
          The most common variant is <strong>max pooling</strong> with a 2 × 2 window and stride 2.
          We divide the feature map into non-overlapping 2 × 2 blocks and take the
          <strong> maximum value</strong> in each block. The result is a feature map half the height
          and half the width — one quarter the spatial size.
        </p>
        <p>
          Why the maximum? It keeps the <em>strongest activation</em> in each region. If a
          vertical-edge filter fired strongly anywhere in a 2 × 2 neighbourhood, we record that
          strong response. Minor shifts in exactly where the edge falls within the block do not
          change the output — that is the source of translation invariance.
        </p>
      </ExplanationBox>

      <MathFormula label="Max pooling output at block (r, c)">
        output(r, c) = max of the 2×2 patch at position (2r, 2c) in the feature map
      </MathFormula>

      <WorkedExample title="2×2 Max Pooling on Our Feature Map">
        <p>
          Suppose after convolution we have the following <strong>4 × 4 feature map</strong>.
          These values represent filter responses (how strongly each location resembles the
          learned pattern):
        </p>

        <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.95rem', margin: '0 auto' }}>
            <tbody>
              {[
                [  0, 180,  10, 170],
                [ 20, 200,   5, 160],
                [ 15,  10, 190,  30],
                [  5,  25, 185, 200],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td key={c} style={{ width: '3rem', height: '2.8rem', textAlign: 'center', border: '1px solid #ccc', backgroundColor: val > 150 ? '#c8f0c8' : val > 50 ? '#f0f0c8' : '#f5f5f5', fontWeight: 600, color: '#333' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          We apply 2 × 2 max pooling with stride 2, giving a <strong>2 × 2 output</strong>:
        </p>

        <CalcStep number={1}>
          Top-left 2×2 block: max(0, 180, 20, 200) = <strong>200</strong>
        </CalcStep>
        <CalcStep number={2}>
          Top-right 2×2 block: max(10, 170, 5, 160) = <strong>170</strong>
        </CalcStep>
        <CalcStep number={3}>
          Bottom-left 2×2 block: max(15, 10, 5, 25) = <strong>25</strong>
        </CalcStep>
        <CalcStep number={4}>
          Bottom-right 2×2 block: max(190, 30, 185, 200) = <strong>200</strong>
        </CalcStep>

        <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.95rem', margin: '0 auto' }}>
            <tbody>
              {[
                [200, 170],
                [ 25, 200],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td key={c} style={{ width: '3rem', height: '2.8rem', textAlign: 'center', border: '1px solid #aaa', backgroundColor: val > 150 ? '#c8f0c8' : '#f5f5f5', fontWeight: 700, color: '#333' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: '0.75rem' }}>
          The 4 × 4 feature map collapsed to a 2 × 2 map. Strong activations in the top and
          bottom-right — where our digit&apos;s strokes are — are preserved. The near-zero background
          regions are summarised as 25, discarding the weak noise.
        </p>
      </WorkedExample>

      <ExplanationBox title="Average Pooling and Global Average Pooling">
        <p>
          <strong>Average pooling</strong> takes the mean instead of the maximum. It is less common
          in hidden layers (it dilutes strong activations with zeros) but is occasionally used.
        </p>
        <p>
          <strong>Global average pooling</strong> collapses an entire feature map to a single number
          by averaging every value. It is widely used at the very end of a CNN, just before the
          final classification layer, as an alternative to flattening — it dramatically reduces
          parameters and often improves generalisation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The <code>max_pool2d</code> function below mirrors the worked example above. It has no
          learnable parameters — it is pure downsampling arithmetic.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="cnn.py"
        caption="max_pool2d halves the spatial dimensions by keeping only the strongest activation in each non-overlapping window."
        code={`import numpy as np

# The 4x4 feature map from our worked example.
# Values represent how strongly a filter responded at each spatial location.
feature_map = np.array([
    [  0, 180,  10, 170],
    [ 20, 200,   5, 160],
    [ 15,  10, 190,  30],
    [  5,  25, 185, 200],
], dtype=np.float32)

def max_pool2d(fm, size=2, stride=2):
    # fm shape: (H, W)
    H, W = fm.shape

    # Number of non-overlapping windows that fit along each axis.
    # Integer division automatically handles exact fits.
    out_H = (H - size) // stride + 1   # (4 - 2) // 2 + 1 = 2
    out_W = (W - size) // stride + 1
    pooled = np.zeros((out_H, out_W), dtype=np.float32)

    for r in range(out_H):
        for c in range(out_W):
            # The top-left corner of this window in the input.
            r0 = r * stride
            c0 = c * stride
            # Grab the size x size window and keep only its largest value.
            # The max discards WHERE exactly in the window the activation was --
            # that positional uncertainty is the source of translation invariance.
            window = fm[r0 : r0 + size, c0 : c0 + size]
            pooled[r, c] = np.max(window)

    return pooled

pooled = max_pool2d(feature_map, size=2, stride=2)
print(pooled)
# [[200. 170.]
#  [ 25. 200.]]
# The 4x4 map collapsed to 2x2. Strong responses are preserved.
print(pooled.shape)   # (2, 2) -- exactly half the spatial dimensions`}
      />
    </div>
  );
}
