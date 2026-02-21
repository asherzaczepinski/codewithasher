'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="What Are Weights?">
        <p>
          A neuron takes normalized inputs and produces an output (its confidence). But how does it
          decide how much each input matters? That&apos;s where <strong>weights</strong> come in.
        </p>
        <p>
          A weight is a number that controls how much an input affects the neuron&apos;s confidence.
          Higher weight = more influence on confidence. Lower weight = less influence. Negative weight
          = pushes confidence <em>down</em>.
        </p>
        <p>
          In our rain example: humidity should have a big positive weight (high humidity → more confident
          it&apos;ll rain), while temperature gets a small negative weight (hotter → slightly less confident
          it&apos;ll rain).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights for Rain Prediction">
        <p>
          For predicting rain, we&apos;ll use these weights:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Temperature weight: -0.3</strong> — Higher temperature slightly <em>reduces</em> rain
            prediction. Conversely, lower temperatures
            increase the rain signal.</li>
          <li><strong>Humidity weight: 2.0</strong> — Higher humidity strongly <em>increases</em> rain
            prediction. A weight above 1 means humidity has an amplified effect — the neuron treats it as
            a very strong signal for rain confidence.</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          <strong>Side note:</strong> We&apos;re manually setting these weights to values that make sense
          for our rain example. In practice, weights start as small random numbers and the
          network <em>learns</em> the right values through training — gradually adjusting them until
          each neuron&apos;s confidence is accurate.
        </p>
      </ExplanationBox>

      {/* Weight effect diagram */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 460 120" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Temperature path */}
          <rect x="20" y="12" width="80" height="36" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="60" y="26" textAnchor="middle" fill="#64748b" fontSize="9">temp</text>
          <text x="60" y="40" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">0.7</text>
          <text x="115" y="35" fill="#94a3b8" fontSize="12">×</text>
          <rect x="130" y="16" width="60" height="28" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          <text x="160" y="35" textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="700">-0.3</text>
          <text x="205" y="35" fill="#94a3b8" fontSize="12">=</text>
          <text x="235" y="35" fill="#dc2626" fontSize="13" fontWeight="600">-0.21</text>
          <text x="290" y="35" fill="#64748b" fontSize="10" fontStyle="italic">pushes confidence down</text>

          {/* Humidity path */}
          <rect x="20" y="68" width="80" height="36" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="60" y="82" textAnchor="middle" fill="#64748b" fontSize="9">humidity</text>
          <text x="60" y="96" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="600">0.8</text>
          <text x="115" y="91" fill="#94a3b8" fontSize="12">×</text>
          <rect x="130" y="72" width="60" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="160" y="91" textAnchor="middle" fill="#15803d" fontSize="12" fontWeight="700">2.0</text>
          <text x="205" y="91" fill="#94a3b8" fontSize="12">=</text>
          <text x="235" y="91" fill="#15803d" fontSize="13" fontWeight="600">+1.6</text>
          <text x="290" y="91" fill="#64748b" fontSize="10" fontStyle="italic">strongly pushes confidence up</text>
        </svg>
      </div>

      <p>
        <strong>Rain check:</strong> With humidity weighted at 2.0 and temperature at -0.3, our rain neuron
        will be heavily influenced by humidity (pushing confidence up) and slightly influenced by temperature
        (pushing confidence down on hot days). But we&apos;re still missing one piece — what if the neuron
        should start with a built-in lean toward &quot;yes&quot; or &quot;no&quot;? That&apos;s <strong>bias</strong>.
      </p>
    </div>
  );
}
