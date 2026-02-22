'use client';

import ExplanationBox from '@/components/ExplanationBox';
import OverviewNetwork from '@/components/OverviewNetwork';

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

        <svg viewBox="0 0 520 300" style={{ width: '100%', maxWidth: '520px', height: 'auto', display: 'block', margin: '1.5rem auto 0.5rem' }}>
          {/* Connections */}
          {[0, 1].flatMap(ii => [0, 1, 2].map(hi => (
            <line key={`i${ii}-h1${hi}`} x1={78} y1={[100, 200][ii]} x2={167} y2={[60, 150, 240][hi]} stroke="#cbd5e1" strokeWidth={1.2} />
          )))}
          {[0, 1, 2].flatMap(fi => [0, 1, 2].map(ti => (
            <line key={`h1${fi}-h2${ti}`} x1={203} y1={[60, 150, 240][fi]} x2={307} y2={[60, 150, 240][ti]} stroke="#cbd5e1" strokeWidth={1.2} />
          )))}
          {[0, 1, 2].map(hi => (
            <line key={`h2${hi}-o`} x1={343} y1={[60, 150, 240][hi]} x2={432} y2={150} stroke="#cbd5e1" strokeWidth={1.2} />
          ))}

          {/* Input nodes */}
          <circle cx={60} cy={100} r={18} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
          <text x={60} y={104} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e293b">Temp</text>
          <circle cx={60} cy={200} r={18} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
          <text x={60} y={204} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e293b">Humid</text>

          {/* Hidden Layer 1 */}
          {[0, 1, 2].map(i => (
            <g key={`h1-${i}`}>
              <circle cx={185} cy={[60, 150, 240][i]} r={18} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
              <text x={185} y={[64, 154, 244][i]} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">{i + 1}</text>
            </g>
          ))}

          {/* Hidden Layer 2 */}
          {[0, 1, 2].map(i => (
            <g key={`h2-${i}`}>
              <circle cx={325} cy={[60, 150, 240][i]} r={18} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
              <text x={325} y={[64, 154, 244][i]} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#1e293b">{i + 4}</text>
            </g>
          ))}

          {/* Output node */}
          <circle cx={450} cy={150} r={18} fill="#e2e8f0" stroke="#475569" strokeWidth={2} />
          <text x={450} y={154} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e293b">Rain?</text>

          {/* Layer labels */}
          <text x={60} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">INPUTS</text>
          <text x={185} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">LAYER 2</text>
          <text x={325} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">LAYER 3</text>
          <text x={450} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">OUTPUT</text>
        </svg>
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
          Same two inputs, three completely different perspectives.
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

      <ExplanationBox title="Why This Matters: Discovering What We Can't Program">
        <p>
          Here&apos;s the really powerful thing about stacking signals like this: the network ends up
          learning patterns that <em>no human could have written rules for</em>.
        </p>
        <p>
          Think about it. We never told the network &quot;muggy conditions + warm-and-wet = storm.&quot;
          We just gave it temperature, humidity, and thousands of examples of what actually happened.
          The neurons figured out those combinations on their own.
        </p>
        <p>
          And it goes deeper. Imagine after training, the network discovers something like this:
          when the &quot;muggy conditions&quot; neuron fires strongly, and the &quot;cool moisture&quot;
          neuron fires <em>just a little</em>, but the &quot;warm-and-wet&quot; neuron is completely
          quiet — that specific combination triggers Neuron 5 in Layer 3, which the output neuron
          has learned to associate with <strong>freezing rain</strong>. High humidity without warmth,
          plus a hint of cool dampness, minus any tropical heat signature.
        </p>
        <p>
          Could a human meteorologist describe that rule? Maybe. But could they write it down precisely
          enough to program it? Probably not — it&apos;s not &quot;if humidity {'>'} 80% then rain.&quot;
          It&apos;s a specific <em>blend</em> of signals at specific strengths. The kind of fuzzy,
          intuitive pattern that humans recognize but struggle to put into words.
        </p>
        <p>
          That&apos;s the whole point of neural networks. By letting simple neurons pass signals to
          other neurons, the network builds up representations of the world that are too nuanced
          to be hand-coded. Each layer abstracts further from the raw data, until the final neuron
          is making decisions based on concepts that only exist inside the network itself.
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

      <div id="network-visualizer" />
      <ExplanationBox title="Network Visualizer">
        <p>
          This is our network <strong>after training</strong> — every neuron has already
          learned its pattern from thousands of weather examples. Drag the sliders and hover
          over neurons to explore.
        </p>
        <OverviewNetwork />
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
