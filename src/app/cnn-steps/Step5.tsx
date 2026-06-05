'use client';

import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="What a Filter Detects Depends on Its Weights">
        <p>
          The pattern a filter responds to is entirely determined by its weight values. Two filters
          with different weights will light up at completely different image features — even though
          they perform the exact same mathematical operation (dot product with the local patch).
          The filter weights <em>are</em> the detector.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Classic Handcrafted Filters">
        <p>
          Before deep learning, computer vision engineers designed filters by hand to detect specific
          features. These give excellent intuition for what filter weights do.
        </p>

        <p style={{ fontWeight: 600, marginTop: '1rem' }}>Vertical edge detector</p>
        <div style={{ overflowX: 'auto', margin: '0.5rem 0 1rem' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0 auto' }}>
            <tbody>
              {[
                [-1,  0,  1],
                [-1,  0,  1],
                [-1,  0,  1],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td key={c} style={{ width: '2.8rem', height: '2.8rem', textAlign: 'center', border: '1px solid #aad', backgroundColor: val < 0 ? '#fde' : val > 0 ? '#dfd' : '#f9f9f9', fontWeight: 700, color: '#333' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          This filter fires strongly wherever the image transitions from dark on the left to bright
          on the right — a vertical edge. It gives a large positive output on the left side of the
          downstroke of our digit 7, and near-zero everywhere there is no such transition.
        </p>

        <p style={{ fontWeight: 600, marginTop: '1.5rem' }}>Blur filter (box filter)</p>
        <div style={{ overflowX: 'auto', margin: '0.5rem 0 1rem' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.9rem', margin: '0 auto' }}>
            <tbody>
              {[
                ['1/9', '1/9', '1/9'],
                ['1/9', '1/9', '1/9'],
                ['1/9', '1/9', '1/9'],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td key={c} style={{ width: '3rem', height: '2.8rem', textAlign: 'center', border: '1px solid #aad', backgroundColor: '#f9f9f9', fontWeight: 600, color: '#333' }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each output pixel becomes the average of the surrounding 3 × 3 neighbourhood. This smooths
          out sharp pixel-level noise and blurs the image — the output feature map looks like a
          softened version of the input.
        </p>
      </ExplanationBox>

      <ExplanationBox title="CNNs Learn Their Own Filters">
        <p>
          The revolutionary insight of CNNs is that you do <em>not</em> have to design filters by
          hand. The filter weights are initialized randomly and then <strong>learned through
          backpropagation</strong> — the exact same gradient-descent training that updates neuron
          weights in a regular network.
        </p>
        <p>
          The network discovers on its own that certain weight patterns are useful for the task.
          When you train a CNN on digit images, the first convolutional layer typically learns filters
          that look like edge detectors — not because anyone told it to, but because edges are the
          most discriminative low-level features for distinguishing digit shapes.
        </p>
        <p>
          Deeper layers learn filters that detect combinations of edges — curves, corners, then parts
          of strokes — and even deeper layers detect whole digit-like shapes. The hierarchy of
          learned features is what makes CNNs so powerful.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Back to Our Digit">
        <p>
          Imagine applying a vertical-edge filter to our 5 × 5 digit patch. The right column of
          bright pixels (the downstroke of the 7) sits next to dark background pixels — a strong
          dark-to-bright transition from left to right. The vertical-edge filter would produce large
          positive values in the feature map right at that boundary, clearly marking where the
          downstroke is.
        </p>
        <p>
          That &quot;where the downstroke is&quot; information is exactly what the network needs to
          eventually distinguish a 7 from, say, a 1 (which has a similar downstroke but no
          horizontal bar at the top).
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We define a vertical-edge kernel and pass it through the <code>conv2d</code> function from
          Step 4. The output shows where dark-to-bright left-to-right transitions occur.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="cnn.py"
        caption="Changing only the kernel weights turns the same conv2d function into a vertical-edge detector."
        code={`import numpy as np

# --- reuse image and conv2d from previous steps ---
image = np.array([
    [ 10,  10,  10,  10,  10],
    [ 10, 200, 200, 200,  10],
    [ 10,  10,  10, 200,  10],
    [ 10,  10,  10, 200,  10],
    [ 10,  10,  10,  10,  10],
], dtype=np.float32)

def conv2d(img, k):
    H, W   = img.shape
    kH, kW = k.shape
    out_H  = H - kH + 1
    out_W  = W - kW + 1
    feature_map = np.zeros((out_H, out_W), dtype=np.float32)
    for r in range(out_H):
        for c in range(out_W):
            feature_map[r, c] = np.sum(img[r : r + kH, c : c + kW] * k)
    return feature_map

# Vertical-edge detector: fires where the image goes dark (left) to bright (right).
# Column 0 weights are -1 (suppress left side),
# column 1 weights are  0 (middle is neutral),
# column 2 weights are +1 (amplify right side).
vertical_edge_kernel = np.array([
    [-1, 0, 1],
    [-1, 0, 1],
    [-1, 0, 1],
], dtype=np.float32)

v_feature_map = conv2d(image, vertical_edge_kernel)
print(v_feature_map)
# Expect large positive values near the right side of the image
# where the dark background meets the bright downstroke of the 7.

# The kernel weights ARE the detector -- swap them and you detect a different feature.
# A CNN learns these weights automatically during training.`}
      />
    </div>
  );
}
