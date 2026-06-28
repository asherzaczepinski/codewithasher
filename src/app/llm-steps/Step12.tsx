'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// The three roles, as a little reference card.
function RolesCard() {
  const roles = [
    { tag: 'Query', q: 'What am I looking for?', ex: '"is" asks: where is my subject / topic?', color: '#7c3aed', fill: '#ede9fe' },
    { tag: 'Key', q: 'What do I offer?', ex: 'each word advertises what it is about', color: '#2563eb', fill: '#dbeafe' },
    { tag: 'Value', q: 'What do I pass on?', ex: 'the content a word hands over if chosen', color: '#15803d', fill: '#dcfce7' },
  ];
  return (
    <div className="rc-box">
      {roles.map(r => (
        <div key={r.tag} className="rc-card" style={{ background: r.fill, borderColor: r.color }}>
          <div className="rc-tag" style={{ color: r.color }}>{r.tag}</div>
          <div className="rc-q">{r.q}</div>
          <div className="rc-ex">{r.ex}</div>
        </div>
      ))}
      <style jsx>{`
        .rc-box { display: flex; gap: 0.8rem; flex-wrap: wrap; margin: 1.5rem 0; }
        .rc-card { flex: 1; min-width: 150px; padding: 1rem; border: 1.5px solid; border-radius: 12px; }
        .rc-tag { font-weight: 800; font-size: 15px; margin-bottom: 0.3rem; }
        .rc-q { font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 0.4rem; }
        .rc-ex { font-size: 12px; color: #475569; line-height: 1.5; }
      `}</style>
    </div>
  );
}

// The matrix-times-vector picture for q = W_Q · is.
function ProjectionViz() {
  return (
    <div className="pv-box">
      <div className="pv-eq">
        <div className="pv-mat">
          <div className="pv-mlabel">W_Q (learned)</div>
          <div className="pv-grid">
            <span>0</span><span>0</span><span>2</span>
            <span>1</span><span>0</span><span>0</span>
            <span>0</span><span>0</span><span>0</span>
          </div>
        </div>
        <span className="pv-times">&times;</span>
        <div className="pv-vec">
          <div className="pv-mlabel">is</div>
          <div className="pv-col"><span>0.1</span><span>0.2</span><span>0.8</span></div>
        </div>
        <span className="pv-times">=</span>
        <div className="pv-vec">
          <div className="pv-mlabel" style={{ color: '#5b21b6' }}>query</div>
          <div className="pv-col pv-out"><span>1.6</span><span>0.1</span><span>0.0</span></div>
        </div>
      </div>
      <p className="pv-cap">
        A matrix is just a recipe for mixing a vector&apos;s coordinates into new ones. The top row of W_Q
        says &ldquo;my first output is 2&times; the GRAMMAR slot&rdquo; — but watch what it does to a word
        whose GRAMMAR slot is large.
      </p>
      <style jsx>{`
        .pv-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .pv-eq { display: flex; align-items: center; justify-content: center; gap: 0.8rem; flex-wrap: wrap; }
        .pv-mlabel { font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0.3rem; font-weight: 600; }
        .pv-grid { display: grid; grid-template-columns: repeat(3, 32px); gap: 4px; padding: 0.5rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; }
        .pv-grid span { font-family: monospace; font-size: 14px; text-align: center; color: #334155; }
        .pv-col { display: flex; flex-direction: column; gap: 4px; padding: 0.5rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; }
        .pv-col span { font-family: monospace; font-size: 14px; text-align: center; color: #334155; width: 32px; }
        .pv-out { background: #ede9fe; border-color: #c4b5fd; }
        .pv-out span { color: #4c1d95; font-weight: 700; }
        .pv-times { font-size: 18px; color: #94a3b8; }
        .pv-cap { margin: 1.1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step11() {
  return (
    <div>
      <ExplanationBox title="Three Jobs Every Word Does at Once">
        <p>
          Last step we hit the one open question: where do the attention weights come from? The answer is a
          beautifully simple idea borrowed from databases. Every word plays <strong>three roles</strong> at
          the same time — it asks a question, it offers an answer, and it carries content to hand over.
        </p>
        <RolesCard />
        <p>
          The mechanism is a matchmaking: the current word&apos;s <strong>Query</strong> gets compared
          against every word&apos;s <strong>Key</strong>. Where a query and a key line up well, that word
          gets a big weight — and its <strong>Value</strong> is what flows into the blend. So
          &ldquo;is&rdquo; will broadcast a query like <em>&ldquo;where is my topic?&rdquo;</em>, and
          whichever word&apos;s key best answers it wins the attention.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why We Can't Just Use the Raw Embeddings">
        <p>
          Here is the part that makes attention actually work — and the reason it isn&apos;t just &ldquo;dot
          the embeddings together.&rdquo; We already proved that raw embeddings betray us:{' '}
          <strong>&ldquo;is&rdquo;</strong> is nearly identical to <strong>&ldquo;The&rdquo;</strong> (cosine
          0.97) and barely resembles <strong>&ldquo;sky.&rdquo;</strong> If we used raw vectors as queries
          and keys, &ldquo;is&rdquo; would attend to its grammatical twin &ldquo;The&rdquo; and ignore the
          topic word entirely. Exactly backwards.
        </p>
        <p>
          So the model does not ask its question with the raw embedding. It first <strong>transforms</strong>{' '}
          each embedding through a learned matrix before anyone compares anything. Three matrices, one per
          role:
        </p>
        <MathFormula label="Project each embedding into its three roles">
          query = W_Q &middot; x&nbsp;&nbsp;&nbsp;key = W_K &middot; x&nbsp;&nbsp;&nbsp;value = W_V &middot; x
        </MathFormula>
        <p>
          W_Q, W_K, and W_V are <strong>learned</strong> — discovered during training by the same
          predict-measure-adjust loop from the neural network course. Their whole job is to reshape a word
          so that the <em>right</em> words end up aligned. W_Q can turn the function word &ldquo;is&rdquo;
          into a query that points at <em>topics</em> — a question its raw vector could never ask.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing the Query for &ldquo;is&rdquo;">
        <p>
          Let&apos;s do it with real numbers. Our learned query matrix for this toy is W_Q ={' '}
          <code>[[0, 0, 2], [1, 0, 0], [0, 0, 0]]</code>, and the embedding for &ldquo;is&rdquo; is{' '}
          <code>[0.1, 0.2, 0.8]</code>. Multiplying a matrix by a vector means: for each <em>row</em> of the
          matrix, multiply it elementwise with the vector and add up the results.
        </p>
        <CalcStep number={1}>
          <strong>Row 1</strong> [0, 0, 2] &middot; [0.1, 0.2, 0.8] = (0&times;0.1) + (0&times;0.2) + (2&times;0.8) = 0 + 0 + 1.6 = <strong>1.6</strong>
        </CalcStep>
        <CalcStep number={2}>
          <strong>Row 2</strong> [1, 0, 0] &middot; [0.1, 0.2, 0.8] = (1&times;0.1) + (0&times;0.2) + (0&times;0.8) = 0.1 + 0 + 0 = <strong>0.1</strong>
        </CalcStep>
        <CalcStep number={3}>
          <strong>Row 3</strong> [0, 0, 0] &middot; [0.1, 0.2, 0.8] = (0&times;0.1) + (0&times;0.2) + (0&times;0.8) = 0 + 0 + 0 = <strong>0.0</strong>
        </CalcStep>
        <ProjectionViz />
        <p style={{ marginTop: '1rem' }}>
          The query for &ldquo;is&rdquo; is <strong>q = [1.6, 0.1, 0.0]</strong>. Look at what the projection
          accomplished. The raw &ldquo;is&rdquo; was [0.1, 0.2, 0.8] — almost all GRAMMAR, hardly any TOPIC.
          W_Q grabbed that big grammar value and <em>moved it onto the topic axis</em>: the query now points
          almost entirely along TOPIC (1.6 in the first slot). The grammatical function word has been
          rewritten into a pointed question: <em>&ldquo;where is my subject?&rdquo;</em> That is something
          only &ldquo;sky&rdquo; can answer.
        </p>
      </WorkedExample>

      <ExplanationBox title="Keys and Values in Our Toy">
        <p>
          To keep the arithmetic on a napkin, our toy makes one simplification: we take each word&apos;s{' '}
          <strong>Key</strong> and <strong>Value</strong> to be its <em>raw embedding</em> — as if W_K and
          W_V were the identity (leave-it-alone) matrix. So sky&apos;s key is just [1.0, 0.7, 0.0], and so on.
        </p>
        <p>
          Real models do <em>not</em> skip this — they learn full W_K and W_V matrices and project keys and
          values exactly the way we just projected the query. It is the same multiply, three times over.
          We are only fixing them to the identity so you can see the mechanism without extra hand-math; the
          interesting transformation — the one that fixes our &ldquo;is&rdquo;-vs-&ldquo;The&rdquo; problem
          — already happened on the query side.
        </p>
      </ExplanationBox>

      <ExplanationBox title="We Have a Question — Now Find the Answer">
        <p>
          &ldquo;is&rdquo; is now holding its query, <strong>q = [1.6, 0.1, 0.0]</strong>, and every word
          is holding out its key. The next move is the matchmaking: score that query against each key with
          a dot product, and see which word answers loudest. That is the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
