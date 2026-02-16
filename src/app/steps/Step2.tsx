'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step2() {
  return (
    <div>
      {/* Single neuron black box diagram */}
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
            <linearGradient id="neuronGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa"/>
              <stop offset="100%" stopColor="#7c3aed"/>
            </linearGradient>
            <filter id="neuronShadow2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Input: Temperature */}
          <rect x="20" y="22" width="90" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="38" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">temperature</text>
          <text x="65" y="54" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">Hot ☀️</text>

          {/* Input: Humidity */}
          <rect x="20" y="98" width="90" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="114" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">humidity</text>
          <text x="65" y="130" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">Sticky 💧</text>

          {/* Arrows in */}
          <line x1="120" y1="42" x2="192" y2="72" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowHead2)"/>
          <line x1="120" y1="118" x2="192" y2="88" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowHead2)"/>

          {/* Neuron (black box) */}
          <circle cx="240" cy="80" r="40" fill="url(#neuronGrad2)" filter="url(#neuronShadow2)"/>
          <text x="240" y="74" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">magic</text>
          <text x="240" y="90" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">happens</text>

          {/* Arrow out */}
          <line x1="290" y1="80" x2="340" y2="80" stroke="#86efac" strokeWidth="2"/>

          {/* Output */}
          <rect x="350" y="58" width="110" height="44" rx="8" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1.5"/>
          <text x="405" y="76" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="500">confidence</text>
          <text x="405" y="93" textAnchor="middle" fill="#15803d" fontSize="16" fontWeight="700">82% rain</text>
        </svg>
      </div>

      <ExplanationBox title="A Neuron Is a Confidence Machine">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> A neuron takes in information and outputs a single number between 0% and 100% — its <strong>confidence</strong> that something is true.
        </div>
        <p>
          Think of a neuron like a friend who&apos;s really good at predicting rain. You tell them two things: the temperature and the humidity. They think about it for a moment, then tell you: &quot;I&apos;m 82% sure it&apos;ll rain today.&quot;
        </p>
        <p>
          That&apos;s literally what a neuron does. It takes in some numbers (the inputs), does some thinking (we&apos;ll learn the details in Part 2), and spits out a single number between 0 and 1. A 0 means &quot;no way&quot; and a 1 means &quot;absolutely yes.&quot;
        </p>
        <p>
          The neuron doesn&apos;t know anything when it starts — it&apos;s basically guessing. But after seeing thousands of examples of weather data and whether it actually rained, it gets better and better at making predictions. How? We&apos;ll get to that too.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why 0 to 1?">
        <p>
          The output is always between 0 and 1 because it represents <strong>confidence</strong>, like a percentage. You wouldn&apos;t say you&apos;re 250% sure about something — that doesn&apos;t make sense. And you can&apos;t be -30% sure either. So the neuron&apos;s output stays in a range that makes sense: 0% to 100%.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          <strong>Remember:</strong> A neuron = inputs in, confidence out. That&apos;s it. Everything else in neural networks builds on this one idea.
        </div>
      </ExplanationBox>
    </div>
  );
}
