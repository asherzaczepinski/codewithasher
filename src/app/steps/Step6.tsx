'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="What You Just Learned">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Nice work!</strong> You now understand the big picture of how neural networks work — no math needed. Here&apos;s what you know:
        </div>
        <p>
          <strong>A neuron</strong> takes inputs and outputs a confidence level (0 to 1).
        </p>
        <p>
          <strong>Networks</strong> stack neurons into layers — input, hidden, output — where simple pattern detectors feed into more complex ones.
        </p>
        <p>
          <strong>Learning</strong> is a loop: predict → measure error → trace blame → adjust weights → repeat thousands of times.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Road Ahead: Part 2">
        <p>
          In Part 2, we&apos;ll do the actual math behind every concept you just learned. Here&apos;s how they map:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '8px 12px',
          alignItems: 'center',
          margin: '1rem 0',
          fontSize: '0.95rem'
        }}>
          <div style={{ fontWeight: 600, color: '#64748b' }}>Overview concept</div>
          <div></div>
          <div style={{ fontWeight: 600, color: '#64748b' }}>The math</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>Confidence (0 to 1)</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Sigmoid function</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>How much each input matters</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Weights</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>Flexibility / default tendency</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Bias</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>Data flows forward</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Forward propagation</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>Measure error</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Loss function</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0' }}>Trace blame backward</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Backpropagation</div>

          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>Adjust weights to improve</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: '#94a3b8' }}>→</div>
          <div style={{ padding: '6px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: '#7c3aed', fontWeight: 500 }}>Gradient descent</div>
        </div>
      </ExplanationBox>

      <ExplanationBox title="Ready?">
        <p>
          You already understand <em>what</em> neural networks do and <em>why</em> each piece exists. Now it&apos;s time to learn <em>how</em> — with real numbers and real equations you can follow step by step.
        </p>
        <p>
          Hit &quot;Next&quot; to start Part 2: The Math.
        </p>
      </ExplanationBox>
    </div>
  );
}
