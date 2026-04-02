'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step19() {
  return (
    <div>

      <ExplanationBox title="Everything You Learned Still Applies — The Inputs Just Change">
        <p>
          Every concept from this course — weights, weighted sums, sigmoid, loss, gradients,
          backpropagation — works exactly the same way no matter what the network is looking at.
          The only thing that changes between a rain predictor and an image classifier or a
          language model is what gets fed in as inputs. The math underneath is identical.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Color Images: Three Numbers Per Pixel">
        <p>
          A grayscale image can be represented as one number per pixel — 0 for black, 1 for
          white, everything in between is a shade of gray. A color image is the same idea but
          with three numbers per pixel: one for red, one for green, one for blue. That&apos;s RGB.
          Each channel is its own 0-to-1 value, and together the three describe the exact color
          at that spot.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So a 64×64 color image isn&apos;t 4,096 inputs — it&apos;s 64 × 64 × 3 = <strong>12,288 inputs</strong>.
          Each one is already normalized between 0 and 1 (just divide the raw 0–255 value by 255),
          which is exactly what we did with temperature and humidity. The network gets all 12,288
          values at once, each connected to every neuron in the first hidden layer, each with its
          own weight. The red channel of one pixel is one input. The green channel of the same
          pixel is a separate input. They can be weighted differently — the network might learn
          that the green channel of a particular pixel matters a lot for identifying grass, and
          the red channel of a different pixel matters for identifying a sunset.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Training works identically. The network makes a prediction, computes the loss, traces
          the blame backward through every layer with the same three-step gradient calculation,
          and nudges every one of those 12,288+ weights in the right direction. Do that enough
          times across enough images and the weights settle into values that genuinely recognize
          what&apos;s in a picture.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Text: Words Become Numbers Too">
        <p>
          Language models work on the same principle — text just needs to be turned into numbers
          first. The most common approach is to break text into chunks called tokens (roughly
          words or parts of words) and represent each token as a list of hundreds of numbers
          called an <strong>embedding</strong>. These numbers capture meaning: tokens with similar
          meanings end up with similar numbers, so &quot;happy&quot; and &quot;joyful&quot; land close together
          in that numerical space.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Those embedding values become the inputs. From there the network runs exactly as you&apos;d
          expect — weighted sums, activation functions, loss measured against the correct next
          word, gradients traced backward, weights updated. The same backpropagation algorithm
          that adjusted the humidity weight in the rain predictor is what trains GPT to predict
          the next token.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Audio: Sound as a Wave of Numbers">
        <p>
          Audio is a continuous wave sampled thousands of times per second — typically 44,100
          samples per second for CD-quality sound. Each sample is one number: the amplitude of
          the wave at that moment. Feed those samples into a network as inputs and you can train
          it to recognize speech, classify music, or detect sounds.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          In practice, raw samples are often converted into a spectrogram first — a 2D grid
          showing how much of each frequency is present at each moment in time. That turns
          an audio clip into something that looks a lot like an image, which means the same
          image-processing techniques apply.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Pattern Is Always the Same">
        <p>
          Whatever the domain, the recipe is always:
        </p>
        <ol style={{ marginTop: '0.75rem', lineHeight: 2.2 }}>
          <li><strong>Turn the raw data into numbers</strong> — pixels, embeddings, sample amplitudes, sensor readings, anything measurable.</li>
          <li><strong>Normalize them</strong> to a consistent range so no single input dominates just because of its scale.</li>
          <li><strong>Feed them into the network</strong> — each number is one input, each input gets its own weight per neuron in the first layer.</li>
          <li><strong>Train with backpropagation</strong> — the loss, the gradients, the weight updates all work exactly as you&apos;ve learned.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          The networks get bigger — millions or billions of weights instead of dozens — and the
          architectures get specialized (convolutional layers for images, attention layers for
          text). But every weight in every one of those layers still gets its gradient computed
          by the exact same three-step chain you worked through in this course: how much did
          the loss move when the output moved, how much did the output move when the weighted
          sum moved, how much did the weighted sum move when this weight moved. That&apos;s it.
          That&apos;s the engine underneath all of it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You Now Understand How Modern AI Works">
        <p>
          The rain predictor you built from scratch — normalizing inputs, computing weighted sums,
          applying sigmoid, measuring loss, tracing gradients backward, nudging weights — is the
          same process running inside every image classifier, every voice assistant, every language
          model. The scale is different. The data is different. The core idea is exactly what
          you just learned.
        </p>
      </ExplanationBox>

    </div>
  );
}
