'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// The full transformer block, drawn as a flow with the two residual bypasses.
function BlockDiagram() {
  return (
    <div className="bd-box">
      <div className="bd-flow">
        <div className="bd-node in">input vector x</div>
        <div className="bd-line" />

        <div className="bd-sub">
          <div className="bd-node attn">Multi-Head Attention</div>
          <span className="bd-bypass">x bypass &#8631;</span>
        </div>
        <div className="bd-line" />
        <div className="bd-node addnorm">Add &amp; Norm&nbsp;&nbsp;(x + attention, then LayerNorm)</div>
        <div className="bd-line" />

        <div className="bd-sub">
          <div className="bd-node ffn">Feed-Forward Network</div>
          <span className="bd-bypass">x bypass &#8631;</span>
        </div>
        <div className="bd-line" />
        <div className="bd-node addnorm">Add &amp; Norm&nbsp;&nbsp;(x + FFN, then LayerNorm)</div>
        <div className="bd-line" />

        <div className="bd-node out">output vector — same shape as input</div>
      </div>
      <p className="bd-cap">
        One transformer block. Every modern LLM is this exact diagram, stacked. Notice the two
        <strong> bypass lines</strong>: the input slips <em>around</em> each sublayer and is added back
        on the far side.
      </p>
      <style jsx>{`
        .bd-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .bd-flow { display: flex; flex-direction: column; align-items: center; }
        .bd-node { width: 100%; max-width: 420px; text-align: center; padding: 0.7rem 1rem; border-radius: 10px; font-size: 13.5px; font-weight: 700; border: 1.5px solid; }
        .bd-node.in, .bd-node.out { background: #ede9fe; border-color: #7c3aed; color: #5b21b6; }
        .bd-node.attn { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
        .bd-node.ffn { background: #f5f3ff; border-color: #8b5cf6; color: #6d28d9; }
        .bd-node.addnorm { background: #fff; border-color: #cbd5e1; color: #475569; font-weight: 600; }
        .bd-line { width: 2px; height: 16px; background: #cbd5e1; }
        .bd-sub { position: relative; width: 100%; max-width: 420px; display: flex; justify-content: center; }
        .bd-bypass { position: absolute; right: -4px; top: 50%; transform: translateY(-50%); font-size: 10px; color: #db2777; font-weight: 700; background: #fdf2f8; padding: 2px 6px; border-radius: 6px; border: 1px solid #fbcfe8; }
        .bd-cap { margin: 1.2rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step21() {
  return (
    <div>
      <ExplanationBox title="A Tall Stack Has a Problem">
        <p>
          We are about to do the thing that makes a transformer a transformer:{' '}
          <strong>stack these blocks dozens deep</strong>. But deep stacks have a notorious failure mode,
          and you met it in the neural-network course — the <strong>vanishing gradient</strong>. Pile up
          enough layers and the training signal, multiplied through layer after layer on its way back,
          shrinks toward zero. The early layers stop learning. The bottom of the stack goes deaf.
        </p>
        <p>
          Transformers beat this with two small, cheap tricks wrapped around every sublayer. Neither is
          glamorous; both are why training a 100-layer model is even possible. They are{' '}
          <strong>residual connections</strong> and <strong>LayerNorm</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Residual Connections: Add the Input Back">
        <p>
          A residual connection is almost embarrassingly simple. Instead of replacing the vector with
          whatever a sublayer computes, you <strong>add the sublayer&apos;s output to the original
          input</strong>:
        </p>
        <MathFormula label="every sublayer is wrapped like this">
          <code style={{ fontSize: 15, color: '#4c1d95' }}>output = x + sublayer(x)</code>
        </MathFormula>
        <p>
          Remember from the last step that the FFN gave us a <em>correction</em>, not a replacement:
          FFN(x) = [0.12, 0.12, &minus;0.06]. The residual makes that literal — the sublayer only has to
          learn how to <strong>nudge</strong> the vector, because the vector itself is carried straight
          through and added back. Two payoffs:
        </p>
        <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>Gradients get a shortcut.</strong> The <code>+ x</code> is an open highway straight
            from the top of the stack to the bottom. The gradient can flow back along it untouched, so it
            never vanishes — even through a hundred blocks.
          </li>
          <li>
            <strong>A block can do nothing, safely.</strong> If a sublayer learns to output near-zero,
            the residual just passes the input along unchanged. So adding more blocks can never make
            things <em>worse</em>; in the worst case they idle.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Add &amp; Norm, On Our Vector">
        <p>
          Our contextual &ldquo;is&rdquo; went into the FFN as{' '}
          <strong style={{ color: '#5b21b6' }}>x = [0.72, 0.52, 0.26]</strong> and came out as the
          correction FFN(x) = [0.12, 0.12, &minus;0.06]. First the <strong>Add</strong>:
        </p>
        <CalcStep number={1}>
          x + FFN(x) = [0.72+0.12, 0.52+0.12, 0.26&minus;0.06] = <strong>[0.84, 0.64, 0.20]</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Now the <strong>Norm</strong>. After all that adding, a vector&apos;s numbers can drift to any
          scale, and lopsided scales are exactly what destabilize deep training. LayerNorm re-centers and
          re-scales the vector so its values always have <strong>mean 0 and a consistent spread</strong>,
          every layer, forever. Compute the mean of [0.84, 0.64, 0.20]:
        </p>
        <CalcStep number={2}>
          mean = (0.84 + 0.64 + 0.20) / 3 = 1.68 / 3 = <strong>0.56</strong>
        </CalcStep>
        <CalcStep number={3}>
          subtract the mean: [0.84&minus;0.56, 0.64&minus;0.56, 0.20&minus;0.56] = [0.28, 0.08, &minus;0.36]
        </CalcStep>
        <CalcStep number={4}>
          spread (std dev) = &radic;((0.28&sup2; + 0.08&sup2; + 0.36&sup2;) / 3) = &radic;(0.2144 / 3) &asymp; <strong>0.27</strong>
        </CalcStep>
        <CalcStep number={5}>
          divide by the spread: [0.28, 0.08, &minus;0.36] / 0.27 &asymp; <strong>[1.05, 0.30, &minus;1.35]</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          That normalized vector is what flows on. (A real LayerNorm also multiplies by two tiny learned
          knobs, gamma and beta, so the model can rescale and re-shift if it wants — we&apos;ll leave them
          at their neutral 1 and 0.) The numbers are now centered and tamed, ready for the next block to
          do its work without the scale blowing up.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Full Block">
        <p>
          Snap the pieces together and you have one complete transformer block. The pattern is always the
          same: a sublayer, then Add &amp; Norm; another sublayer, then Add &amp; Norm.
        </p>
        <BlockDiagram />
        <p>
          That is the entire repeating unit of a transformer — attention to share information between
          words, a feed-forward net to think about each word, and the residual-plus-norm plumbing that
          keeps a deep stack of them trainable. A vector goes in; a richer vector of the exact same shape
          comes out, which is precisely why you can feed it straight into another identical block.
        </p>
        <p style={{ fontSize: 13.5, color: '#64748b', borderLeft: '3px solid #c4b5fd', paddingLeft: '0.9rem', marginTop: '1.1rem' }}>
          A note on our running number: to keep the grand finale in Part 5 clean, this course carries the
          attention context vector{' '}
          <strong style={{ color: '#5b21b6' }}>[0.72, 0.52, 0.26]</strong> forward as the headline
          representation of &ldquo;is.&rdquo; The FFN, residual, and LayerNorm numbers above show the real
          machinery a block runs — a real model would keep refining the vector through every block, but
          we&apos;ll hold our one tidy vector steady so you can finish the hand-computation yourself.
        </p>
      </ExplanationBox>
    </div>
  );
}
