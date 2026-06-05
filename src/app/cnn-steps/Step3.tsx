'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Obvious First Idea: Flatten Everything">
        <p>
          The simplest way to feed an image into a standard neural network is to
          <strong> flatten</strong> the pixel grid into one long list of numbers and connect every
          pixel to every neuron in the first layer. This is called a
          <strong> fully-connected</strong> (or dense) layer.
        </p>
        <p>
          For our tiny 5 × 5 grayscale patch that means a vector of 25 numbers. Easy enough.
          But real images are not tiny.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Parameter Explosion">
        <p>
          Consider a modest 1000 × 1000 colour photograph. Flattening it gives
          1 000 × 1 000 × 3 = <strong>3 000 000 input values</strong>. If the first hidden layer
          has just 1 000 neurons, each neuron needs one weight per input:
        </p>
      </ExplanationBox>

      <MathFormula label="Parameters in one fully-connected layer">
        3 000 000 inputs × 1 000 neurons = 3 000 000 000 weights
      </MathFormula>

      <ExplanationBox title="Three billion weights — just for the first layer">
        <p>
          That is three billion learnable numbers before a single meaningful feature has been
          detected. Training this would require enormous amounts of data and compute, and the model
          would almost certainly overfit. Modern GPUs can hold perhaps a few hundred million
          parameters comfortably. A fully-connected approach simply does not scale to images.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Flattening Destroys Spatial Structure">
        <p>
          There is a deeper problem beyond raw parameter count. When you flatten a 2-D grid into a
          1-D vector, you throw away the neighbourhood relationships that make images meaningful.
        </p>
        <p>
          In our digit image, the pixel at row 1 col 2 and the pixel at row 1 col 3 are
          <em> physically adjacent</em> — they are part of the same horizontal stroke. After
          flattening, they become just two numbers in a long list with no special relationship. The
          network has no way of knowing they were neighbours.
        </p>
        <p>
          Features like edges, corners, and textures are defined by the <em>pattern of a small
          local region</em>, not by individual pixels in isolation. A fully-connected layer cannot
          see local structure — it treats every pixel as equally related to every other.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Two Principles CNNs Are Built On">
        <p>
          CNNs fix both problems with two elegant ideas:
        </p>
        <p>
          <strong>Locality</strong> — instead of connecting every neuron to every pixel, each neuron
          connects only to a small local patch of the image (e.g. a 3 × 3 region). This makes sense
          because features like edges are local; a pixel in the top-left corner of the image has no
          direct bearing on a pixel in the bottom-right.
        </p>
        <p>
          <strong>Weight sharing</strong> — the same small set of weights (called a
          <em> filter</em> or <em>kernel</em>) is reused at every position in the image. If the
          filter learns to detect a vertical edge, it will detect that edge wherever it appears —
          top-left, centre, bottom-right. One filter, learned once, works everywhere.
        </p>
        <p>
          Together these two principles reduce three billion weights to perhaps a few hundred
          while actually capturing richer spatial information. That is why CNNs work.
        </p>
      </ExplanationBox>
    </div>
  );
}
