'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// Interactive ReLU: input on a slider, output max(0, x).
function ReluDemo() {
  const [x, setX] = useState(-0.26);
  const out = Math.max(0, x);
  return (
    <div className="re-box">
      <p className="re-lab">
        Drag the input. ReLU passes positives through unchanged and clamps anything negative to zero:
      </p>
      <MathFormula>
        <code style={{ fontSize: 15, color: '#4c1d95' }}>ReLU(x) = max(0, x)</code>
      </MathFormula>
      <input
        type="range" min={-1} max={1.4} step={0.01} value={x}
        onChange={e => setX(parseFloat(e.target.value))}
        className="re-slider"
      />
      <div className="re-readout">
        <span className="re-pill">in: {x.toFixed(2)}</span>
        <span className="re-arr">→</span>
        <span className="re-pill out" style={{ background: out > 0 ? '#dcfce7' : '#fee2e2', color: out > 0 ? '#15803d' : '#b91c1c' }}>
          out: {out.toFixed(2)}
        </span>
        <span className="re-state">{out > 0 ? 'unit fires' : 'unit is silent'}</span>
      </div>
      <style jsx>{`
        .re-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .re-lab { font-size: 13px; color: #64748b; margin: 0 0 0.5rem; }
        .re-slider { width: 100%; accent-color: #7c3aed; margin: 0.6rem 0 1rem; }
        .re-readout { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
        .re-pill { font-family: monospace; font-weight: 700; font-size: 14px; padding: 0.35rem 0.8rem; border-radius: 8px; background: #ede9fe; color: #5b21b6; }
        .re-arr { color: #94a3b8; }
        .re-state { font-size: 12px; color: #64748b; font-style: italic; }
      `}</style>
    </div>
  );
}

// Param-share bar: how parameters split inside a block.
function ParamBar() {
  return (
    <div className="pb-box">
      <p className="pb-lab">Where the parameters live inside one transformer block (roughly):</p>
      <div className="pb-bar">
        <div className="pb-seg ffn" style={{ flex: 67 }}>Feed-forward ~2/3</div>
        <div className="pb-seg attn" style={{ flex: 33 }}>Attention ~1/3</div>
      </div>
      <p className="pb-cap">
        Most of a model&apos;s weights — and so most of its stored &ldquo;knowledge&rdquo; — sit in the
        feed-forward networks, not in attention.
      </p>
      <style jsx>{`
        .pb-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .pb-lab { font-size: 13px; color: #64748b; margin: 0 0 0.8rem; }
        .pb-bar { display: flex; height: 38px; border-radius: 9px; overflow: hidden; }
        .pb-seg { display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: white; }
        .pb-seg.ffn { background: linear-gradient(90deg,#7c3aed,#5b21b6); }
        .pb-seg.attn { background: linear-gradient(90deg,#93c5fd,#3b82f6); }
        .pb-cap { margin: 1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step19() {
  return (
    <div>
      <ExplanationBox title="Attention Mixed the Words. Now Think About Each One.">
        <p>
          Attention&apos;s whole job was to move information <strong>between</strong> words: it let
          &ldquo;is&rdquo; reach back and pull meaning out of &ldquo;sky.&rdquo; The result was a
          contextual vector for &ldquo;is&rdquo;:{' '}
          <strong style={{ color: '#5b21b6' }}>[0.72, 0.52, 0.26]</strong> — mostly sky-flavored,
          because it borrowed so heavily from its subject.
        </p>
        <p>
          The next stage does the opposite kind of work. The <strong>feed-forward network</strong> (FFN)
          takes that vector and processes it <em>on its own</em>, with no peeking at the other words. The
          very same FFN runs separately on every position — &ldquo;The,&rdquo; &ldquo;sky,&rdquo; and
          &ldquo;is&rdquo; each pass through it independently. Attention asks &ldquo;who should I listen
          to?&rdquo; The FFN asks &ldquo;now that I&apos;ve listened, what do I make of it?&rdquo;
        </p>
      </ExplanationBox>

      <ExplanationBox title="It's Just the Network From Last Course">
        <p>
          There is nothing exotic here. The FFN is the plain multi-layer perceptron you already built:
          multiply by a weight matrix, apply a nonlinearity, multiply by another weight matrix. The one
          twist is its shape — it deliberately goes <strong>wide in the middle</strong>:
        </p>
        <MathFormula label="the feed-forward recipe">
          <code style={{ fontSize: 15, color: '#4c1d95' }}>
            FFN(x) = W&#8322; &middot; ReLU(W&#8321; &middot; x)
          </code>
        </MathFormula>
        <p>
          <strong>Expand → nonlinearity → compress.</strong> The first matrix W<sub>1</sub> blows the
          vector up to a much wider hidden layer — typically <strong>4&times;</strong> the width
          (768 → 3072 in GPT-2). A nonlinearity (ReLU, or its smoother cousin GELU) decides which hidden
          units fire. Then W<sub>2</sub> squeezes everything back down to the original size so it fits
          the next stage. Wide enough to compute something rich, narrow on the way out so the pipeline
          stays the same shape.
        </p>
        <ReluDemo />
      </ExplanationBox>

      <WorkedExample title="Running Our Vector Through a Tiny FFN">
        <p>
          Let&apos;s push our contextual &ldquo;is&rdquo; through a toy FFN. To keep it on a napkin
          we&apos;ll expand to just <strong>4 hidden units</strong> (a real block would use thousands),
          but every operation is the real thing. Input{' '}
          <strong style={{ color: '#5b21b6' }}>x = [0.72, 0.52, 0.26]</strong>.
        </p>
        <p style={{ marginTop: '0.8rem' }}>
          <strong>Step 1 — expand.</strong> Each hidden unit is one row of W<sub>1</sub> dotted with x.
          Read each row as a little feature detector:
        </p>
        <CalcStep number={1}>
          u&#8321; = [1, 0, 0] &middot; x = 0.72&nbsp;&nbsp;(reads the TOPIC / sky-ness slot)
        </CalcStep>
        <CalcStep number={2}>
          u&#8322; = [0, 1, 0] &middot; x = 0.52&nbsp;&nbsp;(reads the BRIGHT slot)
        </CalcStep>
        <CalcStep number={3}>
          u&#8323; = [0, &minus;1, 1] &middot; x = &minus;0.52 + 0.26 = <strong>&minus;0.26</strong>&nbsp;&nbsp;(a &ldquo;dark, not bright&rdquo; detector)
        </CalcStep>
        <CalcStep number={4}>
          u&#8324; = [1, 1, 0] &middot; x = 0.72 + 0.52 = 1.24&nbsp;&nbsp;(fires on a vivid sky concept)
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          <strong>Step 2 — ReLU.</strong> Clamp every negative to zero. Unit 3 was{' '}
          <strong>&minus;0.26</strong>, so it goes silent; the rest pass through:
        </p>
        <MathFormula>
          <code style={{ fontSize: 14, color: '#4c1d95' }}>
            h = ReLU([0.72, 0.52, &minus;0.26, 1.24]) = [0.72, 0.52, <strong>0</strong>, 1.24]
          </code>
        </MathFormula>
        <p>
          That single zero is the point of the nonlinearity. The &ldquo;dark&rdquo; detector looked at a
          sky-flavored vector, found no darkness, and switched off. Without ReLU the whole FFN would
          collapse into one big matrix multiply — a flat, linear layer that could never make a
          this-but-not-that decision.
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>Step 3 — compress.</strong> W<sub>2</sub> mixes the surviving hidden units back down to
          three numbers (here it mostly reads the strong unit 4):
        </p>
        <CalcStep number={5}>
          out&#8321; = [0, 0, 0, 0.1] &middot; h = 0.124 &asymp; <strong>0.12</strong>
        </CalcStep>
        <CalcStep number={6}>
          out&#8322; = [0, 0, 0, 0.1] &middot; h = 0.124 &asymp; <strong>0.12</strong>
        </CalcStep>
        <CalcStep number={7}>
          out&#8323; = [0, 0, 0, &minus;0.05] &middot; h = &minus;0.062 &asymp; <strong>&minus;0.06</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          So this toy <strong>FFN(x) = [0.12, 0.12, &minus;0.06]</strong> — a small adjustment the network
          wants to make to the vector. (These weights are invented to keep the arithmetic clean; the
          mechanism is exactly what runs inside GPT.) Notice it did <em>not</em> hand back a finished
          word vector — it produced a <em>correction</em>. How that correction gets folded back in, safely,
          is the next step: residual connections.
        </p>
      </WorkedExample>

      <ExplanationBox title="This Is Where the Knowledge Lives">
        <p>
          The FFN looks humble next to attention&apos;s clever query/key dance, but it is where most of a
          model actually <em>is</em>. Because the hidden layer is so wide, the two FFN matrices hold the
          bulk of the parameters in every block — commonly about two-thirds of them.
        </p>
        <ParamBar />
        <p>
          When people say a model &ldquo;knows&rdquo; that Paris is in France, or that water boils at
          100&deg;C, that knowledge is overwhelmingly baked into these feed-forward weights. Attention decides
          <em> which</em> words to combine; the feed-forward network is the giant lookup-and-transform
          that turns those combinations into stored facts and patterns. Researchers can even locate
          specific facts in specific FFN neurons and edit them.
        </p>
        <p>
          We now have both halves of the block: attention to mix across words, a feed-forward net to
          process each one. The last piece is the plumbing that lets you stack these halves dozens of
          times without the signal falling apart — residual connections and LayerNorm.
        </p>
      </ExplanationBox>
    </div>
  );
}
