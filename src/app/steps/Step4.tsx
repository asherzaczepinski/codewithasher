'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step4() {
  return (
    <div>
      {/* Full 3-layer network diagram */}
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
            <linearGradient id="inputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd"/>
              <stop offset="100%" stopColor="#3b82f6"/>
            </linearGradient>
            <linearGradient id="hiddenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
            <linearGradient id="outputGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac"/>
              <stop offset="100%" stopColor="#22c55e"/>
            </linearGradient>
          </defs>

          {/* Layer labels */}
          <text x="80" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Input Layer</text>
          <text x="280" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Hidden Layer</text>
          <text x="480" y="25" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="600">Output Layer</text>

          {/* Input neurons */}
          <circle cx="80" cy="100" r="28" fill="url(#inputGrad)"/>
          <text x="80" y="96" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">temp</text>
          <text x="80" y="108" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">72°F</text>

          <circle cx="80" cy="200" r="28" fill="url(#inputGrad)"/>
          <text x="80" y="196" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">humidity</text>
          <text x="80" y="208" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">85%</text>

          {/* Connections: input → hidden */}
          <line x1="112" y1="100" x2="248" y2="80" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="100" x2="248" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="100" x2="248" y2="220" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="200" x2="248" y2="80" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="200" x2="248" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="112" y1="200" x2="248" y2="220" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>

          {/* Hidden neurons */}
          <circle cx="280" cy="80" r="28" fill="url(#hiddenGrad)"/>
          <text x="280" y="76" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">humid +</text>
          <text x="280" y="88" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">warm?</text>

          <circle cx="280" cy="150" r="28" fill="url(#hiddenGrad)"/>
          <text x="280" y="146" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">pressure</text>
          <text x="280" y="158" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">drop?</text>

          <circle cx="280" cy="220" r="28" fill="url(#hiddenGrad)"/>
          <text x="280" y="216" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">seasonal</text>
          <text x="280" y="228" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">pattern?</text>

          {/* Connections: hidden → output */}
          <line x1="312" y1="80" x2="448" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="312" y1="150" x2="448" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>
          <line x1="312" y1="220" x2="448" y2="150" stroke="#cbd5e1" strokeWidth="1.5" opacity="0.6"/>

          {/* Output neuron */}
          <circle cx="480" cy="150" r="28" fill="url(#outputGrad)"/>
          <text x="480" y="146" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">rain?</text>
          <text x="480" y="158" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">82%</text>

          {/* Flow arrow */}
          <text x="280" y="268" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">data flows left → right</text>
        </svg>
      </div>

      <ExplanationBox title="Layers: How a Network Is Organized">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> A neural network organizes neurons into layers. Data flows forward — from inputs, through hidden layers, to the output.
        </div>
        <p>
          Look at the diagram. There are three columns of neurons — those are <strong>layers</strong>:
        </p>
        <p>
          <strong>Input Layer</strong> — This is where raw data enters. In our rain example, it&apos;s temperature and humidity. These neurons don&apos;t do any thinking — they just pass the data forward.
        </p>
        <p>
          <strong>Hidden Layer</strong> — This is where the magic happens. These neurons develop &quot;specialties&quot; — one might learn to detect &quot;humid and warm&quot; combos, another might pick up on pressure patterns. We call them &quot;hidden&quot; because we never see their outputs directly.
        </p>
        <p>
          <strong>Output Layer</strong> — This gives us the final answer. For rain prediction, it&apos;s one neuron outputting a confidence: 82% chance of rain.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Every Neuron Connects to Every Neuron in the Next Layer">
        <p>
          Notice all those lines in the diagram? Every input neuron connects to every hidden neuron. Every hidden neuron connects to the output. That&apos;s why it&apos;s called a &quot;fully connected&quot; network — everyone talks to everyone in the next layer.
        </p>
        <p>
          Each connection has a <strong>weight</strong> — a number that controls how much influence one neuron has on the next. Some connections matter a lot (strong weight), others barely matter (weak weight). The network learns the right weights during training.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          <strong>Remember:</strong> Data flows in one direction — forward. Input → Hidden → Output. This is called <strong>forward propagation</strong>, and we&apos;ll do the math for it in Part 2.
        </div>
      </ExplanationBox>
    </div>
  );
}
