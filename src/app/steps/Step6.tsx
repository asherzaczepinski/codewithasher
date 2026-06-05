'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import BiasNetwork from '@/components/BiasNetwork';
import BiasVsWeightsChart from '@/components/BiasVsWeightsChart';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="What is Bias?">
        <p>
          Weights control how much each input matters. But what if we want the neuron to have a
          starting assumption <em>before</em> it even looks at the inputs?
        </p>
        <p>
          <strong>Bias </strong> is a number that shifts the neuron&apos;s confidence threshold. It&apos;s
          added after the weighted sum, and it lets the neuron say &quot;I&apos;m already leaning toward
          yes&quot; or &quot;I&apos;m already leaning toward no&quot; before considering any evidence. Think of it as the neuron&apos;s built-in personality — a negative bias makes it naturally skeptical, requiring strong signals just to get off the ground, while a positive bias makes it naturally optimistic, firing by default unless something actively convinces it not to.
        </p>
        <p>
          <strong>Rain example: </strong> Take the <strong>Warm &amp; Wet</strong> neuron from our network. Its job is to detect when it&apos;s both hot <em>and</em> humid — not just one or the other. Its weights are +3 on temperature and +3 on humidity. With our inputs of temp=0.7 and humidity=0.8, the weighted sum alone is:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', margin: '0.5rem 0', fontSize: '14px' }}>
          (0.7 × 3) + (0.8 × 3) = 2.1 + 2.4 = <strong>4.5</strong>
        </p>
        <p>
          That&apos;s a strong signal — it would fire confidently on any warm, moist day. But this neuron has a bias of <strong>−4</strong>. Add that in:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', margin: '0.5rem 0', fontSize: '14px' }}>
          4.5 + (−4) = <strong>+0.5</strong>
        </p>
        <p>
          Now it barely fires. The −4 bias is a built-in skepticism: &quot;don&apos;t get excited unless both inputs are genuinely strong.&quot; A slightly cooler or drier day would push it negative entirely. That&apos;s exactly the point — this neuron should only activate on truly warm <em>and</em> humid days, not just mildly warm ones.
        </p>
        <BiasNetwork />
        <p>
          <strong>Key point: bias is neuron-specific. </strong> Each individual neuron has its own bias
          value. You don&apos;t add a single bias to an entire layer — every neuron in the layer gets
          its own bias, because each neuron is detecting its own pattern and may need a different
          starting assumption.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights + Bias Formula">
        <MathFormula label="Neuron Calculation">
          output = (input₁ × weight₁) + (input₂ × weight₂) + bias
        </MathFormula>
      </ExplanationBox>

      <ExplanationBox title="How Neural Networks Initialize Bias">
        <p>
          When a neural network first starts, the most common approach is to initialize all biases
          to <strong>zero</strong>.
        </p>
        <p style={{ marginTop: '1rem' }}>
          Why zero? Because bias is meant to be <em>learned</em>, not assumed. Starting at zero
          means the neuron has no built-in preference—it&apos;s a blank slate. Bias just needs to
          stay out of the way at first, then adjust naturally during training.
        </p>
        <p style={{ marginTop: '1rem' }}>
          But how does the network know when and how much to adjust bias? That&apos;s where
          {' '}<strong>backpropagation </strong> comes in—a process we&apos;ll explore soon, where the
          network looks at its mistakes and nudges both weights and biases to do better next time.
        </p>
      </ExplanationBox>

      

      <ExplanationBox title="Why Weights Can't Start at Zero">
        <p>
          Bias starts at zero—but weights start as small <em>random </em> values. Why can&apos;t
          weights start at zero too? Let&apos;s walk through an example.
        </p>

        <p style={{ marginTop: '1rem' }}>
          Imagine a network with 3 neurons in a hidden layer, each taking in temperature and
          humidity. All three neurons feed into one final output neuron that predicts rain.
        </p>

        <p style={{ marginTop: '1.25rem' }}>
          Even though every neuron takes in the same two inputs, the goal is for each one to
          develop its own perspective on that data:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Neuron A</strong> might end up learning to focus on humidity—recognizing
            that high moisture is a strong rain signal on its own</li>
          <li><strong>Neuron B</strong> might end up learning to weigh both inputs equally—picking
            up on the warm-and-wet combo that often leads to storms</li>
          <li><strong>Neuron C</strong> might end up learning to care most about temperature
            but also factor in humidity—detecting cool, damp conditions that lead to drizzle</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          This variability is what lets the network account for different weather scenarios. Each
          neuron covers patterns that no single neuron could catch alone, and the output neuron
          combines all three perspectives to make a smarter prediction.
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>But if all weights start at zero</strong>, none of that happens. Look at what
          each neuron computes:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8', fontFamily: 'monospace' }}>
          <li><strong>Neuron A:</strong> (0 × 0.7) + (0 × 0.8) = <strong>0</strong></li>
          <li><strong>Neuron B:</strong> (0 × 0.7) + (0 × 0.8) = <strong>0</strong></li>
          <li><strong>Neuron C:</strong> (0 × 0.7) + (0 × 0.8) = <strong>0</strong></li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The exact same calculation, the exact same output. Now the network checks its prediction
          against the right answer—as you&apos;ll learn later, it calculates a number representing
          how far off it was, then works backward to figure out how much to nudge each weight.
          But since every neuron produced the same output (0), they all contributed to the mistake
          equally—so the network gives them all the <strong>exact same correction</strong>. After
          updating, all three neurons have the same new weights. They&apos;re still identical. Next
          round, the same thing happens. And the next. <strong>Forever. </strong> Three neurons, but
          they&apos;re all stuck doing one job—you&apos;ve wasted two of them. This is called
          the <strong>symmetry problem</strong>.
        </p>

        <p style={{ marginTop: '1rem' }}>
          You might be thinking: &quot;But after they adjust, won&apos;t the new inputs break them
          out of it?&quot; Remember—every neuron in a layer receives the <em>same </em> inputs. That&apos;s
          by design, because each neuron is supposed to learn a <em>different pattern </em> from those
          shared inputs. So the inputs alone can&apos;t save you. If all the weights are identical—whether
          they&apos;re all 0 or all 2,000—every neuron computes the same output, gets the same correction,
          and updates the same way. They stay locked in sync. However, if even <em>one</em> weight differs
          between two neurons, their outputs will differ, which means the corrections they receive will
          differ, which means their weights drift further apart over time. That one small difference is
          all it takes to break the symmetry.
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>How random weights fix it: </strong> give each neuron different starting weights
          and now they compute different outputs from the same inputs. When the network checks its
          mistake, each neuron contributed differently—so each one gets a <em>different </em> correction.
          Those small differences compound over time, and the neurons naturally drift toward
          specializing in different patterns. Random weights don&apos;t decide what each neuron will
          eventually detect—they just make sure each neuron has a unique starting point so it
          {' '}<em>can</em> become something different.
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>Could neurons accidentally become clones later? </strong> Not really. Each neuron
          has 2 weights, and for two neurons to become true clones, both would need to land on the
          exact same values at the exact same time. Since they&apos;re already computing different
          things, their weights are being pulled in different directions—so this is essentially
          impossible.
        </p>
      </ExplanationBox>

    </div>
  );
}
