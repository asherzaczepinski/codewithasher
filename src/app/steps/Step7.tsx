'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step7() {
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
          <text x="65" y="54" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">72°F</text>

          <rect x="20" y="98" width="90" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="114" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="500">humidity</text>
          <text x="65" y="130" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="600">85%</text>

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
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Our goal:</strong> We want to predict whether it&apos;ll rain given today&apos;s temperature and humidity.
          A single neuron can take these inputs and output a confidence level — like &quot;82% sure it&apos;ll rain.&quot;
        </div>
        <p>
          A neuron takes in some inputs, does math on them, and outputs a single number
          between 0 and 1. That number represents <strong>how confident</strong> the neuron is
          that the inputs match whatever pattern it was trained to detect.
        </p>
        <p>
          For example, say we train a neuron to detect rain. We feed it temperature and humidity,
          it does some math we haven&apos;t learned yet, and outputs <strong>0.82</strong>—meaning
          &quot;I&apos;m 82% confident these conditions lead to rain.&quot; Feed it a dry, cool day
          and it might output <strong>0.15</strong>—low confidence that it&apos;ll rain.
          Same neuron, different inputs, different confidence.
        </p>
        <p>
          But rain detection isn&apos;t the only thing a neuron can do. A different neuron might
          take in air pressure and wind speed and output how confident it is that it detects
          a <strong>wind pattern</strong>. Another might detect <strong>cloud cover</strong> from
          satellite data. Each neuron is just answering one question: &quot;how confident am I
          that my inputs match the pattern I&apos;m looking for?&quot;
        </p>
        <p>
          Here&apos;s where it gets powerful: those confidence values become inputs to <em>other</em> neurons.
          Imagine a final neuron that takes in the wind neuron&apos;s confidence (0.7), the humidity
          neuron&apos;s confidence (0.9), the cloud cover neuron&apos;s confidence (0.8), and the
          temperature neuron&apos;s confidence (0.3)—and combines them all to make a much smarter
          prediction about whether it&apos;ll rain. That&apos;s the core idea behind neural networks:
          neurons feeding confidence into other neurons, building up from simple patterns to complex ones.
        </p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          <strong>Back to rain:</strong> Our rain neuron will take temperature (0.7) and humidity (0.8)
          as normalized inputs, apply weights to decide how much each matters, and output a confidence
          level. Next, we&apos;ll learn how to normalize those raw inputs.
        </div>
      </ExplanationBox>
    </div>
  );
}
