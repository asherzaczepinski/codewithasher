'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
        tell the two sentences apart.
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
    { range: 'Deep blocks', what: 'Abstract meaning — topic, tone, intent, the facts needed to continue the text', fill: '#fdf2f8', stroke: '#be185d' },
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
        The same division of labor as the rain network — early layers spot simple patterns, later layers
        combine them — stretched across dozens of blocks.
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

// Interactive n^2 cost: slide the sequence length, watch the dot-product count explode.
function CostDemo() {
  const [n, setN] = useState(8);
  return (
    <div className="ct-box">
      <p className="ct-lab">
        Drag the number of tokens. Every token attends to every other token, so the work is{' '}
        <strong>n &times; n</strong> dot products:
      </p>
      <input
        type="range" min={1} max={64} step={1} value={n}
        onChange={e => setN(parseInt(e.target.value))}
        className="ct-slider"
      />
      <div className="ct-readout">
        <span className="ct-pill">n = {n} tokens</span>
        <span className="ct-arr">→</span>
        <span className="ct-pill out">{(n * n).toLocaleString()} comparisons</span>
      </div>
      <p className="ct-cap">
        Double the tokens and the cost <strong>quadruples</strong>, not doubles. That single fact —
        attention is <strong>O(n&sup2;)</strong> — is why a longer context window is so expensive.
      </p>
      <style jsx>{`
        .ct-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .ct-lab { font-size: 13px; color: #64748b; margin: 0 0 0.5rem; }
        .ct-slider { width: 100%; accent-color: #7c3aed; margin: 0.5rem 0 1rem; }
        .ct-readout { display: flex; align-items: center; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }
        .ct-pill { font-family: monospace; font-weight: 700; font-size: 15px; padding: 0.4rem 0.9rem; border-radius: 8px; background: #ede9fe; color: #5b21b6; }
        .ct-pill.out { background: #fce7f3; color: #be185d; }
        .ct-arr { color: #94a3b8; }
        .ct-cap { margin: 1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step20() {
  return (
    <div>
      <ExplanationBox title="Attention Is Blind to Order">
        <p>
          There is a quirk hiding in everything we have built. Look back at the attention recipe: every
          query scores against every key, the scores become weights, and the output is a{' '}
          <strong>weighted sum</strong> of the values. A weighted sum doesn&apos;t care what order you
          add things in. Shuffle the input words and you get the same set of outputs, just shuffled to
          match — permute the inputs, permute the outputs. Attention treats a sentence as an unordered{' '}
          <strong>bag of tokens</strong>.
        </p>
        <p>
          That is plainly unacceptable for language, where order <em>is</em> meaning:
        </p>
        <OrderDemo />
        <p>
          To &ldquo;dog bites man&rdquo; and &ldquo;man bites dog,&rdquo; raw attention is identical — same
          three embeddings, same dot products, same weights. Yet one is a Tuesday and the other is news.
          The model needs order baked in somehow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fix: Add a Position Signal">
        <p>
          The fix is as direct as the residual was. Before the first block, the model{' '}
          <strong>adds a position vector</strong> to each token&apos;s embedding — a distinct pattern of
          numbers that means &ldquo;I am token 1,&rdquo; &ldquo;I am token 2,&rdquo; and so on. The word
          vector and its position vector blend into one. From then on &ldquo;dog at position 1&rdquo; and
          &ldquo;dog at position 3&rdquo; arrive at the first block as <em>different vectors</em>, so
          attention can finally learn order-sensitive patterns — like English subjects usually coming
          before their verbs.
        </p>
        <WorkedExample title="Positions On &ldquo;The Sky Is&rdquo;">
          <p>
            Take our three embeddings and add a small made-up position code to each (real models use
            smooth sine-wave patterns, but the operation is just addition):
          </p>
          <CalcStep number={1}>
            The (pos 0): [0.1, 0.0, 0.9] + [0.00, 0.00, 0.00] = [0.10, 0.00, 0.90]
          </CalcStep>
          <CalcStep number={2}>
            sky (pos 1): [1.0, 0.7, 0.0] + [0.01, 0.02, 0.03] = [1.01, 0.72, 0.03]
          </CalcStep>
          <CalcStep number={3}>
            is&nbsp;&nbsp;(pos 2): [0.1, 0.2, 0.8] + [0.02, 0.04, 0.06] = [0.12, 0.24, 0.86]
          </CalcStep>
          <p style={{ marginTop: '1rem' }}>
            Now each token quietly carries <em>where</em> it sits as well as <em>what</em> it is. (Our
            worked attention back in Part 2 left this step out so the dot products stayed clean — this is
            the piece we set aside. With three short tokens it changed almost nothing; in a real sentence
            it is the difference between a sentence and a word-salad.)
          </p>
        </WorkedExample>
      </ExplanationBox>

      <ExplanationBox title="The Context Window: Why Models &ldquo;Forget&rdquo;">
        <p>
          Positions also explain a term you have surely bumped into: the{' '}
          <strong>context window</strong>. A model is built and trained to handle some maximum number of
          tokens at once — a few thousand for early GPTs, hundreds of thousands for modern frontier
          models. That maximum is the size of the &ldquo;everything&rdquo; in &ldquo;every token attends
          to everything.&rdquo;
        </p>
        <p>
          The model has no memory beyond that window. When a conversation outgrows it, the oldest tokens
          simply drop out of the input — which is why a very long chat can &ldquo;forget&rdquo; how it
          started. It is not the model getting tired; the early text is literally no longer in the
          computation.
        </p>
        <p>
          So why not make the window enormous? Cost — and the bill grows brutally fast.
        </p>
        <CostDemo />
        <p>
          That O(n&sup2;) wall is one of the liveliest research areas in the field: cheaper attention
          variants, sparse patterns, and clever memory tricks all exist to push the window wider without
          melting the data center.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now Stack It Deep">
        <p>
          With positions mixed in, here is the whole architecture in one move: take the block from the
          last step and <strong>stack it</strong>. Block 1&apos;s output becomes block 2&apos;s input, and
          so on — GPT-2 stacked 12 blocks, GPT-3 stacked 96. Each block&apos;s attention re-asks
          &ldquo;who should I listen to?&rdquo; using the <em>increasingly refined</em> vectors from the
          block below, and each feed-forward net adds another round of per-token thinking.
        </p>
        <p>
          And the stack specializes by depth, the way the layers of the rain network did:
        </p>
        <DepthLadder />
        <p>
          That tall stack — plain embeddings in at the bottom, deeply contextualized vectors out the top
          — <strong>is</strong> the transformer. You now know every piece of the architecture behind
          essentially every modern LLM: embeddings, attention, multiple heads, the feed-forward network,
          residuals and norm, positions, and depth. What is left is the payoff — turning the vector at
          the top of the stack back into an actual next word. That is Part 4.
        </p>
      </ExplanationBox>
    </div>
  );
}
