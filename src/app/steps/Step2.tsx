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
          The interesting part is <em>what</em> decisions it learns to make. A neuron doesn&apos;t come pre-programmed — it starts knowing nothing, and over time it figures out what pattern in the data it should be looking for. More on that in a second.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Setup">
        <p>
          We want to predict whether it&apos;s going to rain. We have two measurements to work with:
        </p>
        <ul style={{ lineHeight: '2', marginTop: '0.5rem' }}>
          <li><strong>Temperature</strong> — how hot or cold it is</li>
          <li><strong>Humidity</strong> — how much moisture is in the air</li>
        </ul>
        <p>
          We&apos;re going to feed both of these into a network with three neurons in the middle, and one final output neuron that decides: rain or no rain.
        </p>
        <p>
          Every middle neuron receives both inputs — the same temperature and the same humidity. But here&apos;s the thing: <strong>each neuron learns to care about those inputs differently.</strong>
        </p>
      </ExplanationBox>

      <ExplanationBox title="Three Neurons, Three Different Detectors">
        <p>
          After training on thousands of days of weather data, each neuron ends up specializing in something different — even though they all see the exact same two numbers. For example:
        </p>
        <p>
          <strong>Neuron 1</strong> might learn to detect <strong>storm-building conditions</strong> — it notices when humidity is really high regardless of temperature. Muggy, heavy air? This neuron fires strongly. Dry day? It barely responds. It learned to care a lot about humidity and mostly ignore temperature.
        </p>
        <p>
          <strong>Neuron 2</strong> might learn to detect <strong>cold rain patterns</strong> — it picks up on cool temperatures combined with moderate humidity. It learned to weigh both inputs roughly equally, looking for that specific combo.
        </p>
        <p>
          <strong>Neuron 3</strong> might learn to detect <strong>tropical moisture</strong> — it focuses on high humidity <em>and</em> warm temperatures together. Hot and sticky? This neuron fires hard. Cool and dry? It stays quiet.
        </p>
        <p>
          None of them were told what to look for. We didn&apos;t program &quot;Neuron 1, you detect storms.&quot; They each started with random tendencies, saw thousands of examples of weather → rain or no rain, and gradually figured out what pattern was useful for them to detect. Same two inputs, three completely different perspectives.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Final Decision">
        <p>
          Now we have three neurons, each detecting a different weather pattern. But none of them individually decides if it&apos;s going to rain. That&apos;s the job of the <strong>output neuron</strong>.
        </p>
        <p>
          The output neuron doesn&apos;t see the raw weather data at all. It only sees the signals from the three middle neurons: &quot;storm conditions detected,&quot; &quot;cold rain pattern detected,&quot; &quot;tropical moisture detected.&quot; It takes those three signals and combines them into one final decision — rain or no rain.
        </p>
        <p>
          Maybe on a given day, Neuron 1 is firing hard (storm conditions), Neuron 3 is firing hard (tropical moisture), but Neuron 2 is quiet (no cold front). The output neuron weighs all of that and decides: yeah, it&apos;s going to rain.
        </p>
        <p>
          That&apos;s the whole architecture. Two inputs → three middle neurons that each detect a different pattern → one output neuron that makes the final call. Simple pieces, but when they work together, they can make surprisingly smart predictions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How It Learns">
        <p>
          When the network first starts, every neuron is clueless. Their detectors are random — Neuron 1 might be paying too much attention to temperature and ignoring humidity entirely. The output neuron has no idea how to weigh the signals. The whole thing makes terrible predictions.
        </p>
        <p>
          So we train it. We show it a day&apos;s weather data and let it make a prediction. Then we tell it what actually happened — did it rain or not? If the network was wrong, we trace back through every neuron and ask: what went wrong? Which neurons were paying attention to the wrong things?
        </p>
        <p>
          Then we nudge. Maybe Neuron 1 needs to care more about humidity. Maybe the output neuron needs to trust Neuron 3 more. Small adjustments, everywhere, all at once.
        </p>
        <p>
          We do this thousands of times. Hot rainy days. Cool dry days. Humid storms. Dry sunshine. Each example makes the network a little better. The middle neurons gradually sharpen into useful pattern detectors, and the output neuron gradually learns how to combine their signals into accurate predictions.
        </p>
        <p>
          Nobody programs the network. It programs itself — purely from data and feedback.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now Let's Build It">
        <p>
          That&apos;s the big picture. Neurons take in inputs and make decisions. Stack them together and they can detect complex patterns. They learn by making mistakes and adjusting.
        </p>
        <p>
          Next, we get into the real math — how a neuron actually takes numbers in, processes them, and produces an output. Hit &quot;Next&quot; to start building.
        </p>
      </ExplanationBox>
    </div>
  );
}
