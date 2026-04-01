'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step14() {
  return (
    <div>
      <ExplanationBox title="The Network Is Wrong. Now What?">
        <p>
          Our network is built. We pass in temperature and humidity, signals flow through every layer,
          and the output neuron spits out a confidence number — say, 65% rain.
        </p>
        <p>
          But it actually rained. The right answer was 100%. Our network was wrong.
        </p>
        <p>
          This happens on every single example at first, because the weights started random.
          Training is the process of fixing that — slowly, systematically, over thousands of examples.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 1: Measure How Wrong It Is">
        <p>
          Before we can fix anything, we need a number that captures how wrong the prediction was.
          Not just &quot;wrong&quot; — but <em>how much</em> wrong, in a way we can do math with.
        </p>
        <p>
          We do this for every single training example. A hot, humid day that actually rained? We check
          what the network predicted. A cool, dry day that didn&apos;t rain? We check that too. Every example
          gets its own error score, and we average them all together.
        </p>
        <p>
          That average is called the <strong>loss</strong>. When the network is terrible, loss is high.
          When it&apos;s accurate, loss is close to zero. Training is just: make the loss go down.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Figure Out Who's Responsible">
        <p>
          Our network predicted 65% but should have said 95%. Some weights caused that mistake more
          than others. Maybe the humidity weight in layer 1 is too small — the network isn&apos;t trusting
          humidity enough, even though high humidity strongly predicts rain.
        </p>
        <p>
          We need to trace the error backward through the network and ask every weight: &quot;how much
          did <em>you</em> contribute to this mistake?&quot; A weight that had a big influence on the
          wrong prediction gets a lot of blame. A weight that barely mattered gets almost none.
        </p>
        <p>
          This blame-tracing is called <strong>backpropagation</strong>. It works backward from the
          output — where we can see the error — all the way to the first hidden layer.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Nudge Every Weight in the Right Direction">
        <p>
          Now we know which weights made things worse. So we adjust them — slightly — in the direction
          that would have reduced the error.
        </p>
        <p>
          Not a big jump. A small nudge. The humidity weight in layer 1 goes up a tiny bit.
          Some other weight that was pulling the prediction down goes up a tiny bit too.
          A weight that was making the network overconfident goes down slightly.
        </p>
        <p>
          These tiny adjustments don&apos;t fix everything in one shot. But they make the network
          slightly more accurate on this example. This process is called <strong>gradient descent</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 4: Repeat. A Lot.">
        <p>
          We do this for every training example. Predict → measure error → trace blame → nudge weights.
          Then we loop back to the beginning and do it all again. And again. Thousands of times.
        </p>
        <p>
          Each pass through all the training data is called an <strong>epoch</strong>. After each epoch,
          the weights are slightly better. The loss goes down a little. The predictions get closer.
        </p>
        <p>
          After enough epochs, the network has seen every type of weather day hundreds of times.
          It&apos;s learned that high humidity matters a lot. It&apos;s learned that humid + cool = likely rain.
          Nobody told it any of that — it figured it out purely by adjusting weights to reduce errors.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Whole Picture">
        <p>
          That&apos;s training. Four steps, repeated:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li><strong>Forward pass</strong> — run the inputs through the network, get a prediction</li>
          <li><strong>Loss</strong> — measure how wrong the prediction was</li>
          <li><strong>Backpropagation</strong> — trace the error back to figure out each weight&apos;s blame</li>
          <li><strong>Gradient descent</strong> — nudge every weight slightly toward being more correct</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          The next steps go through each of these in detail — with the actual math. But the shape of it
          is exactly what you just read. There&apos;s no magic: just measuring mistakes and fixing them,
          over and over, until the network stops making them.
        </p>
      </ExplanationBox>
    </div>
  );
}
