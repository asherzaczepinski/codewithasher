'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// Simple visual: one token's embedding flowing through three learned matrices.
function QKVRoles() {
  const ROLES = [
    { letter: 'Q', name: 'Query', color: '#7c3aed', bg: '#ede9fe', desc: '"Here’s what I’m looking for."' },
    { letter: 'K', name: 'Key', color: '#2563eb', bg: '#dbeafe', desc: '"Here’s what I’m about."' },
    { letter: 'V', name: 'Value', color: '#059669', bg: '#dcfce7', desc: '"Here’s the information I’ll hand over."' },
  ];
  return (
    <div className="qr-box">
      <div className="qr-emb">
        <span className="qr-emb-label">embedding for &quot;cat&quot;</span>
        <span className="qr-emb-vec">[1.0, 0.2, 0.1]</span>
      </div>
      <div className="qr-arrows">
        {ROLES.map(r => (
          <div key={r.letter} className="qr-branch">
            <div className="qr-mat" style={{ borderColor: r.color, color: r.color }}>× W<sub>{r.letter}</sub></div>
            <div className="qr-down">↓</div>
            <div className="qr-out" style={{ background: r.bg, borderColor: r.color }}>
              <span className="qr-out-letter" style={{ color: r.color }}>{r.letter}</span>
              <span className="qr-out-name" style={{ color: r.color }}>{r.name}</span>
              <span className="qr-out-desc">{r.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="qr-cap">
        One embedding goes in; three learned weight matrices (W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>)
        each multiply it, producing three different vectors. Every token in the sentence does this.
      </p>
      <style jsx>{`
        .qr-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .qr-emb { display: flex; flex-direction: column; align-items: center; gap: 2px; margin-bottom: 0.75rem; }
        .qr-emb-label { font-size: 12px; color: #64748b; }
        .qr-emb-vec { font-family: var(--font-mono), monospace; font-weight: 700; color: #1e293b; font-size: 15px; }
        .qr-arrows { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
        .qr-branch { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 130px; max-width: 200px; }
        .qr-mat { padding: 0.3rem 0.8rem; border: 1.5px dashed; border-radius: 8px; font-size: 13px; font-weight: 700; background: white; }
        .qr-down { color: #94a3b8; font-size: 14px; margin: 2px 0; }
        .qr-out { width: 100%; padding: 0.6rem 0.7rem; border: 1.5px solid; border-radius: 10px; display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
        .qr-out-letter { font-size: 18px; font-weight: 800; }
        .qr-out-name { font-size: 12px; font-weight: 700; }
        .qr-out-desc { font-size: 11px; color: #475569; line-height: 1.4; }
        .qr-cap { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; text-align: center; }
      `}</style>
    </div>
  );
}

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Query, Key, Value: Attention's Three Roles">
        <p>
          Last step left a riddle: attention weights are computed fresh for every new sentence, yet the
          model only has a fixed set of learned parameters. Here&apos;s the resolution. The model
          doesn&apos;t learn the weights between words — it learns <strong>how to compute</strong> them.
          Every token&apos;s embedding gets multiplied by three learned weight matrices, producing three
          vectors with three different jobs:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Query (Q)</strong> — &quot;here&apos;s what I&apos;m looking for.&quot;</li>
          <li><strong>Key (K)</strong> — &quot;here&apos;s what I offer / what I&apos;m about.&quot;</li>
          <li><strong>Value (V)</strong> — &quot;here&apos;s the information I&apos;ll hand over if you attend to me.&quot;</li>
        </ul>
        <QKVRoles />
        <p>
          A handy analogy: it&apos;s a search engine. Your <strong>query</strong> is what you type; each
          document&apos;s <strong>key</strong> is its title; the <strong>value</strong> is its actual
          contents. You match your query against every key, then pull back a blend of the values you
          matched best.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Three Separate Vectors? Why Not Just Use the Embedding?">
        <p>
          Fair question — you could compare raw embeddings directly with dot products, like we did with
          cat and mat. But think about what &quot;it&quot; needs in the animal sentence. As a{' '}
          <em>seeker</em>, &quot;it&quot; wants to find nouns it could refer to. As an{' '}
          <em>offering</em>, &quot;it&quot; is just a small pronoun with little to give. Those are
          different jobs — one word needs to present a different face depending on whether it&apos;s
          asking or being asked.
        </p>
        <p>
          Separate Q and K matrices give it that freedom: the query for &quot;it&quot; can be shaped like
          &quot;looking for an animal-ish noun&quot; while its key says &quot;I&apos;m a pronoun.&quot;
          And V is separate again because <em>matching</em> and <em>delivering</em> are different jobs
          too — &quot;animal&quot; might match on &quot;I&apos;m a creature noun&quot; but deliver
          richer information like &quot;furry, tired, the subject of this sentence.&quot;
        </p>
        <p>
          And remember: W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> are <strong>ordinary weight
          matrices</strong>, exactly like the weights in your rain network. Nobody designs the
          questions and answers — the matrices start random and are shaped by backpropagation until the
          queries and keys that emerge happen to be the ones that help predict the next word.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Recipe">
        <p>For one word attending over a sentence:</p>
        <ol style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Score</strong> the word&apos;s query against every word&apos;s key with a dot product — how aligned are they?</li>
          <li><strong>Scale</strong> the scores down by √(dimension), so they stay in a healthy range.</li>
          <li><strong>Softmax</strong> the scores into attention weights that are positive and sum to 1.</li>
          <li><strong>Blend</strong> all the value vectors using those weights — that blend is the word&apos;s new representation.</li>
        </ol>
        <MathFormula label="Scaled dot-product attention">
          Attention(Q, K, V) = softmax( (Q · Kᵀ) / √dₖ ) · V
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          That one line is the engine of every transformer — GPT-4, Claude, Gemini, all of them. It
          looks dense, but you already know every ingredient: dot products from step 5, and a
          softmax — which is just the sigmoid&apos;s exponential trick applied to a whole list. Next
          step, we run this recipe by hand on our toy world&apos;s three words and check every number.
        </p>
      </ExplanationBox>
    </div>
  );
}
