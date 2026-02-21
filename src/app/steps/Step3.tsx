'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      {/* 3-layer network diagram with hover labels */}
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
          viewBox="0 0 560 280"
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id="inputGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <linearGradient id="hiddenGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
            <linearGradient id="outputGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
          </defs>

          {/* Layer labels */}
          <text x="80" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Layer 1</text>
          <text x="280" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Layer 2</text>
          <text x="480" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Layer 3</text>

          {/* Input neurons */}
          <circle cx="80" cy="70" r="28" fill="url(#inputGrad3)"/>
          <text x="80" y="66" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">humidity</text>
          <text x="80" y="78" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">0.90</text>

          <circle cx="80" cy="150" r="28" fill="url(#inputGrad3)"/>
          <text x="80" y="146" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">pressure</text>
          <text x="80" y="158" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">0.70</text>

          <circle cx="80" cy="230" r="28" fill="url(#inputGrad3)"/>
          <text x="80" y="226" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">temp</text>
          <text x="80" y="238" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">0.30</text>

          {/* Connections: layer 1 → layer 2 */}
          <line x1="112" y1="70" x2="248" y2="110" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="70" x2="248" y2="190" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="150" x2="248" y2="110" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="150" x2="248" y2="190" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="230" x2="248" y2="110" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="230" x2="248" y2="190" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>

          {/* Hidden neurons */}
          <circle cx="280" cy="110" r="28" fill="url(#hiddenGrad3)"/>
          <text x="280" y="106" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">storm</text>
          <text x="280" y="118" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">conditions</text>

          <circle cx="280" cy="190" r="28" fill="url(#hiddenGrad3)"/>
          <text x="280" y="186" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">warm</text>
          <text x="280" y="198" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">unstable air</text>

          {/* Connections: layer 2 → output */}
          <line x1="312" y1="110" x2="448" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="312" y1="190" x2="448" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>

          {/* Confidence labels on layer 2 outputs */}
          <text x="330" y="100" fill="#7c3aed" fontSize="11" fontWeight="700">0.85</text>
          <text x="330" y="205" fill="#7c3aed" fontSize="11" fontWeight="700">0.60</text>

          {/* Output neuron */}
          <circle cx="480" cy="150" r="28" fill="url(#outputGrad3)"/>
          <text x="480" y="146" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">rain?</text>
          <text x="480" y="158" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">87%</text>

          {/* Flow arrow */}
          <text x="280" y="268" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">data flows left → right</text>
        </svg>
      </div>

      <ExplanationBox title="Neurons Have Specialties">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> Simple neurons that detect basic patterns can feed their confidence into more complex neurons — building up from simple observations to smarter predictions.
        </div>

        <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Layer 1 — Simple Specialists</h4>
        <p>
          In the first layer, each neuron is a specialist. Remember from earlier: a neuron is a confidence machine. It takes in information and outputs a number between 0 and 1 — its confidence that something is true.
        </p>
        <p>Here, we have three simple detectors:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Humidity neuron:</strong> 0.90 (90% confident it&apos;s humid)</li>
          <li><strong>Pressure neuron:</strong> 0.70 (70% confident pressure is dropping)</li>
          <li><strong>Temperature neuron:</strong> 0.30 (30% confident it&apos;s hot)</li>
        </ul>
        <p>
          Each output is just a number between 0 and 1 — just like we discussed before. They&apos;re not making a final decision. They&apos;re just expressing confidence in their specific observation.
        </p>
        <p>
          Individually, none of them can predict rain very well. High humidity alone doesn&apos;t guarantee rain. Low pressure alone doesn&apos;t either. Each neuron is limited because it only sees one piece of the puzzle.
        </p>

        <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Layer 2 — Pattern Combiners</h4>
        <p>
          The second layer receives those confidence values, not raw weather data.
        </p>
        <p>
          <strong>This is important.</strong> The humidity neuron doesn&apos;t pass &quot;moist air.&quot; It passes 0.90. The pressure neuron passes 0.70. The temperature neuron passes 0.30.
        </p>
        <p>
          Now new neurons combine those numbers. Since every neuron is a confidence machine, these neurons also output values between 0 and 1 — but they detect more complex patterns. For example, one neuron might detect <strong>storm-building conditions</strong> (high humidity + dropping pressure together). Another might detect <strong>warm unstable air</strong> (temperature interacting with humidity).
        </p>
        <p>
          These second-layer neurons weigh the inputs differently. Maybe humidity matters more than temperature. Maybe dropping pressure is a strong signal. After combining and calculating, each one outputs its own confidence score.
        </p>
        <p>
          So now we&apos;ve moved from &quot;Is it humid?&quot; to &quot;Does this combination look like a storm forming?&quot;
        </p>

        <h4 style={{ marginTop: '1.25rem', marginBottom: '0.5rem' }}>Layer 3 — Final Prediction</h4>
        <p>
          The final neuron takes the confidence values from Layer 2 and produces one last number between 0 and 1. Maybe the storm-building neuron outputs 0.85. Maybe the unstable-air neuron outputs 0.60. The final neuron weighs those and outputs: <strong>0.87 — an 87% confidence that it will rain.</strong>
        </p>
        <p>
          Just like before, this output stays between 0 and 1 because it represents confidence. It&apos;s the same rule we discussed earlier: neurons don&apos;t output &quot;yes&quot; or &quot;no.&quot; They output how confident they are.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Patterns Building on Patterns">
        <p>
          The power comes from stacking these confidence machines:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Layer 1</strong> detects basic signals</li>
          <li><strong>Layer 2</strong> detects combinations of signals</li>
          <li><strong>Layer 3</strong> produces a high-level prediction</li>
        </ul>
        <p>
          Each neuron is simple. Each one only outputs a number between 0 and 1. But when you stack them, simple confidence scores build into complex, intelligent predictions.
        </p>
      </ExplanationBox>
    </div>
  );
}
