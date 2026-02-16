'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      {/* Multi-neuron feeding into rain predictor */}
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
          viewBox="0 0 520 240"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
            <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdba74"/>
              <stop offset="100%" stopColor="#f97316"/>
            </linearGradient>
            <linearGradient id="purpleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
          </defs>

          {/* Specialist neurons */}
          <circle cx="100" cy="40" r="30" fill="url(#blueGrad)"/>
          <text x="100" y="36" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">humidity</text>
          <text x="100" y="48" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">detector</text>

          <circle cx="100" cy="120" r="30" fill="url(#greenGrad)"/>
          <text x="100" y="116" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">pressure</text>
          <text x="100" y="128" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">detector</text>

          <circle cx="100" cy="200" r="30" fill="url(#orangeGrad)"/>
          <text x="100" y="196" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">temp</text>
          <text x="100" y="208" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">detector</text>

          {/* Confidence labels */}
          <text x="160" y="44" fill="#3b82f6" fontSize="13" fontWeight="700">0.9</text>
          <text x="160" y="124" fill="#22c55e" fontSize="13" fontWeight="700">0.7</text>
          <text x="160" y="204" fill="#f97316" fontSize="13" fontWeight="700">0.3</text>

          {/* Arrows to final neuron */}
          <line x1="140" y1="45" x2="280" y2="110" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="140" y1="120" x2="280" y2="120" stroke="#cbd5e1" strokeWidth="2"/>
          <line x1="140" y1="195" x2="280" y2="130" stroke="#cbd5e1" strokeWidth="2"/>

          {/* Rain predictor neuron */}
          <circle cx="320" cy="120" r="38" fill="url(#purpleGrad3)"/>
          <text x="320" y="114" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">rain</text>
          <text x="320" y="128" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600">predictor</text>

          {/* Output */}
          <line x1="365" y1="120" x2="405" y2="120" stroke="#86efac" strokeWidth="2"/>
          <rect x="410" y="100" width="95" height="40" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
          <text x="457" y="124" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="700">87% rain</text>
        </svg>
      </div>

      <ExplanationBox title="Neurons Have Specialties">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> Simple neurons that detect basic patterns can feed their confidence into a more complex neuron — building up from simple observations to smart predictions.
        </div>
        <p>
          Look at the diagram above. The humidity detector is 90% confident it&apos;s humid. The pressure detector is 70% confident the pressure is dropping. The temperature detector is only 30% confident it&apos;s hot.
        </p>
        <p>
          Each of these neurons is a specialist — it only cares about one thing. But individually, none of them can predict rain very well. High humidity alone doesn&apos;t guarantee rain. Low pressure alone doesn&apos;t either.
        </p>
        <p>
          The magic happens when you combine them. The rain predictor neuron takes all three confidence values as its inputs, weighs them (maybe humidity matters more than temperature for rain), and outputs its own confidence: 87% chance of rain.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Patterns Building on Patterns">
        <p>
          This is the big insight: <strong>you can stack neurons</strong>. Simple pattern detectors feed into more complex ones. The simple ones notice &quot;it&apos;s humid&quot; or &quot;pressure is dropping.&quot; The complex ones combine those observations into higher-level predictions like &quot;it&apos;s going to rain.&quot;
        </p>
        <p>
          This is exactly how your brain works, too. Individual brain cells don&apos;t &quot;see&quot; a face — some detect edges, some detect curves, some detect colors. But when they all feed their signals forward, you recognize your friend instantly.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          <strong>Remember:</strong> Neural networks get their power from combining many simple detectors into complex predictions. Each neuron is simple; the network is smart.
        </div>
      </ExplanationBox>
    </div>
  );
}
