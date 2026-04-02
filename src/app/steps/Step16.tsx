'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

const CHAIN = ['weight', 'weighted sum', 'output', 'loss'] as const;

function ChainDiagram({ highlight }: { highlight: string[] }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      margin: '0.75rem 0',
      flexWrap: 'wrap',
    }}>
      {CHAIN.map((label, i) => {
        const active = highlight.includes(label);
        return (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{
              padding: '0.3rem 0.65rem',
              background: active ? '#dcfce7' : '#f1f5f9',
              border: `1px solid ${active ? '#86efac' : '#e2e8f0'}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: active ? '#166534' : '#94a3b8',
              whiteSpace: 'nowrap',
            }}>{label}</span>
            {i < CHAIN.length - 1 && (
              <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 300 }}>→</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function Step16() {
  return (
    <div>

      <ExplanationBox title="You Already Know the Chain Rule">
        <p>
          In the last step you learned that to find a weight&apos;s gradient you measure the rate
          at each link in the chain — how much the output changes when the weighted sum changes,
          how much the loss changes when the output changes, and so on — then put those rates
          together. That process has a name: the <strong>chain rule</strong>. You&apos;ve already been
          doing it. This step just makes it explicit so you understand why it works.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why the Rates Combine the Way They Do">
        <ChainDiagram highlight={['weight', 'weighted sum', 'output', 'loss']} />
        <p>
          When the weighted sum nudges up slightly, it moves the output by some amount — that&apos;s
          the sigmoid slope at this point on the curve. That output change then moves the loss
          by some amount — that&apos;s how fast the loss is climbing right now. The total effect
          on the loss is just those two effects compounding: if the slope is 0.21 and the loss
          sensitivity is 0.30, the nudge arrives at the loss scaled down to 0.21 × 0.30 of its
          original size. One more step back and you hit the weight itself — its lever arm is
          just its input, 0.8 for humidity, meaning changes to that weight move the weighted sum
          by 0.8 times as much. Chain all three together and you have the weight&apos;s full gradient:
          the blame that traveled from the loss all the way back to this one weight, scaled by
          every step it passed through. That&apos;s the chain rule — effects compound through a
          sequence of steps, each one scaling the signal by its own rate.
        </p>
      </ExplanationBox>

      <WorkedExample title="Tracing the Humidity Weight — With Real Numbers">
        <p>Prediction = 70% rain, target = 100%, humidity input = 0.80, humidity weight = 0.40.</p>

        <p style={{ marginTop: '1rem' }}><strong>Rate 1 — how fast is the loss changing right now?</strong></p>
        <CalcStep number={1}>Error = output − target = 0.70 − 1.0 = −0.30</CalcStep>
        <CalcStep number={2}>Loss sensitivity to output = −0.30 (prediction below target, so pushing output up helps)</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Rate 2 — how steep is sigmoid at 70% output?</strong></p>
        <CalcStep number={3}>Sigmoid slope = output × (1 − output) = 0.70 × 0.30 = 0.21</CalcStep>
        <CalcStep number={4}>The error signal passes through this slope: −0.30 × 0.21 = −0.063</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Rate 3 — what is the humidity weight's lever arm?</strong></p>
        <CalcStep number={5}>Humidity input = 0.80 — that is the lever arm</CalcStep>
        <CalcStep number={6}>Full gradient = −0.063 × 0.80 = −0.050</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Gradient = <strong>−0.050</strong>. Negative means the weight needs to go up.
          The humidity weight increases from 0.40 to 0.450 (with learning rate 0.5),
          pushing the prediction closer to 100%.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why the Sigmoid Slope Formula Is So Clean">
        <p>
          You might notice that the sigmoid slope — Rate 2 — has a surprisingly tidy formula:
          just the output multiplied by one minus the output. At 70% output that&apos;s 0.70 × 0.30 = 0.21.
          No messy constants anywhere.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That cleanliness comes from the number <em>e</em> at the heart of sigmoid. The derivative
          of e^x is e^x itself — it comes back unchanged. That property flows through the
          whole calculation and everything cancels out neatly, leaving just output × (1 − output).
          If sigmoid used a different base the slope formula would carry an extra constant through
          every single gradient in every single layer. Using e keeps it clean.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Same Logic Applies Everywhere in the Network">
        <p>
          The worked example above covers the output neuron. But hidden layer 2 has weights too,
          and hidden layer 1. The chain rule handles all of them the same way — the chain just
          gets longer. A weight in hidden layer 2 has to trace its effect through that layer&apos;s
          sigmoid, then through the output neuron&apos;s sigmoid, then to the loss. More steps, same
          process: measure the rate at each one, put them together.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The smart part is that by the time you&apos;re computing hidden layer 2&apos;s gradients, you&apos;ve
          already computed the output neuron&apos;s two rates. You reuse them instead of recomputing
          from scratch. Each layer hands its result backward to the layer before it. That
          efficient handoff is what turns the chain rule into the full backpropagation algorithm —
          which is exactly what the next step covers.
        </p>
      </ExplanationBox>

    </div>
  );
}
