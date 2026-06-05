'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Sliding a Filter Across an Image">
        <p>
          A <strong>filter</strong> (also called a <strong>kernel</strong>) is a tiny grid of
          weights — typically 3 × 3 or 5 × 5 — that we slide across the image one position at a
          time. At each position we lay the filter on top of the corresponding image patch,
          multiply each filter weight by the pixel value it overlaps, and sum everything up. That
          sum becomes one output value.
        </p>
        <p>
          This operation — element-wise multiply then sum — is called a
          <strong> dot product</strong> between the filter and the patch. We perform it at every
          valid position in the image, producing a grid of output values called the
          <strong> feature map</strong> (or activation map).
        </p>
      </ExplanationBox>

      <MathFormula label="Convolution output at position (r, c)">
        output(r, c) = Σᵢ Σⱼ  image(r+i, c+j) × filter(i, j)
      </MathFormula>

      <ExplanationBox title="Our Setup: Image Patch and Filter">
        <p>
          We will compute the convolution output at the <strong>top-left corner</strong> of our 5 × 5
          digit image using the 3 × 3 filter below. This filter is designed to detect
          <strong> horizontal edges</strong> — bright pixels above dark ones.
        </p>

        <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', margin: '1rem 0', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Image (top-left 3×3 patch)</p>
            <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <tbody>
                {[
                  [10,  10,  10],
                  [10, 200, 200],
                  [10,  10,  10],
                ].map((row, r) => (
                  <tr key={r}>
                    {row.map((val, c) => (
                      <td key={c} style={{ width: '2.8rem', height: '2.8rem', textAlign: 'center', border: '1px solid #ccc', backgroundColor: `rgb(${val},${val},${val})`, color: val > 128 ? '#000' : '#eee', fontWeight: 600 }}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Filter (horizontal edge detector)</p>
            <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.9rem' }}>
              <tbody>
                {[
                  [-1, -1, -1],
                  [ 0,  0,  0],
                  [ 1,  1,  1],
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
        </div>
      </ExplanationBox>

      <WorkedExample title="Computing One Output Value Step by Step">
        <p>
          We multiply each filter weight by the overlapping pixel, then add all nine products
          together:
        </p>

        <CalcStep number={1}>
          Top row of patch × top row of filter:
          (10 × −1) + (10 × −1) + (10 × −1) = −10 − 10 − 10 = −30
        </CalcStep>
        <CalcStep number={2}>
          Middle row of patch × middle row of filter:
          (10 × 0) + (200 × 0) + (200 × 0) = 0
        </CalcStep>
        <CalcStep number={3}>
          Bottom row of patch × bottom row of filter:
          (10 × 1) + (10 × 1) + (10 × 1) = 10 + 10 + 10 = 30
        </CalcStep>
        <CalcStep number={4}>
          Sum all products: −30 + 0 + 30 = <strong>0</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The output at this position is <strong>0</strong>. That makes sense: the top-left 3 × 3
          patch is almost uniformly dark (values of 10), so there is no strong horizontal
          brightness transition — no edge here. The filter correctly responds with near-zero.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          We would then slide the filter one pixel to the right and repeat the calculation,
          continuing until we have covered every valid position in the image. Each position produces
          one number in the output feature map.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why This Finds Patterns">
        <p>
          Think about what a large positive output means: the image patch looks a lot like the
          filter — bright where the filter is positive, dark where the filter is negative. A large
          negative output means the patch is the <em>opposite</em> of the filter. An output near
          zero means no strong match in either direction.
        </p>
        <p>
          The convolution is literally asking &quot;how much does this patch resemble the
          filter?&quot; at every location. By designing filters that look like edges, corners, or
          other features, we get feature maps that light up wherever those features appear in the
          image.
        </p>
      </ExplanationBox>

    </div>
  );
}
