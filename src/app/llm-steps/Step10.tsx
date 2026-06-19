'use client';

import ExplanationBox from '@/components/ExplanationBox';

// A simple stacked-block diagram of a transformer.
function BlockStack() {
  const blocks = [
    { label: 'Multi-Head Attention', sub: 'tokens look at each other', fill: '#ede9fe', stroke: '#7c3aed' },
    { label: 'Add & Normalize', sub: 'keep signals stable', fill: '#f1f5f9', stroke: '#94a3b8' },
    { label: 'Feed-Forward Network', sub: 'a small neural net per token', fill: '#dbeafe', stroke: '#2563eb' },
    { label: 'Add & Normalize', sub: 'keep signals stable', fill: '#f1f5f9', stroke: '#94a3b8' },
  ];
  return (
    <div className="bs-box">
      <div className="bs-stack">
        <div className="bs-flow">output to next block ↑</div>
        {blocks.map((b, i) => (
          <div key={i} className="bs-block" style={{ background: b.fill, borderColor: b.stroke }}>
            <span className="bs-label" style={{ color: b.stroke }}>{b.label}</span>
            <span className="bs-sub">{b.sub}</span>
          </div>
        ))}
        <div className="bs-flow">input tokens (with positions) ↑</div>
      </div>
      <p className="bs-cap">One <strong>transformer block</strong>. Real models stack dozens of these.</p>
      <style jsx>{`
        .bs-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .bs-stack { display: flex; flex-direction: column-reverse; gap: 0.5rem; max-width: 360px; margin: 0 auto; }
        .bs-block { padding: 0.7rem 1rem; border: 1.5px solid; border-radius: 10px; display: flex; flex-direction: column; }
        .bs-label { font-weight: 700; font-size: 14px; }
        .bs-sub { font-size: 12px; color: #64748b; }
        .bs-flow { text-align: center; font-size: 11px; color: #94a3b8; }
        .bs-cap { margin: 1rem 0 0; text-align: center; font-size: 13px; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step10() {
  return (
    <div>
      <ExplanationBox title="One Block: Attention + a Little Neural Network">
        <p>
          Attention lets tokens share information. But sharing alone isn&apos;t enough — the model also needs
          to <em>think</em> about what it gathered. So a <strong>transformer block</strong> pairs attention
          with a small neural network — the same kind you built in the last course:
        </p>
        <BlockStack />
        <p>
          The <strong>attention</strong> sublayer mixes information across tokens. The{' '}
          <strong>feed-forward network</strong> then processes each token on its own — and this is,
          literally, the network from the neural network course: multiply by a weight matrix, add biases,
          apply an activation function, multiply by another weight matrix. Applied identically to every
          position. Attention decides <em>what to look at</em>; the feed-forward net decides{' '}
          <em>what to make of it</em>.
        </p>
        <p>
          A fun detail: the feed-forward layer is where most of an LLM&apos;s <strong>parameters</strong>{' '}
          live — typically about two-thirds of them. Researchers believe much of the model&apos;s factual
          knowledge (Paris is in France, pizza is from Italy) is stored in these layers&apos; weights,
          while attention handles the routing of information between words. Your rain network&apos;s
          big sibling is the memory of the operation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Helper 1: The Residual Connection (the 'Add')">
        <p>
          Notice the &quot;Add &amp; Normalize&quot; strips in the diagram. The <strong>Add</strong> part
          means each sublayer&apos;s output is <em>added onto</em> its input instead of replacing it:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', margin: '0.5rem 0', fontSize: '14px' }}>
          output = input + attention(input)
        </p>
        <p>
          Concretely: if a token&apos;s vector was [0.8, −0.2, 0.3] and attention computed an update of
          [0.1, 0.3, −0.1], the token leaves with [0.9, 0.1, 0.2] — its original self, plus a refinement.
          Two big wins:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>Information never gets lost.</strong> Each sublayer only has to learn a useful{' '}
            <em>tweak</em>, not rebuild the whole representation from scratch. The word&apos;s identity
            survives all the way up the stack.
          </li>
          <li>
            <strong>Gradients flow cleanly.</strong> Remember the vanishing gradient problem — the learning
            signal fading as it travels back through many sigmoid layers? The residual&apos;s
            &quot;+ input&quot; gives the gradient an express lane straight down the stack. This one trick
            is a huge part of why 96-layer networks are trainable at all.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Helper 2: LayerNorm (the 'Normalize')">
        <p>
          The <strong>Normalize</strong> part should feel like déjà vu. In the neural network course, we
          normalized the raw inputs — centered around 0, scaled to a steady spread — so no value could
          steamroll the others and z stayed in the sigmoid&apos;s effective zone.
        </p>
        <p>
          <strong>LayerNorm is that same idea, applied inside the network, over and over.</strong> After
          each sublayer, every token&apos;s vector gets re-centered and re-scaled to a steady range. Without
          it, dozens of additions and multiplications would compound — values exploding toward infinity or
          shriveling toward zero — exactly the runaway-scale problem normalization solved on day one.
          The transformer just refuses to let the numbers drift out of the healthy range at{' '}
          <em>any</em> depth, not just at the entrance.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Full Block, In One Breath">
        <p>
          So a token&apos;s journey through one block: <strong>look around</strong> (multi-head attention
          gathers context from other tokens) → <strong>keep your identity</strong> (add the result onto
          yourself, re-normalize) → <strong>think it over</strong> (the feed-forward net transforms your
          vector) → <strong>keep your identity again</strong> (add, re-normalize). Out comes a vector
          that means the same word, but understood a little more deeply.
        </p>
        <p>
          One block is a modest machine. The magic is what happens when you stack it — and for that, the
          model first needs to know something we&apos;ve quietly ignored so far: <em>what order the words
          came in</em>. Next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
