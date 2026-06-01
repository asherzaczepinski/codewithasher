'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Same pre-trained network and inputs as the backpropagation step, but here we
// only ever look at the LAST layer: the loss, the output neuron, and the three
// weights feeding it from the last hidden layer. No backward sweep through the
// whole network yet — that is the next step. This one is just about the idea of
// a derivative: the slope that tells you which way to move a weight.
const W1 = [[-0.3, 0.9], [0.5, 0.7], [-0.4, 0.8]];
const B1 = [0.1, -0.2, 0.15];
const W2 = [[0.6, -0.3, 0.5], [0.4, 0.7, -0.2], [-0.5, 0.6, 0.8]];
const B2 = [-0.1, 0.2, -0.15];
const W3 = [0.7, 0.5, 0.6];
const B3 = -0.2;
const INPUT = [1.0, 0.5];
const TARGET = 1.0;
const sig = (x: number) => 1 / (1 + Math.exp(-x));

const A1 = [0, 1, 2].map(i => sig(INPUT[0] * W1[i][0] + INPUT[1] * W1[i][1] + B1[i]));
const A2 = [0, 1, 2].map(i => sig(A1[0] * W2[i][0] + A1[1] * W2[i][1] + A1[2] * W2[i][2] + B2[i]));
const AO = sig(A2[0] * W3[0] + A2[1] * W3[1] + A2[2] * W3[2] + B3);
const PCT = Math.round(AO * 100);

// blame at the output, then the slope of the loss w.r.t. each output-layer weight
const DLDO = AO - TARGET;                 // ∂Loss/∂output — the error
const D_OUT = DLDO * AO * (1 - AO);       // error scaled by the output's own slope
const GRAD = [0, 1, 2].map(i => D_OUT * A2[i]);   // ∂Loss/∂w₃[i] = the weight's slope

const f3 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(3).replace(/^0\./, '.');
const f2 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace(/^0\./, '.');

// node positions: last hidden layer → output → loss
const H2Y = [70, 150, 230];
const H2X = 92, OUTX = 300, LOSSX = 452, MIDY = 150;

function LastLayerDerivatives() {
  const [sel, setSel] = useState<number | null>(0);
  const active = sel;

  return (
    <div className="deriv-box">
      <svg viewBox="0 0 540 300" className="deriv-svg">
        {/* weights from last hidden layer into the output */}
        {[0, 1, 2].map(i => {
          const lit = active === i;
          const x1 = H2X + 22, y1 = H2Y[i], x2 = OUTX - 26, y2 = MIDY;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const up = GRAD[i] < 0; // negative slope → increase the weight
          return (
            <g key={i} className="hit" onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={lit ? '#ea580c' : '#cbd5e1'} strokeWidth={lit ? 3 : 1.5} />
              <text x={mx} y={my - 6} textAnchor="middle" fontSize={11} fontWeight="bold"
                fill={lit ? '#c2410c' : '#64748b'}>w {W3[i]}</text>
              {lit && (
                <text x={mx} y={my + 12} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#ea580c">
                  slope {f3(GRAD[i])} {up ? '↑' : '↓'}
                </text>
              )}
            </g>
          );
        })}

        {/* output → loss */}
        <line x1={OUTX + 26} y1={MIDY} x2={LOSSX - 24} y2={MIDY} stroke="#cbd5e1" strokeWidth={1.5} />
        <text x={(OUTX + LOSSX) / 2} y={MIDY - 7} textAnchor="middle" fontSize={10} fill="#94a3b8">error {f3(DLDO)}</text>

        {/* last hidden layer neurons */}
        {[0, 1, 2].map(i => {
          const lit = active === i;
          return (
            <g key={i} className="hit" onMouseEnter={() => setSel(i)} onClick={() => setSel(i)}>
              <circle cx={H2X} cy={H2Y[i]} r={22}
                fill={lit ? '#f3f4f6' : 'white'} stroke={lit ? '#6b7280' : '#333'} strokeWidth={lit ? 3 : 2} />
              <text x={H2X} y={H2Y[i] + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#333">{f2(A2[i])}</text>
            </g>
          );
        })}

        {/* output */}
        <circle cx={OUTX} cy={MIDY} r={26} fill="#fee2e2" stroke="#dc2626" strokeWidth={2.5} />
        <text x={OUTX} y={MIDY + 4} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#333">{PCT}%</text>
        <text x={OUTX} y={MIDY - 34} textAnchor="middle" fontSize={9} fill="#666">prediction</text>

        {/* loss */}
        <circle cx={LOSSX} cy={MIDY} r={24} fill="#fee2e2" stroke="#dc2626" strokeWidth={2.5} />
        <text x={LOSSX} y={MIDY + 4} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#333">Loss</text>

        {/* layer labels */}
        <text x={H2X} y={284} textAnchor="middle" fontSize={9} fill="#999">LAST HIDDEN LAYER</text>
        <text x={OUTX} y={284} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
        <text x={LOSSX} y={284} textAnchor="middle" fontSize={9} fill="#999">LOSS</text>
      </svg>

      <div className="deriv-info">
        {active === null ? (
          <p className="hint">Click a weight to see its slope.</p>
        ) : (
          <>
            <h4>Weight w = {W3[active]}</h4>
            <p>
              Nudge this weight up a hair and the loss moves by its <strong>slope</strong> (its
              derivative): ∂Loss/∂w = {f3(GRAD[active])}. {GRAD[active] < 0 ? (
                <>The slope is <strong>negative</strong>, so increasing the weight makes the loss go
                <strong> down</strong> → move it <strong>up</strong>.</>
              ) : (
                <>The slope is <strong>positive</strong>, so increasing the weight makes the loss go
                <strong> up</strong> → move it <strong>down</strong>.</>
              )} It comes from the error at the output ({f3(DLDO)}) times the signal this weight
              carried ({f2(A2[active])}).
            </p>
          </>
        )}
      </div>

      <style jsx>{`
        .deriv-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .deriv-svg { width: 100%; max-width: 500px; height: auto; display: block; margin: 0 auto; }
        .deriv-svg :global(.hit) { cursor: pointer; }
        .deriv-info { margin-top: 1rem; padding: 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; min-height: 86px; }
        .deriv-info h4 { margin: 0 0 0.4rem; color: #c2410c; font-size: 15px; }
        .deriv-info p { margin: 0; font-size: 14px; color: #555; line-height: 1.55; }
        .deriv-info .hint { color: #999; font-style: italic; text-align: center; }
      `}</style>
    </div>
  );
}

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="Derivatives: A Slope That Points the Way">
        <p>
          We have a loss — one number saying how wrong we were. Now we need to know what to do
          about it: for each weight, should it go <em>up</em> or <em>down</em>, and by how much?
        </p>
        <p>
          The tool for that is the <strong>derivative</strong>, and it&apos;s simpler than it sounds.
          A derivative is just a <strong>slope</strong>: if you wiggle one number a tiny bit, how
          much — and in which direction — does another number move? Here the two numbers are a
          weight and the loss. The derivative ∂Loss/∂weight answers: &quot;if I nudge this weight up
          slightly, does the loss rise or fall, and how fast?&quot;
        </p>
        <p>
          That single number is the entire compass for learning. Its <strong>sign</strong> tells
          you which way to move the weight; its <strong>size</strong> tells you how much that weight
          matters to the mistake.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Try It: The Output Layer's Weights">
        <p>
          For now we look only at the <strong>last layer</strong> — the weights feeding the output
          neuron, where each weight touches the prediction directly. Click a weight to see its slope
          and which way it should move.
        </p>
        <LastLayerDerivatives />
      </ExplanationBox>

      <ExplanationBox title="Reading the Slope">
        <p>
          Every one of these slopes came out <strong>negative</strong> — which makes sense: our
          prediction ({PCT}%) is below the target (100%), so every weight feeding the output needs to
          go <em>up</em> to push the prediction higher. A positive slope would mean the opposite:
          turn that weight down.
        </p>
        <p>
          And the slopes aren&apos;t equal. A weight fed by a stronger signal gets a bigger slope, so
          it earns a bigger correction — the weight with the most influence over the mistake moves
          the most. That is the whole rule for nudging weights: move each one opposite its slope,
          scaled by how big that slope is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="But Most Weights Are Buried Deeper">
        <p>
          This was easy because output-layer weights touch the loss directly. Most weights don&apos;t —
          they sit layers back and affect the loss only indirectly, through every neuron in front of
          them. To get <em>their</em> slopes, we take this exact idea and push it backward through the
          network, one layer at a time.
        </p>
        <p>
          That backward push is <strong>backpropagation</strong> — the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
