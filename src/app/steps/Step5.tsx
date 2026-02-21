'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="How a Network Learns">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> A network learns by adjusting its weights — the numbers that decide how important each signal is for each neuron.
        </div>
        <p>
          Remember from the last slide: weights control how much each neuron listens to the signals coming in. They determine which inputs get emphasized and which get downplayed. This is how neurons specialize in detecting certain patterns — like storm-building conditions or unstable heat patterns in our rain example.
        </p>
        <p>
          When the network first starts, the weights are basically random. That means if we ask, &quot;Will it rain?&quot; and pass in inputs like temperature, humidity, and pressure, the network could output something like 23.3%, 87.6%, or 5.1% — basically a random number. At this stage, it hasn&apos;t learned which signals matter most for each neuron&apos;s specialization.
        </p>
        <p>
          Then we give it real data. Imagine a hot, humid day with dropping pressure. The network predicts 23.3% chance of rain, but in reality, it did rain — meaning the true outcome is 100%. This shows that some neurons weren&apos;t emphasizing the right signals — maybe the &quot;Storm Conditions&quot; neuron didn&apos;t weight humidity high enough, or the &quot;Heat Pattern&quot; neuron overemphasized temperature.
        </p>
      </ExplanationBox>

      {/* Learning loop diagram */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '40px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}>
        <svg
          viewBox="0 0 420 300"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="predictGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fca5a5"/>
              <stop offset="100%" stopColor="#ef4444"/>
            </linearGradient>
            <linearGradient id="blameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74"/>
              <stop offset="100%" stopColor="#f97316"/>
            </linearGradient>
            <linearGradient id="adjustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
          </defs>

          {/* Step 1: Predict */}
          <rect x="140" y="20" width="140" height="50" rx="12" fill="url(#predictGrad)"/>
          <text x="210" y="42" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">① Make a</text>
          <text x="210" y="56" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Prediction</text>

          {/* Arrow down-right */}
          <path d="M 280 55 Q 340 55 340 110" stroke="#cbd5e1" strokeWidth="2" fill="none"/>

          {/* Step 2: Measure Error */}
          <rect x="270" y="110" width="140" height="50" rx="12" fill="url(#errorGrad)"/>
          <text x="340" y="132" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">② Measure</text>
          <text x="340" y="146" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Error</text>

          {/* Arrow down-left */}
          <path d="M 340 165 Q 340 220 280 220" stroke="#cbd5e1" strokeWidth="2" fill="none"/>

          {/* Step 3: Trace Responsibility */}
          <rect x="140" y="195" width="140" height="50" rx="12" fill="url(#blameGrad)"/>
          <text x="210" y="217" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">③ Trace</text>
          <text x="210" y="231" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Responsibility</text>

          {/* Arrow down-left */}
          <path d="M 140 230 Q 80 230 80 175" stroke="#cbd5e1" strokeWidth="2" fill="none"/>

          {/* Step 4: Adjust */}
          <rect x="10" y="110" width="140" height="50" rx="12" fill="url(#adjustGrad)"/>
          <text x="80" y="132" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">④ Adjust</text>
          <text x="80" y="146" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Weights</text>

          {/* Arrow up back to predict */}
          <path d="M 80 110 Q 80 55 140 45" stroke="#cbd5e1" strokeWidth="2" fill="none"/>

          {/* Center label */}
          <text x="210" y="145" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">repeat</text>
          <text x="210" y="160" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">1000s of</text>
          <text x="210" y="175" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">times</text>
        </svg>
      </div>

      <ExplanationBox title="How Training Works">
        <p>Through a repeated feedback loop:</p>
        <p>
          <strong>① Predict</strong> — The network feeds the inputs forward through the layers. Each neuron combines its weighted signals and outputs a confidence score.
        </p>
        <p>
          <strong>② Measure Error</strong> — Compare the prediction to reality. In this case, predicted 23.3% vs actual 100%.
        </p>
        <p>
          <strong>③ Trace Responsibility</strong> — Determine which weights caused the mistake, identifying which neurons need to adjust their focus.
        </p>
        <p>
          <strong>④ Adjust Weights</strong> — Update the weights so that the neurons specialize more appropriately: emphasizing the signals that matter and reducing influence from those that don&apos;t.
        </p>
        <p>
          Over thousands of examples — humid rainy days, dry clear days, cold snowy days — the weights gradually shift. Each hidden neuron develops specialization: some neurons focus on storm-building patterns (high humidity + dropping pressure), others focus on heat or temperature patterns. Each neuron learns which signals to prioritize and which to ignore.
        </p>
        <p>
          We&apos;ll learn the exact math behind this later.
        </p>
      </ExplanationBox>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>For now, what you need to know is:</strong> The network trains by adjusting the weights based on our data. These adjustments let each neuron specialize in meaningful patterns, helping the network produce more accurate confidence predictions — like outputting 87% chance of rain when conditions really call for it.
        <br/><br/>
        <strong>Important:</strong> We don&apos;t tell the network how to specialize. It learns on its own which patterns to focus on, purely from the data and the feedback it receives.
      </div>
    </div>
  );
}
