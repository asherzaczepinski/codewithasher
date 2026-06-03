'use client';

import { useState, useMemo } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Same network, coordinates and visual vocabulary as GradientFlowNetwork /
// InteractiveNetwork: 2 inputs → 3 hidden → 3 hidden → 1 output, plain circular
// nodes, blue inputs, red output, gray forward edges, #999 layer labels, info
// panel below. Click a node to light up the path the blame takes back to it
// (orange, exactly like the earlier visuals) AND to see the sigmoid curve that
// node is sitting on. You can also train the network one step at a time and
// watch the prediction creep up toward the right answer (100%).
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

// --- the network (same starting weights as InteractiveNetwork) ---
type Weights = { W1: number[][]; B1: number[]; W2: number[][]; B2: number[]; W3: number[]; B3: number };
const INITIAL_WEIGHTS: Weights = {
  W1: [[-0.3, 0.9], [0.5, 0.7], [-0.4, 0.8]],
  B1: [0.1, -0.2, 0.15],
  W2: [[0.6, -0.3, 0.5], [0.4, 0.7, -0.2], [-0.5, 0.6, 0.8]],
  B2: [-0.1, 0.2, -0.15],
  W3: [0.7, 0.5, 0.6],
  B3: -0.2,
};
const clone = (w: Weights): Weights => ({
  W1: w.W1.map(r => [...r]), B1: [...w.B1],
  W2: w.W2.map(r => [...r]), B2: [...w.B2],
  W3: [...w.W3], B3: w.B3,
});

const INPUT = [1.0, 0.5];   // temperature, humidity — picked so the network starts at ~70%
const TARGET = 1.0;          // it rained
const LR = 2.0;              // learning rate for the step button
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const slope = (a: number) => a * (1 - a);   // sigmoid derivative, written via the activation

// One full forward + backward pass for a given set of weights.
function runNetwork(w: Weights) {
  const Z1 = [0, 1, 2].map(i => INPUT[0] * w.W1[i][0] + INPUT[1] * w.W1[i][1] + w.B1[i]);
  const A1 = Z1.map(sig);
  const Z2 = [0, 1, 2].map(i => A1[0] * w.W2[i][0] + A1[1] * w.W2[i][1] + A1[2] * w.W2[i][2] + w.B2[i]);
  const A2 = Z2.map(sig);
  const ZO = A2[0] * w.W3[0] + A2[1] * w.W3[1] + A2[2] * w.W3[2] + w.B3;
  const AO = sig(ZO);

  const DLDO = AO - TARGET;            // how wrong we are: prediction − target
  const D_OUT = DLDO * slope(AO);      // blame at the output
  const D2 = [0, 1, 2].map(i => (D_OUT * w.W3[i]) * slope(A2[i]));
  const SUM1 = [0, 1, 2].map(i => [0, 1, 2].reduce((s, j) => s + D2[j] * w.W2[j][i], 0));
  const D1 = [0, 1, 2].map(i => SUM1[i] * slope(A1[i]));

  const NUM: Record<string, { slope: number; delta: number; z: number; a: number }> = {
    out: { slope: slope(AO), delta: D_OUT, z: ZO, a: AO },
    'h2-0': { slope: slope(A2[0]), delta: D2[0], z: Z2[0], a: A2[0] },
    'h2-1': { slope: slope(A2[1]), delta: D2[1], z: Z2[1], a: A2[1] },
    'h2-2': { slope: slope(A2[2]), delta: D2[2], z: Z2[2], a: A2[2] },
    'h1-0': { slope: slope(A1[0]), delta: D1[0], z: Z1[0], a: A1[0] },
    'h1-1': { slope: slope(A1[1]), delta: D1[1], z: Z1[1], a: A1[1] },
    'h1-2': { slope: slope(A1[2]), delta: D1[2], z: Z1[2], a: A1[2] },
  };

  const CONN_BLAME: Record<string, number> = { 'out->loss': DLDO };
  [0, 1, 2].forEach(i => { CONN_BLAME[`h2-${i}->out`] = D_OUT * w.W3[i]; });
  [0, 1, 2].forEach(i => [0, 1, 2].forEach(j => { CONN_BLAME[`h1-${i}->h2-${j}`] = D2[j] * w.W2[j][i]; }));
  [0, 1].forEach(k => [0, 1, 2].forEach(i => { CONN_BLAME[`in-${k}->h1-${i}`] = D1[i] * INPUT[k]; }));

  return { A1, A2, AO, DLDO, D_OUT, D2, SUM1, D1, NUM, CONN_BLAME, PCT: Math.round(AO * 100), loss: 0.5 * DLDO * DLDO };
}

// One gradient-descent step: nudge every weight by −learningRate × its gradient.
function trainStep(w: Weights): Weights {
  const r = runNetwork(w);
  const gW3 = [0, 1, 2].map(i => r.D_OUT * r.A2[i]);
  const gW2 = [0, 1, 2].map(i => [0, 1, 2].map(j => r.D2[i] * r.A1[j]));
  const gW1 = [0, 1, 2].map(i => [0, 1].map(k => r.D1[i] * INPUT[k]));
  return {
    W1: w.W1.map((row, i) => row.map((v, k) => v - LR * gW1[i][k])),
    B1: w.B1.map((v, i) => v - LR * r.D1[i]),
    W2: w.W2.map((row, i) => row.map((v, j) => v - LR * gW2[i][j])),
    B2: w.B2.map((v, i) => v - LR * r.D2[i]),
    W3: w.W3.map((v, i) => v - LR * gW3[i]),
    B3: w.B3 - LR * r.D_OUT,
  };
}

// the starting state, used in the prose so it reads the same no matter how far you train
const START = runNetwork(INITIAL_WEIGHTS);

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

function nodeInfo(id: string, R: ReturnType<typeof runNetwork>): { title: string; description: string } {
  if (id === 'loss') return {
    title: 'Loss — where the fixing starts',
    description: `We guessed ${R.PCT}%, but it actually rained (the right answer was 100%). The gap between our guess and the truth is ${f3(R.DLDO)}. That gap is the "blame," and it flows backward from here into the whole network.`,
  };
  if (id === 'out') return {
    title: `Output — our guess: ${R.PCT}%`,
    description: `To decide how hard to nudge this neuron, we take the gap (${f3(R.DLDO)}) and multiply by how sensitive the neuron is right now — its slope, ${f2(R.NUM.out.slope)}. That gives this neuron's blame: ${f3(R.NUM.out.delta)}. The curve on the right shows exactly where it's sitting and how steep it is there.`,
  };
  if (id.startsWith('h2')) {
    const i = +id.slice(3);
    return {
      title: `Hidden layer 2 · neuron ${i + 1}`,
      description: `Blame arrives from the output and gets shrunk by the weight on the wire between them, leaving ${f3(R.CONN_BLAME[`h2-${i}->out`])}. We then scale that by this neuron's own sensitivity (slope ${f2(R.NUM[id].slope)}) to get its blame: ${f3(R.NUM[id].delta)}.`,
    };
  }
  if (id.startsWith('h1')) {
    const i = +id.slice(3);
    return {
      title: `Hidden layer 1 · neuron ${i + 1}`,
      description: `Three wires feed blame back into this neuron; we add them up (${f3(R.SUM1[i])}) and scale by its sensitivity (slope ${f2(R.NUM[id].slope)}), giving blame ${f3(R.NUM[id].delta)}. Notice how much smaller this is than the output's blame — blame fades the further back it travels (the "vanishing gradient").`,
    };
  }
  const k = +id.slice(3);
  return {
    title: id === 'in-0' ? 'Temperature input' : 'Humidity input',
    description: `This is a fixed measurement (${INPUT[k].toFixed(1)}) — there's nothing here to adjust, so inputs never get blamed. But this value decides how hard the wires leaving it get pushed: a bigger input means a bigger nudge to its weights.`,
  };
}

function seg(from: string, to: string) {
  const [ax, ay] = POS[from], [bx, by] = POS[to];
  const ar = from === 'out' ? 22 : from === 'loss' ? 20 : 18;
  const br = to === 'out' ? 22 : to === 'loss' ? 20 : 18;
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  return { x1: ax + (dx / len) * ar, y1: ay + (dy / len) * ar, x2: bx - (dx / len) * br, y2: by - (dy / len) * br };
}

// --- the little sigmoid curve that shows where a node is sitting + how steep it is ---
const GW = 240, GH = 150, GPAD = 26;
const Z_MIN = -8, Z_MAX = 8;
const gx = (z: number) => GPAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (GW - 2 * GPAD);
const gy = (a: number) => (GH - GPAD) - a * (GH - 2 * GPAD);
const SIG_PATH = (() => {
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 0.001; z += 0.2) pts.push(`${gx(z).toFixed(1)},${gy(sig(z)).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();

function SigmoidGraph({ z, a, color }: { z: number; a: number; color: string }) {
  const s = a * (1 - a);                  // slope of the sigmoid at this point (in z)
  const px = gx(z), py = gy(a);
  // tangent line over a small z-window, drawn through (z, a) with slope s
  const z0 = z - 2.4, z1 = z + 2.4;
  const t0 = gy(a + s * (z0 - z)), t1 = gy(a + s * (z1 - z));
  return (
    <svg viewBox={`0 0 ${GW} ${GH}`} className="curve-svg">
      {/* axes */}
      <line x1={GPAD} y1={gy(0)} x2={GW - GPAD} y2={gy(0)} stroke="#cbd5e1" strokeWidth={1} />
      <line x1={gx(0)} y1={GPAD - 8} x2={gx(0)} y2={GH - GPAD + 4} stroke="#e2e8f0" strokeWidth={1} />
      <text x={GW - GPAD} y={gy(0) + 14} textAnchor="end" fontSize={8} fill="#94a3b8">weighted sum →</text>
      <text x={gx(0) + 4} y={GPAD - 2} fontSize={8} fill="#94a3b8">output</text>
      {/* the sigmoid */}
      <path d={SIG_PATH} fill="none" stroke="#cbd5e1" strokeWidth={2} />
      {/* tangent = the slope we're using */}
      <line x1={gx(z0)} y1={t0} x2={gx(z1)} y2={t1} stroke={color} strokeWidth={2} strokeDasharray="4 3" />
      {/* guide lines to the axes */}
      <line x1={px} y1={py} x2={px} y2={gy(0)} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
      <line x1={px} y1={py} x2={gx(0)} y2={py} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
      {/* the node's current point */}
      <circle cx={px} cy={py} r={4.5} fill={color} stroke="white" strokeWidth={1.5} />
      <text x={GW / 2} y={GH - 4} textAnchor="middle" fontSize={9} fill="#475569">
        slope here = {f2(a)} × (1 − {f2(a)}) = <tspan fontWeight="bold" fill={color}>{f2(s)}</tspan>
      </text>
    </svg>
  );
}

function LossGraph({ pred, color }: { pred: number; color: string }) {
  // loss(p) = ½(p − 1)², p in [0,1]. point at current prediction, slope = (p − 1)
  const lx = (p: number) => GPAD + p * (GW - 2 * GPAD);
  const maxL = 0.5;
  const ly = (l: number) => (GH - GPAD) - (l / maxL) * (GH - 2 * GPAD);
  const loss = (p: number) => 0.5 * (p - 1) * (p - 1);
  const pts: string[] = [];
  for (let p = 0; p <= 1.001; p += 0.02) pts.push(`${lx(p).toFixed(1)},${ly(loss(p)).toFixed(1)}`);
  const s = pred - 1;                       // slope of the loss at the current prediction
  const px = lx(pred), py = ly(loss(pred));
  const p0 = Math.max(0, pred - 0.28), p1 = Math.min(1, pred + 0.28);
  return (
    <svg viewBox={`0 0 ${GW} ${GH}`} className="curve-svg">
      <line x1={GPAD} y1={ly(0)} x2={GW - GPAD} y2={ly(0)} stroke="#cbd5e1" strokeWidth={1} />
      <text x={GW - GPAD} y={ly(0) + 14} textAnchor="end" fontSize={8} fill="#94a3b8">prediction →</text>
      <text x={GPAD} y={GPAD - 2} fontSize={8} fill="#94a3b8">loss</text>
      <path d={'M' + pts.join(' L')} fill="none" stroke="#cbd5e1" strokeWidth={2} />
      <line x1={lx(p0)} y1={ly(loss(pred) + s * (p0 - pred))} x2={lx(p1)} y2={ly(loss(pred) + s * (p1 - pred))}
        stroke={color} strokeWidth={2} strokeDasharray="4 3" />
      <line x1={px} y1={py} x2={px} y2={ly(0)} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
      <circle cx={px} cy={py} r={4.5} fill={color} stroke="white" strokeWidth={1.5} />
      <text x={GW / 2} y={GH - 4} textAnchor="middle" fontSize={9} fill="#475569">
        downhill direction = pred − target = <tspan fontWeight="bold" fill={color}>{f3(s)}</tspan>
      </text>
    </svg>
  );
}

function BackpropNetwork() {
  const [weights, setWeights] = useState<Weights>(() => clone(INITIAL_WEIGHTS));
  const [epoch, setEpoch] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned ?? 'out';

  const R = useMemo(() => runNetwork(weights), [weights]);

  const litConns = traceTo(active);
  const litNodes = new Set<string>(['loss', 'out', active]);
  litConns.forEach(k => { const [f, t] = k.split('->'); litNodes.add(f); litNodes.add(t); });

  const info = nodeInfo(active, R);
  // The little curve gets its own identity — a violet that is deliberately NOT the
  // blue/red used by the network nodes and the earlier diagrams.
  const curveColor = '#7c3aed';

  const step = (n: number) => { let w = weights; for (let i = 0; i < n; i++) w = trainStep(w); setWeights(w); setEpoch(e => e + n); };
  const reset = () => { setWeights(clone(INITIAL_WEIGHTS)); setEpoch(0); };

  const renderNode = (id: string) => {
    const [x, y] = POS[id];
    const type = NODE_TYPE(id);
    const r = type === 'out' ? 23 : type === 'loss' ? 21 : 19;
    const lit = litNodes.has(id);
    const isActive = id === active;
    const num = R.NUM[id];
    const inside = type === 'in' ? INPUT[+id.slice(3)].toFixed(1)
      : type === 'loss' ? 'Loss'
      : id === 'out' ? `${R.PCT}%`
      : f3(num.delta);
    return (
      <g key={id} className="node"
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setPinned(p => (p === id ? null : id))}>
        {/* derivative (sigmoid slope) above each neuron; name above each input */}
        {num && (
          <text x={x} y={y - r - 5} textAnchor="middle" fontSize={8} fill="#64748b">slope {f2(num.slope)}</text>
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
        {/* the output also shows its own blame on a second line */}
        {id === 'out' && (
          <text x={x} y={y + 12} textAnchor="middle" fontSize={8} fontWeight="bold" fill="#c2410c">blame {f3(num.delta)}</text>
        )}
      </g>
    );
  };

  const pct = R.PCT;
  return (
    <div className="trace-network">
      {/* training controls */}
      <div className="trainer">
        <div className="readout">
          <span className="step-count">Step {epoch}</span>
          <span>guess <strong style={{ color: '#c2410c' }}>{pct}%</strong></span>
          <span>target <strong style={{ color: '#16a34a' }}>100%</strong></span>
          <span>loss <strong>{f3(R.loss)}</strong></span>
        </div>
        <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }} /><div className="bar-target" /></div>
        <div className="buttons">
          <button className="primary" onClick={() => step(1)}>Train one step ▸</button>
          <button onClick={() => step(10)}>+10 steps</button>
          <button className="ghost" onClick={reset} disabled={epoch === 0}>Reset</button>
        </div>
      </div>

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
                  fontSize={8} fontWeight="bold" fill="#ea580c">{f3(R.CONN_BLAME[key])}</text>
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

      <div className="panel-row">
        <div className="info-panel">
          <h4>{info.title}</h4>
          <p>{info.description}</p>
          <span className="hint">
            {pinned ? 'Pinned — click it again to unpin. ' : ''}Click any node to trace the blame back to it and see its curve.
          </span>
        </div>
        <div className="curve-box">
          {active === 'loss' ? (
            <LossGraph pred={R.AO} color={curveColor} />
          ) : active.startsWith('in') ? (
            <div className="no-curve">Inputs are fixed measurements — they don&apos;t sit on a sigmoid, so there&apos;s no curve to adjust.</div>
          ) : (
            <SigmoidGraph z={R.NUM[active].z} a={R.NUM[active].a} color={curveColor} />
          )}
        </div>
      </div>

      <style jsx>{`
        .trace-network {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .trainer {
          margin-bottom: 1.25rem;
          padding: 0.9rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }
        .readout {
          display: flex;
          gap: 1.1rem;
          flex-wrap: wrap;
          font-size: 13px;
          color: #555;
          align-items: center;
        }
        .readout .step-count {
          font-weight: bold;
          color: #1e293b;
          background: #f1f5f9;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
        }
        .bar {
          position: relative;
          height: 8px;
          background: #e2e8f0;
          border-radius: 999px;
          margin: 0.7rem 0;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #fb923c, #ea580c);
          border-radius: 999px;
          transition: width 0.25s ease;
        }
        .bar-target {
          position: absolute;
          top: -2px;
          right: 0;
          width: 2px;
          height: 12px;
          background: #16a34a;
        }
        .buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .buttons button {
          font-size: 13px;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: white;
          color: #334155;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .buttons button:hover { background: #f1f5f9; }
        .buttons .primary {
          background: #ea580c;
          border-color: #ea580c;
          color: white;
          font-weight: 600;
        }
        .buttons .primary:hover { background: #c2410c; }
        .buttons .ghost { color: #94a3b8; }
        .buttons button:disabled { opacity: 0.5; cursor: default; }
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
        .panel-row {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          align-items: stretch;
        }
        .info-panel {
          flex: 1 1 60%;
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
        .curve-box {
          flex: 1 1 40%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          min-width: 200px;
        }
        .curve-box :global(.curve-svg) {
          width: 100%;
          max-width: 260px;
          height: auto;
        }
        .no-curve {
          font-size: 12px;
          color: #94a3b8;
          text-align: center;
          font-style: italic;
          padding: 0 0.5rem;
        }
        @media (max-width: 640px) {
          .trace-svg { max-width: 100%; }
          .panel-row { flex-direction: column; }
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
          Our network predicted {START.PCT}% chance of rain. It actually rained. The correct answer was 100%. We were off.
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

      <ExplanationBox title="Watch the Blame Flow Back — Then Train It">
        <p>
          Here is the whole network with the real numbers from this miss. We guessed {START.PCT}% but it
          rained, so the loss sends the gap ({f3(START.DLDO)}) backward into the output. Going backward, each
          neuron multiplies the blame arriving from its right by its own <strong>slope</strong> (shown above
          each node) to get its own <strong>blame</strong> (shown inside).
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Click any node</strong> to light up the path the blame takes to reach it — just like the
          earlier network diagrams — and to see the little <strong>curve</strong> that node is sitting on, with
          its slope drawn in. Then hit <strong>“Train one step”</strong> and watch the prediction climb toward 100%:
          every click nudges every weight a little, and you&apos;ll see the dot slide along its curve as the
          network learns.
        </p>
        <BackpropNetwork />
      </ExplanationBox>

      <ExplanationBox title="Every Correction Happens Through Weights">
        <p style={{ padding: '0.6rem 0.8rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', color: '#1e40af', lineHeight: 1.65 }}>
          <strong>The only thing training ever changes is weights.</strong> That&apos;s it. The inputs are fixed measurements from the real world. The sigmoid function is fixed math. The loss formula is fixed. The only knobs the network has are the weights — and the whole backward pass exists purely to figure out how to turn them. One piece says how urgently they need to move and in which direction. Another says how effectively a change in any weight will actually reach the output right now — a stuck neuron means the knob is barely connected to anything. A third says which weights are worth turning the most, because some are connected to stronger signals and have more pull over the outcome. Together they produce a precise instruction for every single weight in the network: turn this one by this much, in this direction.
        </p>
      </ExplanationBox>


      <ExplanationBox title="Every Weight Gets Its Own Gradient">
        <p>
          Multiply those three pieces together and you have one weight&apos;s gradient — a single number
          encoding everything: how bad the mistake was, whether the neuron can receive a correction,
          and how much this specific weight was responsible for it. The first two are identical for
          every weight in the same neuron. The last — how much signal this particular weight carried —
          is what makes each weight&apos;s gradient unique.
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
