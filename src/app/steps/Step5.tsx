'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="What Are Weights?">
        <p>
          A neuron takes normalized inputs and produces an output (its confidence). But how does it
          decide how much each input matters? That&apos;s where <strong>weights</strong> come in.
        </p>
        <p>
          A weight is a number that controls how much an input affects the neuron&apos;s confidence.
          Higher weight = more influence on confidence. Lower weight = less influence. Negative weight
          = pushes confidence <em>down</em>.
        </p>
        <p>
          In our rain example: humidity should have a big positive weight (high humidity → more confident
          it&apos;ll rain), while temperature gets a small negative weight (hotter → slightly less confident
          it&apos;ll rain).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights for Rain Prediction">
        <p>
          For predicting rain, we&apos;ll use these weights:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Temperature weight: -0.3</strong> — Higher temperature slightly <em>reduces</em> rain
            prediction. Conversely, lower temperatures
            increase the rain signal.</li>
          <li><strong>Humidity weight: 2.0</strong> — Higher humidity strongly <em>increases</em> rain
            prediction. A weight above 1 means humidity has an amplified effect — the neuron treats it as
            a very strong signal for rain confidence.</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <strong>Side note:</strong> We&apos;re manually setting these weights to values that make sense
          for our rain example. In practice, weights start as small random numbers and the
          network <em>learns</em> the right values through training — gradually adjusting them until
          each neuron&apos;s confidence is accurate.
        </p>
      </ExplanationBox>


      <p>
        <strong>Rain check:</strong> With humidity weighted at 2.0 and temperature at -0.3, our rain neuron
        will be heavily influenced by humidity (pushing confidence up) and slightly influenced by temperature
        (pushing confidence down on hot days). But we&apos;re still missing one piece — what if the neuron
        should start with a built-in lean toward &quot;yes&quot; or &quot;no&quot;? That&apos;s <strong>bias</strong>.
      </p>
    </div>
  );
}
