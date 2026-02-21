'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="What is Bias?">
        <p>
          Weights control how much each input matters. But what if we want the neuron to have a
          starting assumption <em>before</em> it even looks at the inputs?
        </p>
        <p>
          <strong>Bias</strong> is a number that shifts the neuron&apos;s confidence threshold. It&apos;s
          added after the weighted sum, and it lets the neuron say &quot;I&apos;m already leaning toward
          yes&quot; or &quot;I&apos;m already leaning toward no&quot; before considering any evidence.
        </p>
        <p>
          <p>
            <strong>Rain example:</strong> Imagine we&apos;re predicting rain and one of our inputs is
            what state you&apos;re in. A neuron focused on humidity patterns might learn a positive bias
            if it&apos;s processing data from Texas — because Texas is so humid that there&apos;s already
            a higher baseline chance of rain before the neuron even looks at today&apos;s weather readings.
            That same neuron processing Arizona data might learn a negative bias, since the dry climate
            means rain is unlikely to start with.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Key point: bias is neuron-specific.</strong> Each individual neuron has its own bias
            value. You don&apos;t add a single bias to an entire layer — every neuron in the layer gets
            its own bias, because each neuron is detecting its own pattern and may need a different
            starting assumption.
          </p>
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights + Bias = The Full Picture">
        <p>
          Here&apos;s how weights and bias work together to make predictions:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Weights</strong> decide which inputs matter and by how much. High weight on humidity?
            Humidity has a big influence. Negative weight on temperature? Higher temps push the prediction down.</li>
          <li><strong>Bias</strong> is the neuron&apos;s starting confidence before looking at any inputs.
            Should this neuron already be leaning toward &quot;yes, rain&quot; or &quot;no rain&quot;?</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Together, they answer: &quot;Which inputs matter, how much do they matter, and what&apos;s our
          starting assumption?&quot; During training, the network adjusts both weights AND bias to find
          the combination that makes the best predictions.
        </p>
      </ExplanationBox>

      <MathFormula label="Neuron Calculation (so far)">
        output = (input₁ × weight₁) + (input₂ × weight₂) + bias
      </MathFormula>

      {/* Bias shift diagram */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 460 100" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Without bias */}
          <text x="10" y="28" fill="#64748b" fontSize="11" fontWeight="500">Without bias:</text>
          <rect x="120" y="14" width="80" height="28" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="160" y="33" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">z = 1.39</text>
          <text x="220" y="33" fill="#94a3b8" fontSize="11">→</text>
          <rect x="240" y="14" width="120" height="28" rx="6" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5"/>
          <text x="300" y="33" textAnchor="middle" fill="#64748b" fontSize="11">confidence: 80%</text>

          {/* With positive bias */}
          <text x="10" y="75" fill="#64748b" fontSize="11" fontWeight="500">With bias +0.1:</text>
          <rect x="120" y="60" width="80" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="160" y="79" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="600">z = 1.49</text>
          <text x="220" y="79" fill="#94a3b8" fontSize="11">→</text>
          <rect x="240" y="60" width="120" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="300" y="79" textAnchor="middle" fill="#15803d" fontSize="11">confidence: 82%</text>
          <text x="380" y="79" fill="#15803d" fontSize="11" fontWeight="600">↑ nudged up</text>
        </svg>
      </div>


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
          {' '}<strong>backpropagation</strong> comes in—a process we&apos;ll explore soon, where the
          network looks at its mistakes and nudges both weights and biases to do better next time.
        </p>
      </ExplanationBox>

      <p>
        <strong>Simpler version:</strong> Bias starts at 0 because we don&apos;t want the neuron to have
        any opinion before it sees the data. It&apos;s like a judge who starts neutral and only forms
        an opinion after hearing the evidence. The network will learn the right bias during training.
      </p>

      <ExplanationBox title="Why Weights Can't Start at Zero">
        <p>
          Bias starts at zero—but weights start as small <em>random</em> values. Why can&apos;t
          weights start at zero too? Let&apos;s walk through an example.
        </p>

        <p style={{ marginTop: '1rem' }}>
          Imagine a network with 3 neurons in a hidden layer, each taking in temperature, humidity,
          and wind speed. All three neurons feed into one final output neuron that predicts rain:
        </p>

        {/* Network diagram */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '16px',
          padding: '32px 12px',
          marginTop: '1rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <svg
            viewBox="0 0 400 190"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', maxWidth: '460px', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="neuronGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa"/>
                <stop offset="100%" stopColor="#7c3aed"/>
              </linearGradient>
              <filter id="shadowA" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.3"/>
              </filter>
              <filter id="shadowOut" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#22c55e" floodOpacity="0.2"/>
              </filter>
            </defs>

            {/* Input labels */}
            <rect x="30" y="18" width="90" height="34" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
            <text x="75" y="30" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="500">temperature</text>
            <text x="75" y="44" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">72°F</text>

            <rect x="30" y="78" width="90" height="34" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
            <text x="75" y="90" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="500">humidity</text>
            <text x="75" y="104" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">85%</text>

            <rect x="30" y="138" width="90" height="34" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
            <text x="75" y="150" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="500">wind speed</text>
            <text x="75" y="164" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">15 mph</text>

            {/* Connections: inputs → hidden */}
            <line x1="120" y1="35" x2="175" y2="40" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="35" x2="175" y2="95" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="35" x2="175" y2="150" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="95" x2="175" y2="40" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="95" x2="175" y2="95" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="95" x2="175" y2="150" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="155" x2="175" y2="40" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="155" x2="175" y2="95" stroke="#cbd5e1" strokeWidth="1.5"/>
            <line x1="120" y1="155" x2="175" y2="150" stroke="#cbd5e1" strokeWidth="1.5"/>

            {/* Hidden neurons — same gradient as Step2 */}
            <circle cx="200" cy="40" r="25" fill="url(#neuronGrad5)" filter="url(#shadowA)"/>
            <text x="200" y="44" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">A</text>

            <circle cx="200" cy="95" r="25" fill="url(#neuronGrad5)" filter="url(#shadowA)"/>
            <text x="200" y="99" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">B</text>

            <circle cx="200" cy="150" r="25" fill="url(#neuronGrad5)" filter="url(#shadowA)"/>
            <text x="200" y="154" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700">C</text>

            {/* Connections: hidden → output */}
            <line x1="225" y1="40" x2="305" y2="95" stroke="#86efac" strokeWidth="1.5"/>
            <line x1="225" y1="95" x2="305" y2="95" stroke="#86efac" strokeWidth="1.5"/>
            <line x1="225" y1="150" x2="305" y2="95" stroke="#86efac" strokeWidth="1.5"/>

            {/* Output neuron */}
            <circle cx="330" cy="95" r="25" fill="#22c55e" filter="url(#shadowOut)"/>
            <text x="330" y="99" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">Rain (%)</text>
          </svg>
        </div>

        <p style={{ marginTop: '1.25rem' }}>
          Even though every neuron takes in the same three inputs, the goal is for each one to
          develop its own perspective on that data:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Neuron A</strong> might end up learning to focus on temperature—recognizing
            that extreme cold or heat is a strong rain signal on its own</li>
          <li><strong>Neuron B</strong> might end up learning to value humidity more than
            the others, but still pay attention to wind—picking up on muggy, breezy conditions
            that often lead to storms</li>
          <li><strong>Neuron C</strong> might end up learning to care most about temperature
            but also factor in humidity—detecting the hot-and-humid combo that leads to afternoon rain</li>
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
          <li><strong>Neuron A:</strong> (0 × 72) + (0 × 85) + (0 × 15) = <strong>0</strong></li>
          <li><strong>Neuron B:</strong> (0 × 72) + (0 × 85) + (0 × 15) = <strong>0</strong></li>
          <li><strong>Neuron C:</strong> (0 × 72) + (0 × 85) + (0 × 15) = <strong>0</strong></li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The exact same calculation, the exact same output. Now the network checks its prediction
          against the right answer—as you&apos;ll learn later, it calculates a number representing
          how far off it was, then works backward to figure out how much to nudge each weight.
          But since every neuron produced the same output (0), they all contributed to the mistake
          equally—so the network gives them all the <strong>exact same correction</strong>. After
          updating, all three neurons have the same new weights. They&apos;re still identical. Next
          round, the same thing happens. And the next. <strong>Forever.</strong> Three neurons, but
          they&apos;re all stuck doing one job—you&apos;ve wasted two of them. This is called
          the <strong>symmetry problem</strong>.
        </p>

        <p style={{ marginTop: '1rem' }}>
          You might be thinking: &quot;But after they adjust, won&apos;t the new inputs break them
          out of it?&quot; Remember—every neuron in a layer receives the <em>same</em> inputs. That&apos;s
          by design, because each neuron is supposed to learn a <em>different pattern</em> from those
          shared inputs. So the inputs alone can&apos;t save you. If all the weights are identical—whether
          they&apos;re all 0 or all 2,000—every neuron computes the same output, gets the same correction,
          and updates the same way. They stay locked in sync. However, if even <em>one</em> weight differs
          between two neurons, their outputs will differ, which means the corrections they receive will
          differ, which means their weights drift further apart over time. That one small difference is
          all it takes to break the symmetry.
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>How random weights fix it:</strong> give each neuron different starting weights
          and now they compute different outputs from the same inputs. When the network checks its
          mistake, each neuron contributed differently—so each one gets a <em>different</em> correction.
          Those small differences compound over time, and the neurons naturally drift toward
          specializing in different patterns. Random weights don&apos;t decide what each neuron will
          eventually detect—they just make sure each neuron has a unique starting point so it
          {' '}<em>can</em> become something different.
        </p>

        <p style={{ marginTop: '1rem' }}>
          <strong>Could neurons accidentally become clones later?</strong> Not really. Each neuron
          has 3 weights, and for two neurons to become true clones, all 3 would need to land on the
          exact same values at the exact same time. Since they&apos;re already computing different
          things, their weights are being pulled in different directions—so this is essentially
          impossible.
        </p>
      </ExplanationBox>

      <p>
        <strong>Simpler version:</strong> If all neurons start with the same weights, they all do the exact
        same math and get the exact same answer — forever. It&apos;s like hiring 3 people but they all think
        identically, so you really only have 1. Random starting weights give each neuron a unique perspective,
        so they can specialize in different patterns (one learns humidity patterns, another learns temperature patterns).
      </p>

      <p>
        <strong>Rain check:</strong> We now have all the pieces for our rain neuron — inputs (0.7, 0.8),
        weights (-0.3, 2.0), and bias (0.1). Next we&apos;ll combine them into a single number called z,
        the neuron&apos;s raw signal that determines its final confidence.
      </p>
    </div>
  );
}
