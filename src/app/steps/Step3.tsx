'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      {/* Single neuron diagram at top */}
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
          viewBox="0 0 480 160"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="neuronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
            <filter id="neuronShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.3"/>
            </filter>
          </defs>

          <rect x="20" y="22" width="90" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">temperature</text>
          <text x="65" y="54" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">0.7</text>

          <rect x="20" y="98" width="90" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="114" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">humidity</text>
          <text x="65" y="130" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">0.8</text>

          <line x1="120" y1="42" x2="192" y2="72" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="120" y1="118" x2="192" y2="88" stroke="#cbd5e1" strokeWidth="2"/>

          <circle cx="240" cy="80" r="40" fill="url(#neuronGradient)" filter="url(#neuronShadow)"/>
          <text x="240" y="88" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="700">?</text>

          <line x1="290" y1="80" x2="340" y2="80" stroke="#86efac" strokeWidth="2"/>

          <rect x="350" y="62" width="100" height="36" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
          <text x="400" y="85" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="600">82% rain</text>
        </svg>
      </div>

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
