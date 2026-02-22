'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>

      <ExplanationBox title="The Simple Version">
        <p>
          As we learned before, a neuron is a confidence machine. Its job is to take in inputs, do some calculations, and output a single number between 0 and 1 — its confidence that the inputs match a pattern it&apos;s trying to detect.
        </p>
        <p>
          For example, if we train a neuron to detect rain, we might feed it temperature and humidity. The neuron looks at those numbers and outputs a confidence:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>On a hot, humid day: <strong>0.82</strong> → &quot;I&apos;m 82% confident it will rain.&quot;</li>
          <li>On a dry, cool day: <strong>0.15</strong> → &quot;Low confidence it will rain.&quot;</li>
        </ul>
        <p>
          The real power comes when neurons feed their confidence into other neurons. For instance, a final neuron could combine:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Storm conditions neuron: 0.9</li>
          <li>Cold rain neuron: 0.4</li>
          <li>Tropical moisture neuron: 0.7</li>
        </ul>
        <p>
          …and produce a more informed confidence about whether it will rain. This is exactly what makes neural networks smart: simple confidence signals build into complex pattern detection.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now, We're Ready to Go Deeper">
        <p>
          Previously, we treated the neuron as a black box — it did math and produced a confidence.
        </p>
        <p>
          Next, we&apos;ll learn the true mathematics behind how a neuron:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Uses <strong>weights</strong> to decide how important each input is</li>
          <li>Combines inputs into meaningful patterns</li>
          <li>Produces predictions that become the building blocks for larger networks</li>
        </ul>
        <p>
          In short: the concept stays the same — the neuron is a confidence machine between 0 and 1 — but now we&apos;ll see how it really calculates those confidences, builds patterns, and powers predictions across the network.
        </p>
      </ExplanationBox>
    </div>
  );
}
