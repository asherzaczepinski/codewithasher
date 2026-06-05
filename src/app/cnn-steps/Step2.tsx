'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="A Digital Image is Just a Grid of Numbers">
        <p>
          Every digital image is stored as a rectangular grid of <strong>pixels</strong>. Each pixel
          holds a number representing how bright that spot is. In a grayscale image the value ranges
          from <strong>0</strong> (pure black) to <strong>255</strong> (pure white), with every
          shade of grey in between.
        </p>
        <p>
          That&apos;s it. There is no colour, no shape, no meaning baked in — just a grid of
          integers. When a CNN &quot;sees&quot; an image it receives exactly this: a 2-D array of
          numbers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Tiny Grayscale Image">
        <p>
          Here is a <strong>5 × 5 grayscale patch</strong> that crudely resembles the top stroke of
          a handwritten &quot;7&quot;. Bright pixels (high values) form the pen stroke; dark pixels
          (low values) are the background.
        </p>
        <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: '0.95rem', margin: '0 auto' }}>
            <tbody>
              {[
                [10,  10,  10,  10,  10],
                [10, 200, 200, 200,  10],
                [10,  10,  10, 200,  10],
                [10,  10,  10, 200,  10],
                [10,  10,  10,  10,  10],
              ].map((row, r) => (
                <tr key={r}>
                  {row.map((val, c) => (
                    <td
                      key={c}
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        textAlign: 'center',
                        border: '1px solid #ccc',
                        backgroundColor: `rgb(${val},${val},${val})`,
                        color: val > 128 ? '#000' : '#eee',
                        fontWeight: 600,
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          The bright row across the top is the horizontal bar of the 7; the bright column on the
          right is the diagonal downstroke. The background is near-black (value 10).
        </p>
      </ExplanationBox>

      <ExplanationBox title="RGB Colour Images">
        <p>
          A colour image is the same idea, but instead of one value per pixel there are
          <strong> three</strong>: one for the <strong>R</strong>ed channel, one for
          <strong> G</strong>reen, and one for <strong>B</strong>lue. A pixel of bright red would be
          stored as (255, 0, 0). A medium grey would be (128, 128, 128).
        </p>
        <p>
          Mathematically, a colour image is a <strong>3-D array</strong> (tensor) of shape
          Height × Width × 3. Each of the three &quot;slices&quot; through that tensor is a
          grayscale channel. CNNs process all three channels simultaneously — you will see how when
          we cover filters in depth.
        </p>
      </ExplanationBox>

      <MathFormula label="Image tensor shape">
        Grayscale: H × W &nbsp;&nbsp; (e.g. 28 × 28 for MNIST digits)
        Colour (RGB): H × W × 3 &nbsp;&nbsp; (e.g. 224 × 224 × 3 for ImageNet)
      </MathFormula>

      <ExplanationBox title="Why This Representation Matters">
        <p>
          Because images are just grids of numbers, every operation a CNN performs is pure
          arithmetic — multiplications and additions on those grid values. There is no magic. When
          you understand the math on our tiny 5 × 5 grid, you understand exactly what happens inside
          a model processing a 4K photograph.
        </p>
      </ExplanationBox>
    </div>
  );
}
