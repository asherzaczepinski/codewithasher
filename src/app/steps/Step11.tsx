'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';


export default function Step11() {
  return (
    <div>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '20px' }}>
        <strong>Where we are:</strong> Our rain neuron has inputs (temp = 0.7, humidity = 0.8), weights
        (temp = -0.3, humidity = 2.0), and bias (0.1). Now we combine them into one number — the neuron&apos;s
        raw signal before it becomes a confidence level.
      </div>

      <ExplanationBox title="Putting It All Together">
        <p>
          The <strong>pre-activation</strong> (also called <strong>z</strong>) is simply the result of
          combining inputs, weights, and bias — multiply each input by its weight, add them up,
          then add the bias.
        </p>
        <p>
          This value z tells us the neuron&apos;s &quot;raw signal&quot; before we convert it to a confidence
          level. A big positive z means the neuron is leaning toward &quot;yes, rain&quot; — a big negative
          z means it&apos;s leaning toward &quot;no rain.&quot;
        </p>
      </ExplanationBox>

      <MathFormula label="Pre-activation (z)">
        z = (input₁ × weight₁) + (input₂ × weight₂) + bias
      </MathFormula>

      <ExplanationBox title="The Dot Product">
        <p>
          The &quot;multiply each pair and add them up&quot; part of this formula has a name:
          the <strong>dot product</strong>. It takes two lists — inputs and weights — and turns
          them into a single number.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So pre-activation is really just: <em>dot product of inputs and weights, plus bias</em>.
          In code, you&apos;d write it as:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          import numpy as np<br/>
          z = np.dot(inputs, weights) + bias
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The dot product shows up everywhere in neural networks — every neuron uses it to combine
          inputs and weights into a single number that determines the neuron&apos;s confidence.
        </p>
      </ExplanationBox>

      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 460 140" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Input × Weight pairs */}
          <text x="20" y="20" fill="#64748b" fontSize="11" fontWeight="600">Dot Product: multiply each pair, then add</text>

          {/* Pair 1 */}
          <rect x="20" y="32" width="55" height="28" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="47" y="50" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">0.7</text>
          <text x="85" y="50" fill="#94a3b8" fontSize="12">×</text>
          <rect x="95" y="32" width="55" height="28" rx="6" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1.5"/>
          <text x="122" y="50" textAnchor="middle" fill="#dc2626" fontSize="11" fontWeight="600">-0.3</text>
          <text x="160" y="50" fill="#94a3b8" fontSize="12">=</text>
          <text x="185" y="50" fill="#dc2626" fontSize="12" fontWeight="600">-0.21</text>

          {/* Pair 2 */}
          <rect x="20" y="72" width="55" height="28" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="47" y="90" textAnchor="middle" fill="#334155" fontSize="11" fontWeight="600">0.8</text>
          <text x="85" y="90" fill="#94a3b8" fontSize="12">×</text>
          <rect x="95" y="72" width="55" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="122" y="90" textAnchor="middle" fill="#15803d" fontSize="11" fontWeight="600">2.0</text>
          <text x="160" y="90" fill="#94a3b8" fontSize="12">=</text>
          <text x="185" y="90" fill="#15803d" fontSize="12" fontWeight="600">+1.6</text>

          {/* Sum */}
          <line x1="220" y1="40" x2="220" y2="95" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,3"/>
          <text x="240" y="70" fill="#64748b" fontSize="12">add →</text>

          {/* Result */}
          <rect x="290" y="52" width="80" height="32" rx="8" fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2"/>
          <text x="330" y="73" textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="700">1.39</text>

          {/* + bias */}
          <text x="385" y="73" fill="#64748b" fontSize="12">+ 0.1 =</text>
          <rect x="430" y="52" width="25" height="32" rx="6" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5"/>
          <text x="443" y="73" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700">z</text>

          {/* z label */}
          <text x="330" y="120" textAnchor="middle" fill="#64748b" fontSize="10">weighted sum</text>
          <text x="443" y="120" textAnchor="middle" fill="#7c3aed" fontSize="10" fontWeight="600">1.49</text>
        </svg>
      </div>

      <WorkedExample title="Computing z Step by Step">
        <p>Let&apos;s calculate z with our weather data:</p>

        <CalcStep number={1}>Inputs: temperature = 0.7, humidity = 0.8</CalcStep>
        <CalcStep number={2}>Weights: w_temp = -0.3, w_humid = 2.0</CalcStep>
        <CalcStep number={3}>Bias: 0.1</CalcStep>
        <CalcStep number={4}>Temperature contribution: 0.7 × -0.3 = -0.21</CalcStep>
        <CalcStep number={5}>Humidity contribution: 0.8 × 2.0 = 1.6</CalcStep>
        <CalcStep number={6}>Weighted sum (dot product): -0.21 + 1.6 = 1.39</CalcStep>
        <CalcStep number={7}>Add bias: z = 1.39 + 0.1 = 1.49</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our pre-activation is <strong>z = 1.49</strong>. This positive number means the neuron is
          leaning toward predicting rain — its confidence will be pulled upward. But what does 1.49
          actually mean? Is that 80% confident? 90%? That&apos;s why we need an activation function next.
        </p>
      </WorkedExample>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>Rain check:</strong> Our rain neuron computed z = 1.49. The positive value tells us
        humidity&apos;s strong signal (1.6) outweighed temperature&apos;s slight pushback (-0.21). But z = 1.49
        isn&apos;t a confidence level yet — we need to squash it into a 0-to-1 range. That&apos;s what the
        <strong> sigmoid function</strong> does next.
      </div>
    </div>
  );
}
