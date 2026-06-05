'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="One Filter Produces One Feature Map">
        <p>
          When we slide a single filter across the entire input image and collect every dot-product
          output, we get a 2-D grid of numbers called a <strong>feature map</strong> (or activation
          map). Each position in the feature map tells us how strongly the filter&apos;s pattern was
          present at the corresponding location in the input.
        </p>
        <p>
          In a real CNN we apply <strong>many filters simultaneously</strong>. If we use 32 different
          filters, we get 32 feature maps — one per filter. These 32 maps are stacked to form a
          3-D output tensor of shape Output_H × Output_W × 32. Each &quot;depth slice&quot; encodes
          the response of one learned feature detector across the whole image.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Stride: How Far the Filter Jumps">
        <p>
          By default we slide the filter one pixel at a time — a <strong>stride of 1</strong>. We
          can also jump by 2 or more pixels at each step. A larger stride means:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Fewer positions are sampled → <strong>smaller output feature map</strong></li>
          <li>Faster computation (fewer dot products to compute)</li>
          <li>Some spatial information is skipped over</li>
        </ul>
        <p>
          Stride is a hyperparameter you choose. Stride 1 is most common in early layers where
          fine spatial detail matters. Stride 2 is sometimes used instead of pooling to downsample.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Padding: Controlling the Border">
        <p>
          With no padding, a 3 × 3 filter cannot be placed with its centre on the edge pixels of
          the image — the filter would hang off the side. This means the output shrinks compared
          to the input. After many convolutional layers the feature maps would become very small.
        </p>
        <p>
          <strong>Zero-padding</strong> (padding = P) adds a border of zeros around the input
          before convolution. With P = 1 around a 5 × 5 image, the padded input is 7 × 7, and a
          3 × 3 filter produces a 5 × 5 output — the same size as the original. This is called
          &quot;same&quot; padding and is the most common choice.
        </p>
      </ExplanationBox>

      <MathFormula label="Output size formula (one dimension)">
        Output size = ⌊(W − F + 2P) / S⌋ + 1
        where W = input size, F = filter size, P = padding, S = stride
      </MathFormula>

      <WorkedExample title="Calculating the Output Size">
        <p>
          We apply a <strong>3 × 3 filter</strong> to our <strong>5 × 5</strong> input image with
          <strong> no padding (P = 0)</strong> and <strong>stride 1 (S = 1)</strong>.
        </p>

        <CalcStep number={1}>
          Input size W = 5, Filter size F = 3, Padding P = 0, Stride S = 1
        </CalcStep>
        <CalcStep number={2}>
          Plug into formula: (5 − 3 + 2×0) / 1 + 1
        </CalcStep>
        <CalcStep number={3}>
          Numerator: 5 − 3 + 0 = 2
        </CalcStep>
        <CalcStep number={4}>
          Divide by stride: 2 / 1 = 2
        </CalcStep>
        <CalcStep number={5}>
          Add 1: 2 + 1 = <strong>3</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The output feature map is <strong>3 × 3</strong> — smaller than the 5 × 5 input because
          the filter cannot be centred on the outermost pixels without padding. If we added P = 1
          (same padding), the output would be (5 − 3 + 2) / 1 + 1 = <strong>5 × 5</strong>,
          preserving the spatial dimensions.
        </p>
      </WorkedExample>

      <ExplanationBox title="Depth: Stacking Many Feature Maps">
        <p>
          A convolutional layer with <strong>K filters</strong> produces K feature maps, each of
          size Output_H × Output_W. The full output is a 3-D tensor of shape
          Output_H × Output_W × K.
        </p>
        <p>
          In practice K is often 32, 64, or 128 in early layers, and grows larger in deeper layers
          where the spatial size has shrunk via pooling. This depth dimension is where the network
          encodes <em>what kind of feature</em> was detected, while the spatial dimensions encode
          <em>where</em>.
        </p>
      </ExplanationBox>

    </div>
  );
}
