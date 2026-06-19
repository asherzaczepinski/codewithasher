'use client';

import ExplanationBox from '@/components/ExplanationBox';

// "dog bites man" vs "man bites dog" — same tokens, different order, opposite meaning.
function OrderDemo() {
  const rows = [
    { words: ['dog', 'bites', 'man'], meaning: 'a normal Tuesday', color: '#dbeafe', stroke: '#2563eb' },
    { words: ['man', 'bites', 'dog'], meaning: 'a news story', color: '#fee2e2', stroke: '#dc2626' },
  ];
  return (
    <div className="od-box">
      {rows.map((r, i) => (
        <div key={i} className="od-row">
          <div className="od-words">
            {r.words.map((w, j) => (
              <span key={j} className="od-word" style={{ background: r.color, borderColor: r.stroke }}>
                <span className="od-pos">pos {j + 1}</span>
                {w}
              </span>
            ))}
          </div>
          <span className="od-arrow">→</span>
          <span className="od-meaning" style={{ color: r.stroke }}>{r.meaning}</span>
        </div>
      ))}
      <p className="od-cap">
        Same three tokens, same embeddings — a <strong>bag</strong> of words. Only the position labels
        distinguish the two sentences.
      </p>
      <style jsx>{`
        .od-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .od-row { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
        .od-words { display: flex; gap: 0.4rem; }
        .od-word { display: inline-flex; flex-direction: column; align-items: center; padding: 0.35rem 0.7rem; border: 1.5px solid; border-radius: 8px; font-size: 15px; font-weight: 600; color: #1e293b; gap: 1px; }
        .od-pos { font-size: 9px; color: #64748b; font-weight: 500; }
        .od-arrow { color: #94a3b8; font-size: 16px; }
        .od-meaning { font-size: 14px; font-weight: 600; }
        .od-cap { margin: 0.5rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

// Depth ladder: what different layers of the stack tend to learn.
function DepthLadder() {
  const layers = [
    { range: 'Early blocks', what: 'Surface patterns — grammar, word endings, which words sit next to which', fill: '#f0f9ff', stroke: '#0369a1' },
    { range: 'Middle blocks', what: 'Relationships — who did what to whom, what "it" refers to, phrase structure', fill: '#faf5ff', stroke: '#7c3aed' },
    { range: 'Deep blocks', what: 'Abstract meaning — topic, tone, intent, facts needed to continue the text', fill: '#fdf2f8', stroke: '#be185d' },
  ];
  return (
    <div className="dl-box">
      <div className="dl-stack">
        {[...layers].reverse().map((l, i) => (
          <div key={i} className="dl-layer" style={{ background: l.fill, borderColor: l.stroke }}>
            <span className="dl-range" style={{ color: l.stroke }}>{l.range}</span>
            <span className="dl-what">{l.what}</span>
          </div>
        ))}
      </div>
      <p className="dl-cap">
        The same division of labor as the rain network — Layer 2 detected simple patterns, Layer 3
        combined them — stretched across dozens of blocks.
      </p>
      <style jsx>{`
        .dl-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .dl-stack { display: flex; flex-direction: column; gap: 0.5rem; max-width: 480px; margin: 0 auto; }
        .dl-layer { padding: 0.7rem 1rem; border: 1.5px solid; border-radius: 10px; display: flex; flex-direction: column; gap: 2px; }
        .dl-range { font-weight: 700; font-size: 13px; }
        .dl-what { font-size: 12.5px; color: #475569; line-height: 1.5; }
        .dl-cap { margin: 1rem 0 0; text-align: center; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step11() {
  return (
    <div>
      <ExplanationBox title="Attention Has No Sense of Order">
        <p>
          Here&apos;s a quirk hiding in everything we&apos;ve built so far. Look back at the attention
          recipe: every query scores against every key, all at once, symmetrically. Nothing in those dot
          products knows which word came <em>first</em>. Shuffle the sentence and you&apos;d get exactly
          the same scores — attention treats the input as an unordered <strong>bag of tokens</strong>.
        </p>
        <OrderDemo />
        <p>
          Clearly unacceptable. The fix: before the first block, the model <strong>adds a position
          signal</strong> into each token&apos;s embedding — a vector that encodes &quot;I am token 1,&quot;
          &quot;I am token 2,&quot; and so on. The word&apos;s vector and its position vector blend into
          one, so &quot;dog at position 1&quot; and &quot;dog at position 3&quot; arrive at the first
          block as <em>different vectors</em>. From then on, attention can learn order-sensitive patterns
          — like English subjects usually preceding their verbs — because order is literally part of
          every token&apos;s representation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Context Window: Why Models 'Forget'">
        <p>
          Positions also explain a term you&apos;ve probably bumped into: the{' '}
          <strong>context window</strong>. A model is built and trained to handle some maximum number of
          tokens at once — a few thousand for early GPTs, hundreds of thousands for modern frontier
          models. That&apos;s the size of the &quot;everything&quot; in &quot;every token attends to
          everything.&quot;
        </p>
        <p>
          The model has no memory beyond the window. When your chat outgrows it, the oldest
          tokens simply stop being part of the input — which is why a very long conversation can
          &quot;forget&quot; how it started. It&apos;s not the model getting tired; the early text
          literally isn&apos;t in the computation anymore.
        </p>
        <p>
          Why not just make the window gigantic? Cost. Every token attends to every other token, so
          doubling the window quadruples the attention work (n tokens means n × n dot products). Growing
          the window without melting the data center is one of the liveliest research areas in the field.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now Stack It Deep">
        <p>
          With positions mixed in, here&apos;s the whole trick: take the block from last step and{' '}
          <strong>stack it</strong>. Block 1&apos;s output becomes block 2&apos;s input, and so on —
          GPT-2 stacked 12, GPT-3 stacked 96. Each block&apos;s attention re-asks &quot;who should I
          listen to?&quot; using the <em>increasingly refined</em> vectors from the block below, and each
          feed-forward net adds another round of per-token processing.
        </p>
        <DepthLadder />
        <p>
          That tall stack — embeddings in at the bottom, deeply contextualized representations out the
          top — <strong>is</strong> the transformer. You now know every piece of the architecture behind
          essentially every modern LLM. What&apos;s left is the payoff: turning the top of the stack back
          into words. That&apos;s Part 4.
        </p>
      </ExplanationBox>
    </div>
  );
}
