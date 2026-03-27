'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>

      <ExplanationBox title="The Simple Version">
        <p>
          A neuron is a confidence machine. Its job is to take in inputs, do some calculations, and output a single number between 0 and 1 — its confidence that the inputs match a pattern it&apos;s trying to detect.
        </p>
        <p>
          For example, if we train a neuron to detect rain, we might feed it temperature and humidity. The neuron looks at those numbers and outputs a confidence:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>On a hot, humid day: <strong>0.82</strong> → &quot;I&apos;m 82% confident it will rain.&quot;</li>
          <li>On a dry, cool day: <strong>0.15</strong> → &quot;I&apos;m 15% confident it will rain.&quot;</li>
        </ul>
        
      </ExplanationBox>

      <ExplanationBox title="Now, We're Ready to Go Deeper">
        <p>
          Previously, we treated the neuron as a black box — it did math and produced a confidence. Now we&apos;re going to crack it open and see how it actually works. Here&apos;s what&apos;s coming:
        </p>
        <p>
          <strong>Normalization </strong> — before inputs even reach the neuron, we scale them to the same range (0 to 1). Without this, a raw temperature of 98°F would completely overpower a humidity value of 0.8 just because its number is bigger — even if humidity matters more. Normalization puts every input on equal footing.
        </p>
        <p>
          <strong>Weights </strong> — each input gets multiplied by a number called a weight. A high weight means the neuron cares a lot about that input. A weight near zero means it ignores it. This is how the neuron decides what&apos;s important: maybe humidity matters a lot for predicting rain, but temperature barely matters. The weights encode that.
        </p>
        <p>
          <strong>Bias </strong> — after combining the weighted inputs, the neuron adds one more number: its bias. It&apos;s a starting point. In our rain example, maybe it rains most days where we live — the neuron needs a way to say &quot;start leaning toward rain, and let the inputs adjust from there.&quot; That&apos;s what bias does. Just like weights, the network learns to adjust biases on its own during training.
        </p>
        <p>
          <strong>The Squeeze (Activation Function) </strong> — the weighted sum plus bias can be any number: -50, 3.7, 1000. But the next layer of neurons is expecting a value between 0 and 1. If one neuron outputs 1000 and another outputs 0.3, that first neuron would completely drown out the second — the network couldn&apos;t balance their signals. The squeeze function forces every neuron into the same 0-to-1 range so they can all play nicely together.
        </p>
        <p>
          You might wonder: <em>why not just keep the weights and bias tiny so the result naturally stays between 0 and 1? </em> The problem is that the network needs the freedom to use large weights. A weight of 50 might mean &quot;humidity is extremely important for this prediction&quot; — shrinking it to 0.01 would destroy that signal. The squeeze function lets the network freely adjust weights and biases to whatever values best capture the patterns in the data, and then handles the rescaling step separately. Keeping things in range is the squeeze&apos;s job; encoding importance is the weights&apos; job. Mixing the two would make learning much harder.
        </p>
        <p>
          That&apos;s the whole neuron: <strong>multiply inputs by weights → add a bias → squeeze the result</strong>. Next up, we&apos;ll learn the true math behind all of it — how the neuron calculates its weighted sum, how the squeeze function actually works, and how training adjusts every weight and bias until the network gets good at its job.
        </p>
      </ExplanationBox>
    </div>
  );
}
