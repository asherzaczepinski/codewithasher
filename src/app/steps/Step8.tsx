'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';


export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Normalization">
        <p>
          <strong>Scaling Our Inputs:</strong> We need to convert our weather data into decimals between 0 and 1.
        </p>
        <p>
          <strong>Temperature:</strong> If temperatures range from 0°C to 40°C,
          then 28°C becomes 28/40 = 0.7.
        </p>
        <p>
          <strong>Humidity:</strong> Already a percentage! 80% humidity = 0.8.
        </p>
        <p>
          <strong>Why Equal Scales Matter:</strong> Imagine if temperature ranged from 0-40 and humidity from 0-100.
          The larger humidity values would completely dominate the calculations, making it nearly impossible
          to learn from temperature. By scaling all inputs to similar ranges we give each feature
          a fair chance to influence the neuron&apos;s confidence.
        </p>
        <p style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
          Think of it this way: if our rain neuron gets temperature as 28 and humidity as 0.8, the weight
          on temperature would overwhelm everything — the neuron&apos;s confidence would be almost entirely
          driven by temperature, ignoring the humidity signal that actually matters more for rain.
        </p>
      </ExplanationBox>
      {/* Normalization visual */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        padding: '24px 16px',
        margin: '0 0 20px 0',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <svg viewBox="0 0 460 80" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <rect x="20" y="10" width="90" height="28" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="29" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">28°C</text>
          <text x="130" y="29" fill="#94a3b8" fontSize="14">→</text>
          <text x="155" y="29" fill="#64748b" fontSize="11">28/40 =</text>
          <rect x="205" y="10" width="60" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="235" y="29" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="700">0.7</text>

          <rect x="20" y="48" width="90" height="28" rx="6" fill="#fff" stroke="#e2e8f0" strokeWidth="1.5"/>
          <text x="65" y="67" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="600">80%</text>
          <text x="130" y="67" fill="#94a3b8" fontSize="14">→</text>
          <text x="155" y="67" fill="#64748b" fontSize="11">80/100 =</text>
          <rect x="205" y="48" width="60" height="28" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5"/>
          <text x="235" y="67" textAnchor="middle" fill="#15803d" fontSize="13" fontWeight="700">0.8</text>
        </svg>
      </div>

      <MathFormula label="Normalization Formula">
        normalized = (value - min) / (max - min)
      </MathFormula>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>Rain check:</strong> Our rain neuron now has clean inputs — temperature = 0.7 and humidity = 0.8.
        But how does the neuron know that humidity matters more for rain than temperature? That&apos;s
        where <strong>weights</strong> come in next.
      </div>
    </div>
  );
}
