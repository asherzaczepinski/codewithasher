'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Same network, coordinates and visual vocabulary as GradientFlowNetwork /
// InteractiveNetwork: 2 inputs → 3 hidden → 3 hidden → 1 output, plain circular
// nodes, blue inputs, red output, gray forward edges, #999 layer labels, info
// panel below, plus a Loss node on the right. We run the REAL forward + backward
// pass below, so every node shows its actual derivative (sigmoid slope) and the
// blame δ the 30% error sends back to it. Hover or click any node to trace it.
const inputX = 60, hidden1X = 180, hidden2X = 320, outputX = 440, lossX = 548;
const inputY = [100, 200];
const hiddenY = [60, 150, 240];
const outputY = 150;

const POS: Record<string, [number, number]> = {
  'in-0': [inputX, inputY[0]], 'in-1': [inputX, inputY[1]],
  'h1-0': [hidden1X, hiddenY[0]], 'h1-1': [hidden1X, hiddenY[1]], 'h1-2': [hidden1X, hiddenY[2]],
  'h2-0': [hidden2X, hiddenY[0]], 'h2-1': [hidden2X, hiddenY[1]], 'h2-2': [hidden2X, hiddenY[2]],
  out: [outputX, outputY], loss: [lossX, outputY],
};

// Forward connections, keyed `${from}->${to}` (from = earlier layer).
const CONNECTIONS: { from: string; to: string }[] = [
  ...[0, 1].flatMap(i => [0, 1, 2].map(n => ({ from: `in-${i}`, to: `h1-${n}` }))),
  ...[0, 1, 2].flatMap(f => [0, 1, 2].map(t => ({ from: `h1-${f}`, to: `h2-${t}` }))),
  ...[0, 1, 2].map(n => ({ from: `h2-${n}`, to: 'out' })),
  { from: 'out', to: 'loss' },
];

// --- the actual network (same pre-trained weights as InteractiveNetwork) ---
const W1 = [[-0.3, 0.9], [0.5, 0.7], [-0.4, 0.8]];
const B1 = [0.1, -0.2, 0.15];
const W2 = [[0.6, -0.3, 0.5], [0.4, 0.7, -0.2], [-0.5, 0.6, 0.8]];
const B2 = [-0.1, 0.2, -0.15];
const W3 = [0.7, 0.5, 0.6];
const B3 = -0.2;
const INPUT = [1.0, 0.5];   // temperature, humidity — picked so the network predicts ~70%
const TARGET = 1.0;          // it rained
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const slope = (a: number) => a * (1 - a);   // sigmoid derivative, written via the activation

// forward pass
const A1 = [0, 1, 2].map(i => sig(INPUT[0] * W1[i][0] + INPUT[1] * W1[i][1] + B1[i]));
const A2 = [0, 1, 2].map(i => sig(A1[0] * W2[i][0] + A1[1] * W2[i][1] + A1[2] * W2[i][2] + B2[i]));
const AO = sig(A2[0] * W3[0] + A2[1] * W3[1] + A2[2] * W3[2] + B3);
const PCT = Math.round(AO * 100);

// backward pass — blame (δ) at a node = (incoming blame) × (its own sigmoid slope)
const DLDO = AO - TARGET;                 // ∂Loss/∂output: the 30% error, flows back from here
const D_OUT = DLDO * slope(AO);
const D2 = [0, 1, 2].map(i => (D_OUT * W3[i]) * slope(A2[i]));
const SUM1 = [0, 1, 2].map(i => [0, 1, 2].reduce((s, j) => s + D2[j] * W2[j][i], 0));
const D1 = [0, 1, 2].map(i => SUM1[i] * slope(A1[i]));

// per-node derivative (sigmoid slope) and blame δ
const NUM: Record<string, { slope: number; delta: number }> = {
  out: { slope: slope(AO), delta: D_OUT },
  'h2-0': { slope: slope(A2[0]), delta: D2[0] },
  'h2-1': { slope: slope(A2[1]), delta: D2[1] },
  'h2-2': { slope: slope(A2[2]), delta: D2[2] },
  'h1-0': { slope: slope(A1[0]), delta: D1[0] },
  'h1-1': { slope: slope(A1[1]), delta: D1[1] },
  'h1-2': { slope: slope(A1[2]), delta: D1[2] },
};

// blame carried backward along each connection (δ of the later node × the weight)
const CONN_BLAME: Record<string, number> = { 'out->loss': DLDO };
[0, 1, 2].forEach(i => { CONN_BLAME[`h2-${i}->out`] = D_OUT * W3[i]; });
[0, 1, 2].forEach(i => [0, 1, 2].forEach(j => { CONN_BLAME[`h1-${i}->h2-${j}`] = D2[j] * W2[j][i]; }));
[0, 1].forEach(k => [0, 1, 2].forEach(i => { CONN_BLAME[`in-${k}->h1-${i}`] = D1[i] * INPUT[k]; }));

// formatting: drop the leading zero, use a real minus sign
const f3 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(3).replace(/^0\./, '.');
const f2 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace(/^0\./, '.');

// Every connection on a backward path from the loss to the target node.
function traceTo(target: string): Set<string> {
  const s = new Set<string>(['out->loss']); // the loss always reaches the output first
  if (target === 'loss' || target === 'out') return s;
  if (target.startsWith('h2')) {
    s.add(`${target}->out`);
    return s;
  }
  [0, 1, 2].forEach(j => s.add(`h2-${j}->out`));
  if (target.startsWith('h1')) {
    [0, 1, 2].forEach(j => s.add(`${target}->h2-${j}`));
    return s;
  }
  // input: full sweep down to this input's first-layer weights
  [0, 1, 2].forEach(i => [0, 1, 2].forEach(j => s.add(`h1-${i}->h2-${j}`)));
  [0, 1, 2].forEach(i => s.add(`${target}->h1-${i}`));
  return s;
}

const NODE_TYPE = (id: string): 'in' | 'h1' | 'h2' | 'out' | 'loss' =>
  id === 'out' ? 'out' : id === 'loss' ? 'loss' : (id.slice(0, 2) as 'in' | 'h1' | 'h2');

const FILL: Record<string, string> = { in: '#dbeafe', h1: '#f3f4f6', h2: '#f3f4f6', out: '#fee2e2', loss: '#fee2e2' };
const STROKE: Record<string, string> = { in: '#2563eb', h1: '#6b7280', h2: '#6b7280', out: '#dc2626', loss: '#dc2626' };

function nodeInfo(id: string): { title: string; description: string } {
  if (id === 'loss') return {
    title: 'Loss — where the correction is born',
    description: `We predicted ${PCT}%, but it rained (target 100%). The blame starts as ∂Loss/∂output = pred − target = ${f3(DLDO)} — that is the 30% error, and it is what flows backward into the network.`,
  };
  if (id === 'out') return {
    title: `Output — ${PCT}% rain`,
    description: `Its derivative is the sigmoid slope a(1−a) = ${f2(NUM.out.slope)}. Blame here: ∂Loss/∂output (${f3(DLDO)}) × slope (${f2(NUM.out.slope)}) = δ ${f3(NUM.out.delta)}.`,
  };
  if (id.startsWith('h2')) {
    const i = +id.slice(3);
    return {
      title: `Hidden 2 · neuron ${i + 1}`,
      description: `Blame in = δ_out (${f3(D_OUT)}) × weight (${W3[i]}) = ${f3(CONN_BLAME[`h2-${i}->out`])}. Its derivative (slope) = ${f2(NUM[id].slope)}. So δ = ${f3(CONN_BLAME[`h2-${i}->out`])} × ${f2(NUM[id].slope)} = ${f3(NUM[id].delta)}.`,
    };
  }
  if (id.startsWith('h1')) {
    const i = +id.slice(3);
    return {
      title: `Hidden 1 · neuron ${i + 1}`,
      description: `Blame in = the three layer-2 deltas through their weights, summed = ${f3(SUM1[i])}. Derivative (slope) = ${f2(NUM[id].slope)}. So δ = ${f3(NUM[id].delta)} — far smaller than the output’s δ ${f3(D_OUT)}: the blame fades as it travels back (the vanishing gradient).`,
    };
  }
  const k = +id.slice(3);
  return {
    title: id === 'in-0' ? 'Temperature input' : 'Humidity input',
    description: `Value = ${INPUT[k].toFixed(1)}. Inputs get no δ of their own, but this value is the lever arm: each first-layer weight it feeds is corrected by δ(its neuron) × ${INPUT[k].toFixed(1)}. A bigger input → a bigger weight correction.`,
  };
}

function seg(from: string, to: string) {
  const [ax, ay] = POS[from], [bx, by] = POS[to];
  const ar = from === 'out' ? 22 : from === 'loss' ? 20 : 18;
  const br = to === 'out' ? 22 : to === 'loss' ? 20 : 18;
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  return { x1: ax + (dx / len) * ar, y1: ay + (dy / len) * ar, x2: bx - (dx / len) * br, y2: by - (dy / len) * br };
}

function BackpropNetwork() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned ?? 'out';

  const litConns = traceTo(active);
  const litNodes = new Set<string>(['loss', 'out', active]);
  litConns.forEach(k => { const [f, t] = k.split('->'); litNodes.add(f); litNodes.add(t); });

  const info = nodeInfo(active);

  const renderNode = (id: string) => {
    const [x, y] = POS[id];
    const type = NODE_TYPE(id);
    const r = type === 'out' ? 23 : type === 'loss' ? 21 : 19;
    const lit = litNodes.has(id);
    const isActive = id === active;
    const num = NUM[id];
    const inside = type === 'in' ? INPUT[+id.slice(3)].toFixed(1)
      : type === 'loss' ? 'Loss'
      : id === 'out' ? `${PCT}%`
      : f3(num.delta);
    return (
      <g key={id} className="node"
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setPinned(p => (p === id ? null : id))}
        opacity={lit ? 1 : 0.4}>
        {/* derivative (sigmoid slope) above each neuron; name above each input */}
        {num && (
          <text x={x} y={y - r - 5} textAnchor="middle" fontSize={8} fill="#64748b">σ′ {f2(num.slope)}</text>
        )}
        {type === 'in' && (
          <text x={x} y={y - r - 5} textAnchor="middle" fontSize={8} fill="#2563eb">{id === 'in-0' ? 'Temp' : 'Humid'}</text>
        )}
        <circle cx={x} cy={y} r={r}
          fill={lit ? FILL[type] : 'white'}
          stroke={lit ? STROKE[type] : '#333'}
          strokeWidth={isActive ? 3.5 : 2}
          style={isActive ? { filter: `drop-shadow(0 0 7px ${STROKE[type]}88)` } : undefined} />
        <text x={x} y={id === 'out' ? y - 1 : y + 3} textAnchor="middle"
          fontSize={id === 'out' || type === 'in' || type === 'loss' ? 10 : 9}
          fontWeight="bold" fill={num && id !== 'out' ? '#c2410c' : '#333'}>{inside}</text>
        {/* the output also shows its own δ on a second line */}
        {id === 'out' && (
          <text x={x} y={y + 12} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#c2410c">δ {f3(num.delta)}</text>
        )}
      </g>
    );
  };

  return (
    <div className="trace-network">
      <svg viewBox="0 0 600 300" className="trace-svg">
        {/* connections (orange on the active trace) + the blame number on the active hop */}
        {CONNECTIONS.map(c => {
          const key = `${c.from}->${c.to}`;
          const lit = litConns.has(key);
          const incident = c.from === active || c.to === active;
          const { x1, y1, x2, y2 } = seg(c.from, c.to);
          return (
            <g key={key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={lit ? '#ea580c' : '#d1d5db'} strokeWidth={lit ? 2.5 : 1} />
              {lit && incident && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 3} textAnchor="middle"
                  fontSize={8} fontWeight="bold" fill="#ea580c">{f3(CONN_BLAME[key])}</text>
              )}
            </g>
          );
        })}

        {/* nodes */}
        {Object.keys(POS).map(renderNode)}

        {/* layer labels */}
        <text x={inputX} y={290} textAnchor="middle" fontSize={9} fill="#999">INPUTS</text>
        <text x={hidden1X} y={290} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 1</text>
        <text x={hidden2X} y={290} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 2</text>
        <text x={outputX} y={290} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
        <text x={lossX} y={290} textAnchor="middle" fontSize={9} fill="#999">LOSS</text>
      </svg>

      <div className="info-panel">
        <h4>{info.title}</h4>
        <p>{info.description}</p>
        <span className="hint">
          {pinned ? 'Pinned — click it again to unpin. ' : ''}Hover or click any node to trace how the loss reaches it.
        </span>
      </div>

      <style jsx>{`
        .trace-network {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .trace-svg {
          width: 100%;
          max-width: 540px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .trace-svg :global(.node) {
          cursor: pointer;
        }
        .info-panel {
          margin-top: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          min-height: 96px;
        }
        .info-panel h4 {
          margin: 0 0 0.5rem 0;
          color: #c2410c;
          font-size: 15px;
        }
        .info-panel p {
          margin: 0;
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }
        .info-panel .hint {
          display: block;
          margin-top: 0.6rem;
          color: #999;
          font-style: italic;
          font-size: 12px;
        }
        @media (max-width: 640px) {
          .trace-svg { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="Backpropagation: The Network Was Wrong. Now What?">
        <p>
          Our network predicted 70% chance of rain. It actually rained. The correct answer was 100%. We were off.
        </p>
        <p>
          We computed the loss — a number that tells us how wrong we were. But that number alone
          doesn&apos;t tell us what to do about it. We have a whole network full of weights that all
          contributed to this wrong answer. Which ones do we change? By how much? In which direction?
        </p>
        <p>
          The answer is <strong>backpropagation</strong>: start at the loss and push the blame
          backward through the network, one layer at a time, until every weight knows exactly how
          much it was responsible for the mistake. This step shows you that flow in action.
        </p>
      </ExplanationBox>


<ExplanationBox title="The Trick: Break the Chain Into Simple Pieces">
        <p>
          A weight&apos;s effect on the loss is indirect — it ripples through the weighted sum, then
          the output, then finally the loss. Instead of trying to figure out that whole chain at
          once, you just look at each step on its own and measure what happens there. Put those
          pieces together and you have everything you need to know how much this weight was
          responsible for the mistake.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch the Blame Flow Back — Real Numbers">
        <p>
          Here is the whole network with the actual numbers from this miss. We predicted {PCT}% but it
          rained, so the loss sends ∂Loss/∂output = {f3(DLDO)} back into the output. Going backward, every
          neuron multiplies the blame arriving from its right by its own <strong>derivative</strong> — the
          sigmoid slope, shown as σ′ above each node — to get its blame <strong>δ</strong>, shown inside.
          Hover or click any node to follow one trace and watch the arithmetic at each hop.
        </p>
        <BackpropNetwork />
      </ExplanationBox>

<ExplanationBox title="Step 1: Loss vs Output">
        <p>
          The <strong>output</strong> here is the neuron&apos;s final prediction — the rain confidence
          percentage that sigmoid spits out. In our example, that&apos;s 70%. The{' '}
          <strong>loss</strong> is the number measuring how wrong that was. It rained, so the target was 100%, and the
          loss captures that 30-point gap.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This first rate asks: if the prediction nudged up slightly — say from 70% to 70.1% —
          how much would the loss drop? When the prediction is way off like ours is, that nudge
          helps a lot. The loss is falling steeply and any improvement matters. But if the
          prediction were already at 99%, nudging it to 99.1% barely changes anything — the loss
          was already near zero.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The sign matters too. Our prediction is below the target (70% vs 100%), so pushing
          the output up reduces the loss — this rate comes out negative. If we had predicted
          110% somehow and overshot, pushing the output up would make things worse — positive
          rate. The sign is what tells the network which direction to move each weight.
        </p>
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 1 gives you the urgency and direction of the correction — how badly the network messed up, and whether weights need to go up or down. This number is the same for every weight in the neuron.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> The only way to reduce the loss is to change weights so the output moves toward the target. If the prediction is too low, weights need to increase the output. If it&apos;s too high, weights need to decrease it. Step 1 tells you which — the sign of this rate is the direction every weight in the neuron will move.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Output vs Weighted Sum">
        <p>
          Inside every neuron, the weighted sum is the raw number computed before sigmoid —
          say it comes out to 0.85. Sigmoid then converts that into the output confidence:
          sigmoid(0.85) ≈ 70%. That 70% is what the neuron sends forward and what eventually
          becomes the final prediction.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 2 asks: if the weighted sum nudged from 0.85 to 0.86, how much would the
          output move from 70%? The answer depends on the slope of the sigmoid curve at
          that exact point. At 70% output, sigmoid still has decent slope — the output would
          move noticeably. But imagine a different neuron whose weighted sum is so large that
          sigmoid has already pushed its output to 98%. That neuron is sitting on the flat
          tail of the S-curve. Nudging its weighted sum from 3.9 to 4.0 barely changes
          the output at all — it stays stuck at roughly 98% no matter what.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Why does this matter for correction? Because the correction to the weighted sum
          has to travel through this slope to reach the output. If the slope is nearly zero,
          the correction signal gets multiplied by nearly zero — and arrives at the output
          as almost nothing. That neuron can&apos;t learn. This is the <strong>vanishing gradient
          problem</strong>: a neuron saturated near 0% or 100% stops responding to corrections
          no matter how wrong the network is.
        </p>
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 2 tells you whether the correction can actually get through. It&apos;s a gate — wide open when the neuron is in the middle of the sigmoid curve, nearly shut when it&apos;s stuck near 0 or 1. Also the same for every weight in the neuron.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> If the gate is nearly shut — neuron stuck near 0% or 100% — adjusting any single weight in this neuron barely helps, because the correction gets killed by the flat sigmoid slope before it can move the output. The deeper fix is to change the weights feeding into this neuron from the previous layer, pulling its weighted sum back toward zero so sigmoid puts it on the steep part of the curve again where corrections can flow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Weighted Sum vs Each Weight">
        <p>
          Now we trace one step further back. The weighted sum is built by multiplying each
          input by its weight and adding everything up. Say humidity is 0.9 and its weight
          is 0.4 — that contributes 0.9 × 0.4 = 0.36 to the weighted sum. Temperature is
          0.2 and its weight is 0.6 — that contributes 0.2 × 0.6 = 0.12.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 3 asks: if the humidity weight nudged from 0.4 to 0.41, how much would the
          weighted sum change? The answer is exactly the humidity input — 0.9. That tiny
          +0.01 change to the weight gets multiplied by 0.9 on its way into the weighted
          sum. Now do the same for temperature: nudging its weight by +0.01 only changes
          the weighted sum by 0.2 — because temperature&apos;s input was 0.2, not 0.9. Humidity
          has the bigger lever arm, so changes to its weight have more impact.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This is why the correction isn&apos;t the same for every weight. The humidity weight
          contributed more to the weighted sum, which contributed more to the prediction,
          which contributed more to the mistake — so it gets the larger correction. The
          temperature weight had less influence end-to-end, so it gets a smaller nudge.
          The bias has no input at all, just a lever arm of 1, so it always gets the
          correction exactly as-is.
        </p>
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 3 is the only rate that&apos;s different for each weight. Because all inputs are normalized to the same 0-to-1 scale, comparing them directly tells you which weight had the most leverage over the weighted sum relative to the others — and therefore which weight deserves the biggest correction.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> Each weight gets nudged by an amount proportional to its input. The humidity weight (input 0.9) gets a bigger adjustment than the temperature weight (input 0.2) because nudging humidity&apos;s weight moves the weighted sum more. You can&apos;t fix the mistake equally across all weights — some had more say in the wrong answer than others, and the corrections reflect that exactly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Every Correction Happens Through Weights">
        <p style={{ padding: '0.6rem 0.8rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', color: '#1e40af', lineHeight: 1.65 }}>
          <strong>The only thing training ever changes is weights.</strong> That&apos;s it. The inputs are fixed measurements from the real world. The sigmoid function is fixed math. The loss formula is fixed. The only knobs the network has are the weights — and all three steps exist purely to figure out how to turn them. Step 1 says how urgently they need to move and in which direction. Step 2 says how effectively a change in any weight will actually reach the output right now — a stuck neuron means the knob is barely connected to anything. Step 3 says which weights are worth turning the most, because some are connected to stronger signals and have more pull over the outcome. Together the three steps produce a precise instruction for every single weight in the network: turn this one by this much, in this direction.
        </p>
      </ExplanationBox>


<ExplanationBox title="Every Weight Gets Its Own Gradient">
        <p>
          Multiply the three rates together and you have one weight&apos;s gradient — a single number
          encoding everything: how bad the mistake was, whether the neuron can receive a correction,
          and how much this specific weight was responsible for it. Steps 1 and 2 are identical for
          every weight in the same neuron. Step 3 is what makes each weight&apos;s gradient unique.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The result is a complete correction map for the entire network. Every weight gets a
          number. Every number has a size — how big a nudge it needs — and a sign — which
          direction to nudge it. Nothing is guessed. Nothing is the same for two different weights
          unless they genuinely had the same influence. The gradient is the network figuring out,
          mathematically and precisely, exactly who was responsible for the mistake and by how much.
        </p>
      </ExplanationBox>


    </div>
  );
}
