'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="A Token ID Means Nothing as a Number">
        <p>
          Tokenization turned <strong>&ldquo;The sky is&rdquo;</strong> into a list of token IDs:
          something like <code>464, 6766, 318</code>. But those numbers are just <em>name tags</em>.
          Token 6766 is not &ldquo;bigger&rdquo; or &ldquo;more&rdquo; than token 464 in any meaningful
          way — the IDs are arbitrary positions in a dictionary. If you fed them straight into a network
          that multiplies and adds, it would conclude that <code>is</code> (318) is roughly half of{' '}
          <code>The</code> (464), which is nonsense.
        </p>
        <p>
          So the very first thing a model does is throw the ID away and replace it with something that{' '}
          <em>does</em> carry meaning: a <strong>vector</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What a Vector Is">
        <p>
          A <strong>vector</strong> is just a list of numbers — that is the whole definition.{' '}
          <code>[0.1, 0.2, 0.8]</code> is a 3-dimensional vector. You can picture it as an arrow from the
          origin to a point in space, or simply as a row of coordinates.
        </p>
        <div style={{ margin: '1rem 0', padding: '1rem 1.1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {([['dim 1', 0.1], ['dim 2', 0.2], ['dim 3', 0.8]] as [string, number][]).map(([label, v]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', width: 40 }}>{label}</span>
              <div style={{ flex: 1, height: 12, background: '#eef2f7', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${v * 100}%`, background: 'linear-gradient(90deg,#a78bfa,#7c3aed)' }} />
              </div>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#4c1d95', width: 28, textAlign: 'right' }}>{v.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </ExplanationBox>

      <ExplanationBox title="But Where Do the Numbers Come From?">
        <p>
          A fair objection: those numbers look made up. Who decided <code>sky</code> gets a{' '}
          <code>1.0</code> in the first slot? The honest answer is that <strong>nobody did</strong> — the
          model invents every one of them during training. Exactly how it pulls
          those numbers out of thin air is the whole of the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
