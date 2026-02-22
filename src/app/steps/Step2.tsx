'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="A Neuron Is a Decision-Maker">
        <p>
          A neuron takes in information and makes a decision. That&apos;s it. Information goes in, a decision comes out.
        </p>
        <p>
          A neuron doesn&apos;t come pre-programmed — it starts knowing nothing, and over time it figures out what pattern in the data it should be looking for.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Setup">
        <p>
          We want to predict whether it&apos;s going to rain. We have two measurements:
        </p>
        <ul style={{ lineHeight: '2', marginTop: '0.5rem' }}>
          <li><strong>Temperature</strong> — how hot or cold it is</li>
          <li><strong>Humidity</strong> — how much moisture is in the air</li>
        </ul>
        <p>
          We&apos;re going to build a network that takes these two numbers and outputs a prediction: rain or no rain. But we&apos;re not going to do it with a single neuron — we&apos;re going to use <strong>four layers</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Layer 1: The Inputs">
        <p>
          The first layer is simple — it&apos;s just our raw data. Temperature and humidity go in. These input neurons don&apos;t do any thinking. They just pass the numbers forward to the next layer.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Layer 2: First Set of Pattern Detectors">
        <p>
          This is where it gets interesting. We have three neurons in this layer, and every one of them receives <em>both</em> temperature and humidity. But each neuron learns to care about those inputs differently.
        </p>
        <p>
          After training, they might end up like this:
        </p>
        <p>
          <strong>Neuron 1</strong> learns to detect <strong>muggy conditions</strong> — it cares a lot about humidity and mostly ignores temperature. When humidity is high, it fires strongly.
        </p>
        <p>
          <strong>Neuron 2</strong> learns to detect <strong>warm-and-wet combos</strong> — it pays attention to both inputs equally. Hot and humid together? It lights up.
        </p>
        <p>
          <strong>Neuron 3</strong> learns to detect <strong>cool moisture</strong> — it picks up on high humidity combined with lower temperatures. A cool, damp day triggers it.
        </p>
        <p>
          Same two inputs, three completely different perspectives. Nobody told them what to look for — they figured it out from data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Layer 3: Combining Patterns">
        <p>
          Now we have another three neurons. But these don&apos;t see the raw temperature and humidity at all — they only see the signals from Layer 2.
        </p>
        <p>
          These neurons learn to detect <em>combinations</em> of the simpler patterns. For example:
        </p>
        <p>
          <strong>Neuron 4</strong> might learn that when the &quot;muggy conditions&quot; neuron AND the &quot;warm-and-wet&quot; neuron are both firing, that&apos;s a strong storm signal.
        </p>
        <p>
          <strong>Neuron 5</strong> might learn that &quot;cool moisture&quot; firing strongly while &quot;warm-and-wet&quot; is quiet means drizzle, not a storm.
        </p>
        <p>
          <strong>Neuron 6</strong> might pick up on yet another combination — maybe when all three Layer 2 neurons fire moderately, that&apos;s an overcast-but-dry situation.
        </p>
        <p>
          This is patterns built on patterns. Layer 2 detects simple things from raw data. Layer 3 detects complex things from Layer 2&apos;s signals. Each layer gets more abstract.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Layer 4: The Final Call">
        <p>
          One neuron. It takes the three signals from Layer 3 and makes the final decision: rain or no rain.
        </p>
        <p>
          It doesn&apos;t know anything about temperature or humidity directly. All it sees is: &quot;strong storm signal,&quot; &quot;weak drizzle signal,&quot; &quot;no overcast signal.&quot; From those, it decides — yeah, it&apos;s going to rain.
        </p>
        <p>
          That&apos;s the full architecture: <strong>2 inputs → 3 neurons → 3 neurons → 1 output</strong>. Simple pieces stacked into something smart.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How It Learns">
        <p>
          When the network first starts, every neuron is clueless. Their patterns are random. The whole thing makes terrible predictions.
        </p>
        <p>
          So we train it. We show it a day&apos;s weather and let it predict. Then we tell it what actually happened. If it was wrong, we trace back through every neuron and adjust — maybe Neuron 1 needs to care more about humidity, maybe the output neuron needs to trust Neuron 4 more. Small nudges, everywhere, all at once.
        </p>
        <p>
          After thousands of examples, the neurons sharpen. Layer 2 neurons become real pattern detectors. Layer 3 neurons learn meaningful combinations. The output neuron learns which signals to trust. Nobody programs any of it — it all emerges from data and feedback.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now Let's Build It">
        <p>
          That&apos;s the big picture. Two inputs, four layers, one prediction. Every neuron learns from mistakes. Next, we get into the real math — starting with how a single neuron actually works. Hit &quot;Next.&quot;
        </p>
      </ExplanationBox>
    </div>
  );
}
