'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step5() {
  return (
    <div>
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
          viewBox="0 0 420 340"
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

          {/* Step 3: Trace Blame */}
          <rect x="140" y="195" width="140" height="50" rx="12" fill="url(#blameGrad)"/>
          <text x="210" y="217" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500">③ Trace</text>
          <text x="210" y="231" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Blame Back</text>

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

          {/* Bottom labels */}
          <text x="210" y="290" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">starts random → gets accurate</text>
          <rect x="100" y="300" width="220" height="8" rx="4" fill="#e2e8f0"/>
          <rect x="100" y="300" width="180" height="8" rx="4" fill="url(#adjustGrad)"/>
          <text x="100" y="325" fill="#94a3b8" fontSize="9">bad at first</text>
          <text x="280" y="325" fill="#22c55e" fontSize="9" textAnchor="end">really good!</text>
        </svg>
      </div>

      <ExplanationBox title="How a Network Learns">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> A network learns by making predictions, checking how wrong it was, figuring out which weights caused the mistake, and adjusting them. It does this thousands of times.
        </div>
        <p>
          When a network is brand new, all its weights are random. It has no idea what it&apos;s doing. If you ask it &quot;will it rain?&quot; it might say 50% — basically a coin flip.
        </p>
        <p>
          But then we show it real data. We give it a hot, humid day and tell it &quot;yes, it rained.&quot; The network predicted 50%, but the right answer was 100%. That&apos;s a big error.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Four-Step Loop">
        <p>
          <strong>① Predict</strong> — Feed data through the network and get an output (like 50% rain).
        </p>
        <p>
          <strong>② Measure Error</strong> — Compare the prediction to reality. We said 50%, but it actually rained (100%). The error is big.
        </p>
        <p>
          <strong>③ Trace Blame Back</strong> — Figure out which weights contributed most to the mistake. &quot;This weight on humidity was too low — it should have paid more attention to humidity!&quot;
        </p>
        <p>
          <strong>④ Adjust Weights</strong> — Nudge each weight a tiny bit in the direction that would reduce the error. Increase the humidity weight, decrease the temperature weight, etc.
        </p>
        <p>
          Then repeat. After thousands of examples, the weights settle into values that make good predictions. The network has &quot;learned.&quot;
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          <strong>Remember:</strong> The network doesn&apos;t learn rules like &quot;if humidity {'>'} 80%, predict rain.&quot; It learns <em>weights</em> — numbers that make its predictions match reality. The learning is automatic.
        </div>
      </ExplanationBox>
    </div>
  );
}
