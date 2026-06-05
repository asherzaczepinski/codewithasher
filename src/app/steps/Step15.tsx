'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// Same network, coordinates and visual vocabulary as GradientFlowNetwork /
// InteractiveNetwork: 2 inputs → 3 hidden → 3 hidden → 1 output, plain circular
// nodes, blue inputs, red output, gray forward edges, #999 layer labels, info
// panel below. Click a node to light up the path the blame takes back to it
// (orange, exactly like the earlier visuals) AND to see the sigmoid curve that
// node is sitting on. The network is STATIC — fixed starting weights, so the
// numbers never change; this step is about *seeing* the blame flow, not training.
const inputX = 60, hidden1X = 180, hidden2X = 320, outputX = 460;
const inputY = [100, 200];
const hiddenY = [60, 150, 240];
const outputY = 150;

const POS: Record<string, [number, number]> = {
  'in-0': [inputX, inputY[0]], 'in-1': [inputX, inputY[1]],
  'h1-0': [hidden1X, hiddenY[0]], 'h1-1': [hidden1X, hiddenY[1]], 'h1-2': [hidden1X, hiddenY[2]],
  'h2-0': [hidden2X, hiddenY[0]], 'h2-1': [hidden2X, hiddenY[1]], 'h2-2': [hidden2X, hiddenY[2]],
  out: [outputX, outputY],
};

// Forward connections, keyed `${from}->${to}` (from = earlier layer).
const CONNECTIONS: { from: string; to: string }[] = [
  ...[0, 1].flatMap(i => [0, 1, 2].map(n => ({ from: `in-${i}`, to: `h1-${n}` }))),
  ...[0, 1, 2].flatMap(f => [0, 1, 2].map(t => ({ from: `h1-${f}`, to: `h2-${t}` }))),
  ...[0, 1, 2].map(n => ({ from: `h2-${n}`, to: 'out' })),
];

// --- the network: the SAME trained rain network the learner met in the Overview
// step (OverviewNetwork). Same weights, same inputs, same named neurons, so the
// numbers here line up with what they already explored. ---
type Weights = { W1: number[][]; B1: number[]; W2: number[][]; B2: number[]; W3: number[]; B3: number };
const INITIAL_WEIGHTS: Weights = {
  W1: [[-1, 5], [3, 3], [-4, 4]],          // Layer 2: Muggy Conditions, Warm & Wet, Cool Moisture
  B1: [-2, -4, -1],
  W2: [[3, 4, -1], [-2, -1, 4], [-3, -2, -3]], // Layer 3: Storm Signal, Drizzle, Clear & Dry
  B2: [-4, -2, 4],
  W3: [8, 5, -6],                          // Output: Rain Prediction
  B3: -2,
};

const INPUT = [0.7, 0.8];   // temperature, humidity — the Overview's example day
const TARGET = 1.0;          // it rained
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

  const CONN_BLAME: Record<string, number> = {};
  [0, 1, 2].forEach(i => { CONN_BLAME[`h2-${i}->out`] = D_OUT * w.W3[i]; });
  [0, 1, 2].forEach(i => [0, 1, 2].forEach(j => { CONN_BLAME[`h1-${i}->h2-${j}`] = D2[j] * w.W2[j][i]; }));
  [0, 1].forEach(k => [0, 1, 2].forEach(i => { CONN_BLAME[`in-${k}->h1-${i}`] = D1[i] * INPUT[k]; }));

  return { A1, A2, AO, DLDO, D_OUT, D2, SUM1, D1, NUM, CONN_BLAME, PCT: Math.round(AO * 100), loss: 0.5 * DLDO * DLDO };
}

// the (only) state, used in the prose and the diagram — the network never trains here
const START = runNetwork(INITIAL_WEIGHTS);

// formatting: drop the leading zero, use a real minus sign
const f3 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(3).replace(/^0\./, '.');
const f2 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace(/^0\./, '.');
const wInt = (x: number) => (x < 0 ? '−' : '') + Math.abs(x);   // whole-number weights, real minus
const fw = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);  // updated weight, keep the leading 0
const fsign = (x: number) => (x < 0 ? '−' : '+') + Math.abs(x).toFixed(3).replace(/^0\./, '.');  // signed adjustment
const pct = (a: number) => `${Math.round(a * 100)}%`;
const LR = 0.5;   // the learning rate used in the per-weight fixes below
// a distinct accent per weight-fix so each one reads as its own thing
const FIX_COLORS = ['#2563eb', '#7c3aed', '#db2777', '#d97706'];

// Every connection on a backward path from the output to the target node.
function traceTo(target: string): Set<string> {
  const s = new Set<string>();
  if (target === 'out') return s;            // the output itself has nothing upstream to light
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

const NODE_TYPE = (id: string): 'in' | 'h1' | 'h2' | 'out' =>
  id === 'out' ? 'out' : (id.slice(0, 2) as 'in' | 'h1' | 'h2');

const FILL: Record<string, string> = { in: '#dbeafe', h1: '#f3f4f6', h2: '#f3f4f6', out: '#fee2e2' };
const STROKE: Record<string, string> = { in: '#2563eb', h1: '#6b7280', h2: '#6b7280', out: '#dc2626' };

// The SAME named neurons the learner met in the Overview network — Layer 2 detects
// simple weather patterns from the raw inputs, Layer 3 combines them.
const H1_NAME = ['Muggy Conditions', 'Warm & Wet', 'Cool Moisture'];
const H1_SHORT = ['Muggy', 'Warm&Wet', 'Cool'];
const H1_ROLE = [
  'Detects high humidity regardless of temperature.',
  'Detects when it\'s both hot and humid at the same time.',
  'Detects high humidity combined with cooler temperatures.',
];
const H2_NAME = ['Storm Signal', 'Drizzle Detector', 'Clear & Dry'];
const H2_SHORT = ['Storm', 'Drizzle', 'Clear'];
const H2_ROLE = [
  'Fires when the Muggy Conditions and Warm & Wet patterns combine.',
  'Fires when Cool Moisture is present without tropical heat.',
  'Fires when none of the rain patterns are active — a dry-day signal.',
];

// The forward-pass weights feeding INTO a node — the number each incoming signal
// gets multiplied by before it's summed. Inputs have nothing feeding them.
function incomingWeights(id: string): { name: string; w: number }[] | null {
  if (id === 'out') return H2_NAME.map((name, j) => ({ name, w: INITIAL_WEIGHTS.W3[j] }));
  if (id.startsWith('h2')) { const i = +id.slice(3); return H1_NAME.map((name, j) => ({ name, w: INITIAL_WEIGHTS.W2[i][j] })); }
  if (id.startsWith('h1')) { const i = +id.slice(3); return [{ name: 'Temperature', w: INITIAL_WEIGHTS.W1[i][0] }, { name: 'Humidity', w: INITIAL_WEIGHTS.W1[i][1] }]; }
  return null;
}
function nodeBias(id: string): number | null {
  if (id === 'out') return INITIAL_WEIGHTS.B3;
  if (id.startsWith('h2')) return INITIAL_WEIGHTS.B2[+id.slice(3)];
  if (id.startsWith('h1')) return INITIAL_WEIGHTS.B1[+id.slice(3)];
  return null;
}

type InfoSection = { label: string; body?: string; grad?: number; accent?: string; steps?: { k: string; v: string }[] };

// Build one explained section per incoming weight, showing its actual update:
//   gradient = this neuron's blame × the signal that came in on the wire
//   new weight = old weight − learning rate × gradient
// The bias is included as "a weight whose input is always 1".
function fixSections(delta: number, ins: { name: string; signal: number; w: number }[], slope: number): InfoSection[] {
  const out: InfoSection[] = [{
    label: 'The fix — the rule',
    body: `Every weight feeding this neuron is corrected the same way. A weight's gradient is this neuron's blame multiplied by the signal that came in on its wire, and the change we actually apply is the learning rate times that gradient, stepped in the opposite direction so the loss goes down rather than up. A louder incoming signal makes a bigger gradient, so that weight moves more. The learning rate we use here is ${f2(LR)}.`,
  }];
  ins.forEach((it, j) => {
    const grad = delta * it.signal;
    const adj = -LR * grad;            // the actual change applied to this weight
    const neu = it.w + adj;
    out.push({
      label: `Fix · ${it.name} weight`,
      grad,
      accent: FIX_COLORS[j % FIX_COLORS.length],
      steps: [
        { k: 'First — the e payoff that got us here', v: `Before any of this, the blame had to travel back through this neuron, and that only worked because we scaled it by the neuron's sigmoid slope — which is simply output × (1 − output) = ${f2(slope)}, a clean number only because the sigmoid is built from e. That e tie-in is what lets the blame pass back this easily into the weights below.` },
        { k: 'The blame it carries', v: `This neuron already worked out its blame up above: ${f3(delta)}. Every single weight feeding the neuron shares that exact same blame — it is the slice of the final miss that this whole neuron is held responsible for.` },
        { k: 'The signal on this wire', v: `During the forward pass, ${it.name} sent its signal down this one wire at ${pct(it.signal)} strength. A weight only ever matters as much as the signal that actually flows through it, so this number is the other half of the story.` },
        { k: 'Multiplying them gives the gradient', v: `Now we multiply the blame by that signal, and what we get is this one weight's own gradient: ${f3(delta)} × ${f2(it.signal)} = ${f3(grad)}. That number is this weight's personal share of the blame — how much it, specifically, pushed the network toward the wrong answer.` },
        { k: 'Scaling it gives the adjustment', v: `We don't move the weight by the whole gradient at once — that would overshoot. We scale it down by the learning rate (${f2(LR)}) and step in the opposite direction, so the loss falls instead of climbs: minus (${f2(LR)} × ${f3(grad)}) gives an adjustment of ${fsign(adj)}.` },
        { k: 'The new weight', v: `Finally we add that adjustment onto the old weight, and it moves from ${wInt(it.w)} to ${fw(neu)} — nudged ${grad < 0 ? 'up' : 'down'}. Next time this same day comes through, this wire will push the answer a little closer to the truth.` },
      ],
    });
  });
  out.push({
    label: 'Fix · bias',
    body: `The bias trains in the very same way — it is really just a weight whose input is always 1. Read "One More Knob: the Bias Trains the Same Way" just below the diagram to see exactly how its adjustment works.`,
  });
  return out;
}

function nodeInfo(id: string, R: ReturnType<typeof runNetwork>): { title: string; sections: InfoSection[] } {
  if (id === 'out') {
    const ins = H2_NAME.map((name, j) => ({ name, signal: R.NUM[`h2-${j}`].a, w: INITIAL_WEIGHTS.W3[j] }));
    return {
      title: `Output · Rain Prediction — the final call (${R.PCT}%)`,
      sections: [
        { label: 'Its job', body: `This is where everything converges into one answer. The three Layer 3 neurons — Storm Signal, Drizzle Detector, and Clear & Dry — each hand it one signal; this neuron decides how much to trust each and blends them into a single overall confidence that it's going to rain.` },
        { label: 'Guess vs. reality', body: `It called ${R.PCT}% chance of rain. But it actually rained — the right answer was 100% — so it landed too low.` },
        { label: 'Its blame', body: `How far we can move it is set by its slope — how much its confidence still responds to a nudge (steep = flexible, flat = locked in). So its blame is the miss scaled by that slope: ${f3(R.DLDO)} × ${f2(R.NUM.out.slope)} = ${f3(R.NUM.out.delta)}.` },
        ...fixSections(R.NUM.out.delta, ins, R.NUM.out.slope),
      ],
    };
  }
  if (id.startsWith('h2')) {
    const i = +id.slice(3);
    const wire = INITIAL_WEIGHTS.W3[i];
    return {
      title: `Layer 3 · ${H2_NAME[i]} — a pattern combiner`,
      sections: [
        { label: 'Its job', body: `${H2_ROLE[i]} On this day it fired at ${pct(R.NUM[id].a)} confidence.` },
        { label: 'Where its blame comes from', body: `Trace it back one wire. The output's own blame is ${f3(R.NUM.out.delta)}. The single wire from here up to the output carries weight ${wInt(wire)}, so the blame that actually reaches this neuron is ${f3(R.NUM.out.delta)} × ${wInt(wire)} = ${f3(R.CONN_BLAME[`h2-${i}->out`])}.` },
        { label: 'Scaled by its slope', body: `A neuron can only act on blame as far as it can still move. So we scale that by its own slope (${f2(R.NUM[id].slope)} — read it off the curve below): ${f3(R.CONN_BLAME[`h2-${i}->out`])} × ${f2(R.NUM[id].slope)} = ${f3(R.NUM[id].delta)}. That ${f3(R.NUM[id].delta)} is this neuron's blame.` },
        ...fixSections(R.NUM[id].delta, H1_NAME.map((name, j) => ({ name, signal: R.NUM[`h1-${j}`].a, w: INITIAL_WEIGHTS.W2[i][j] })), R.NUM[id].slope),
      ],
    };
  }
  if (id.startsWith('h1')) {
    const i = +id.slice(3);
    const c0 = R.CONN_BLAME[`h1-${i}->h2-0`], c1 = R.CONN_BLAME[`h1-${i}->h2-1`], c2 = R.CONN_BLAME[`h1-${i}->h2-2`];
    return {
      title: `Layer 2 · ${H1_NAME[i]} — a feature detector`,
      sections: [
        { label: 'Its job', body: `${H1_ROLE[i]} Reading the two raw inputs, it builds one simple pattern for the deeper layer to combine. On this day it fired at ${pct(R.NUM[id].a)}.` },
        { label: 'Where its blame comes from', body: `This neuron feeds all three Layer-3 neurons, so blame flows back from all three at once — each through the wire between them: Storm Signal ${f3(c0)}, Drizzle ${f3(c1)}, Clear & Dry ${f3(c2)}. Add them up and the blame arriving here is ${f3(R.SUM1[i])}.` },
        { label: 'Scaled by its slope', body: `Then we scale by this neuron's own slope (${f2(R.NUM[id].slope)} — the curve below): ${f3(R.SUM1[i])} × ${f2(R.NUM[id].slope)} = ${f3(R.NUM[id].delta)}, its blame. Notice how much smaller that already is than the output's — blame fades the further back it travels (the "vanishing gradient").` },
        ...fixSections(R.NUM[id].delta, [
          { name: 'Temperature', signal: INPUT[0], w: INITIAL_WEIGHTS.W1[i][0] },
          { name: 'Humidity', signal: INPUT[1], w: INITIAL_WEIGHTS.W1[i][1] },
        ], R.NUM[id].slope),
      ],
    };
  }
  const k = +id.slice(3);
  const which = id === 'in-0' ? 'temperature' : 'humidity';
  return {
    title: id === 'in-0' ? 'Temperature input' : 'Humidity input',
    sections: [
      { label: 'What it is', body: `The raw ${which} reading fed into the network (${INPUT[k].toFixed(1)}) — a fixed measurement from the real world.` },
      { label: 'Its role in training', body: `There's nothing here to train, and it never gets blamed. But its value is the lever arm for every weight leaving it: the bigger the reading, the bigger the nudge those first-layer weights receive.` },
    ],
  };
}

function seg(from: string, to: string) {
  const [ax, ay] = POS[from], [bx, by] = POS[to];
  const ar = from === 'out' ? 22 : 18;
  const br = to === 'out' ? 22 : 18;
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  return { x1: ax + (dx / len) * ar, y1: ay + (dy / len) * ar, x2: bx - (dx / len) * br, y2: by - (dy / len) * br };
}

// z-axis range shared by the draggable payoff curve below.
const Z_MIN = -8, Z_MAX = 8;

// --- the bigger, draggable sigmoid from the "Remember e?" payoff. Same curve,
// its own violet accent (deliberately not the diagram's blue/red), with a live
// slope read-out so you can feel output × (1 − output) change as you drag. ---
const ACCENT = '#7c3aed';
const EGW = 320, EGH = 200, EPAD = 34;
const egx = (z: number) => EPAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (EGW - 2 * EPAD);
const egy = (a: number) => (EGH - EPAD) - a * (EGH - 2 * EPAD);
const E_SIG_PATH = (() => {
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 0.001; z += 0.15) pts.push(`${egx(z).toFixed(1)},${egy(sig(z)).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();

function SigmoidExplorer() {
  const [z, setZ] = useState(0.9);
  const a = sig(z);
  const s = a * (1 - a);                 // the slope: output × (1 − output)
  const px = egx(z), py = egy(a);
  const z0 = z - 3, z1 = z + 3;
  const t0 = egy(a + s * (z0 - z)), t1 = egy(a + s * (z1 - z));

  return (
    <div className="explorer">
      <svg viewBox={`0 0 ${EGW} ${EGH}`} className="explorer-svg">
        {/* axes + 0/0.5/1 guides */}
        <line x1={EPAD} y1={egy(0)} x2={EGW - EPAD} y2={egy(0)} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={egx(0)} y1={EPAD - 10} x2={egx(0)} y2={EGH - EPAD + 6} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={EPAD} y1={egy(1)} x2={EGW - EPAD} y2={egy(1)} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={EPAD} y1={egy(0.5)} x2={EGW - EPAD} y2={egy(0.5)} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
        <text x={EPAD - 6} y={egy(1) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">1</text>
        <text x={EPAD - 6} y={egy(0) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">0</text>
        <text x={EGW - EPAD} y={egy(0) + 16} textAnchor="end" fontSize={9} fill="#94a3b8">weighted sum →</text>
        {/* the sigmoid */}
        <path d={E_SIG_PATH} fill="none" stroke="#cbd5e1" strokeWidth={2.5} />
        {/* tangent — the slope at this point */}
        <line x1={egx(z0)} y1={t0} x2={egx(z1)} y2={t1} stroke={ACCENT} strokeWidth={2.5} strokeDasharray="5 4" />
        {/* guide drops to the axes */}
        <line x1={px} y1={py} x2={px} y2={egy(0)} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
        <line x1={px} y1={py} x2={egx(0)} y2={py} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
        {/* the point */}
        <circle cx={px} cy={py} r={6} fill={ACCENT} stroke="white" strokeWidth={2} />
      </svg>

      <input
        type="range" min={-8} max={8} step={0.1} value={z}
        onChange={e => setZ(parseFloat(e.target.value))}
        className="explorer-slider"
      />

      <div className="explorer-readout">
        <div className="rd"><span className="rd-label">output</span><span className="rd-val">{f2(a)}</span></div>
        <div className="rd-op">→ slope = {f2(a)} × (1 − {f2(a)}) =</div>
        <div className="rd"><span className="rd-label">slope</span><span className="rd-val accent">{f2(s)}</span></div>
      </div>

      <style jsx>{`
        .explorer {
          margin: 1.5rem 0 0;
          padding: 1.5rem;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 12px;
        }
        .explorer-svg {
          width: 100%;
          max-width: 360px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .explorer-slider {
          display: block;
          width: 100%;
          max-width: 360px;
          margin: 0.75rem auto 0;
          accent-color: ${ACCENT};
        }
        .explorer-readout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          font-size: 14px;
        }
        .rd {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 0.35rem 0.7rem;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 8px;
          line-height: 1.2;
        }
        .rd-label {
          font-size: 10px;
          color: #a78bda;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rd-val {
          font-weight: 700;
          color: #5b21b6;
          font-variant-numeric: tabular-nums;
        }
        .rd-val.accent { color: ${ACCENT}; }
        .rd-op {
          color: #6b7280;
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}

// --- a compact, static sigmoid showing exactly where the active node is sitting
// and how steep it is there — the slope every correction has to pass through. ---
const NGW = 300, NGH = 132, NPAD = 26;
const ngx = (z: number) => NPAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (NGW - 2 * NPAD);
const ngy = (a: number) => (NGH - NPAD) - a * (NGH - 2 * NPAD);
const N_SIG_PATH = (() => {
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 0.001; z += 0.2) pts.push(`${ngx(z).toFixed(1)},${ngy(sig(z)).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();

function NodeCurve({ z, a }: { z: number; a: number }) {
  const s = a * (1 - a);
  const color = '#7c3aed';
  const px = ngx(z), py = ngy(a);
  const z0 = z - 2.6, z1 = z + 2.6;
  const t0 = ngy(a + s * (z0 - z)), t1 = ngy(a + s * (z1 - z));
  return (
    <svg viewBox={`0 0 ${NGW} ${NGH}`} className="node-curve-svg">
      <line x1={NPAD} y1={ngy(0)} x2={NGW - NPAD} y2={ngy(0)} stroke="#cbd5e1" strokeWidth={1} />
      <line x1={ngx(0)} y1={NPAD - 8} x2={ngx(0)} y2={NGH - NPAD + 4} stroke="#e2e8f0" strokeWidth={1} />
      <text x={NGW - NPAD} y={ngy(0) + 13} textAnchor="end" fontSize={8} fill="#94a3b8">weighted sum →</text>
      <text x={ngx(0) + 4} y={NPAD - 2} fontSize={8} fill="#94a3b8">output</text>
      <path d={N_SIG_PATH} fill="none" stroke="#cbd5e1" strokeWidth={2} />
      {/* tangent = the slope we just used */}
      <line x1={ngx(z0)} y1={t0} x2={ngx(z1)} y2={t1} stroke={color} strokeWidth={2} strokeDasharray="4 3" />
      <line x1={px} y1={py} x2={px} y2={ngy(0)} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
      <line x1={px} y1={py} x2={ngx(0)} y2={py} stroke={color} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
      <circle cx={px} cy={py} r={4.5} fill={color} stroke="white" strokeWidth={1.5} />
      <text x={NGW / 2} y={NGH - 4} textAnchor="middle" fontSize={9} fill="#475569">
        slope here = {f2(a)} × (1 − {f2(a)}) = <tspan fontWeight="bold" fill={color}>{f2(s)}</tspan>
      </text>
    </svg>
  );
}

// --- a tiny gradient-descent picture for one weight: the loss bowl, the weight
// sitting on it, the tangent (its gradient — steeper = bigger gradient) and a
// short downhill arrow showing which way the adjustment rolls it. ---
const MGW = 210, MGH = 80, MGX = 14, MGTOP = 9, MGBOT = 15;
const MXR = 2.7, MYMAX = MXR * MXR;
const mgx = (x: number) => MGX + ((x + MXR) / (2 * MXR)) * (MGW - 2 * MGX);
const mgy = (y: number) => (MGH - MGBOT) - (y / MYMAX) * (MGH - MGTOP - MGBOT);
const BOWL_PATH = (() => {
  const p: string[] = [];
  for (let x = -MXR; x <= MXR + 1e-6; x += 0.18) p.push(`${mgx(x).toFixed(1)},${mgy(x * x).toFixed(1)}`);
  return 'M' + p.join(' L');
})();

function MiniGrad({ grad, color = '#16a34a' }: { grad: number; color?: string }) {
  const up = grad < 0;                       // weight will increase → minimum is to the right
  const stepDir = up ? 1 : -1;
  const mag = Math.min(2.0, 0.55 + Math.abs(grad) * 26);  // steeper tangent for a bigger gradient
  const xc = -stepDir * mag, yc = xc * xc;
  const xa = xc + stepDir * 0.65, ya = xa * xa;           // a short downhill step (direction, not exact size)
  const slope = 2 * xc, tl = 0.7;
  const tx0 = xc - tl, tx1 = xc + tl;
  const ty0 = yc + slope * (tx0 - xc), ty1 = yc + slope * (tx1 - xc);
  return (
    <svg viewBox={`0 0 ${MGW} ${MGH}`} className="mini-grad">
      <text x={MGX - 2} y={MGTOP + 4} fontSize={7} fill="#cbd5e1">loss</text>
      <text x={MGW / 2} y={MGH - 3} textAnchor="middle" fontSize={7} fill="#cbd5e1">this weight →</text>
      <path d={BOWL_PATH} fill="none" stroke="#cbd5e1" strokeWidth={1.5} />
      {/* tangent = the gradient (derivative) at this weight */}
      <line x1={mgx(tx0)} y1={mgy(ty0)} x2={mgx(tx1)} y2={mgy(ty1)} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" />
      {/* the downhill step */}
      <line x1={mgx(xc)} y1={mgy(yc)} x2={mgx(xa)} y2={mgy(ya)} stroke={color} strokeWidth={1.2} opacity={0.6} />
      <circle cx={mgx(xc)} cy={mgy(yc)} r={3.4} fill="white" stroke={color} strokeWidth={1.5} />
      <circle cx={mgx(xa)} cy={mgy(ya)} r={3.4} fill={color} />
    </svg>
  );
}

// --- the whole network learning by gradient descent, one click at a time. You
// can't poke individual weights here; you just press Step and watch every weight
// adjust, the activations shift, the prediction climb toward 100%, and the loss
// shrink. The weight-states are precomputed so Back/Reset are instant. ---
const GDN_LR = 0.6;
function trainStep(w: Weights): Weights {
  const R = runNetwork(w);
  return {
    W1: [0, 1, 2].map(i => [0, 1].map(k => w.W1[i][k] - GDN_LR * R.D1[i] * INPUT[k])),
    B1: [0, 1, 2].map(i => w.B1[i] - GDN_LR * R.D1[i]),
    W2: [0, 1, 2].map(i => [0, 1, 2].map(j => w.W2[i][j] - GDN_LR * R.D2[i] * R.A1[j])),
    B2: [0, 1, 2].map(i => w.B2[i] - GDN_LR * R.D2[i]),
    W3: [0, 1, 2].map(i => w.W3[i] - GDN_LR * R.D_OUT * R.A2[i]),
    B3: w.B3 - GDN_LR * R.D_OUT,
  };
}
const GDN_STATES: Weights[] = (() => {
  const arr: Weights[] = [INITIAL_WEIGHTS];
  for (let s = 0; s < 12; s++) arr.push(trainStep(arr[s]));
  return arr;
})();
const GDN_MAXLOSS = START.loss;   // the starting loss, for scaling the bar

function FullNetworkTrainer() {
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const maxStep = GDN_STATES.length - 1;
  const w = GDN_STATES[step];
  const R = runNetwork(w);

  const connW = (from: string, to: string) => {
    if (to === 'out') return w.W3[+from.slice(3)];
    if (to.startsWith('h2')) return w.W2[+to.slice(3)][+from.slice(3)];
    return w.W1[+to.slice(3)][+from.slice(3)];
  };
  const gFill = (v: number) => `rgba(34, 197, 94, ${(0.1 + v * 0.55).toFixed(2)})`;
  const related = (from: string, to: string) =>
    !!active && (active.startsWith('in') ? from === active : to === active);

  // a short, friendly blurb for the hovered/clicked neuron — name, what it's for,
  // and what its activation right now means. (Deliberately lighter than the big
  // click-to-explore panel up above.)
  const info = (() => {
    if (!active) return null;
    const fired = (a: number) => a > 0.66 ? 'firing strongly' : a > 0.33 ? 'partly on' : 'mostly quiet';
    if (active === 'out') return { name: 'Rain Prediction', desc: 'The final neuron — it blends the three Layer 3 signals into one rain probability.', fire: `Right now it predicts ${R.PCT}% chance of rain (target: 100%).` };
    if (active.startsWith('h2')) { const i = +active.slice(3); const a = R.NUM[active].a; return { name: H2_NAME[i], desc: H2_ROLE[i], fire: `Right now it is ${fired(a)} at ${pct(a)}.` }; }
    if (active.startsWith('h1')) { const i = +active.slice(3); const a = R.NUM[active].a; return { name: H1_NAME[i], desc: H1_ROLE[i], fire: `Right now it is ${fired(a)} at ${pct(a)}.` }; }
    const k = +active.slice(3);
    return { name: k === 0 ? 'Temperature input' : 'Humidity input', desc: `The raw ${k === 0 ? 'temperature' : 'humidity'} reading we feed in.`, fire: `Current value: ${INPUT[k].toFixed(1)}.` };
  })();

  const renderNode = (id: string) => {
    const [x, y] = POS[id];
    const type = NODE_TYPE(id);
    const r = type === 'out' ? 22 : 18;
    const v = type === 'in' ? INPUT[+id.slice(3)] : R.NUM[id].a;
    const inside = type === 'in' ? INPUT[+id.slice(3)].toFixed(1) : id === 'out' ? `${R.PCT}%` : v.toFixed(2);
    const name = type === 'in' ? (id === 'in-0' ? 'Temp' : 'Humid')
      : id === 'out' ? 'Rain' : type === 'h1' ? H1_SHORT[+id.slice(3)] : H2_SHORT[+id.slice(3)];
    const isActive = id === active;
    return (
      <g key={id} className="gdn-node"
        onMouseEnter={() => setHovered(id)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => setPinned(p => (p === id ? null : id))}>
        <circle cx={x} cy={y} r={r} fill={type === 'in' ? '#dbeafe' : gFill(v)}
          stroke={isActive ? '#0f172a' : id === 'out' ? '#16a34a' : '#475569'}
          strokeWidth={isActive ? 3 : id === 'out' ? 2.5 : 1.8}
          style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.35))' } : undefined} />
        <text x={x} y={y + 3} textAnchor="middle" fontSize={id === 'out' || type === 'in' ? 10 : 9}
          fontWeight="bold" fill="#1e293b">{inside}</text>
        <text x={x} y={y + r + 11} textAnchor="middle" fontSize={7.5} fill="#94a3b8">{name}</text>
      </g>
    );
  };

  return (
    <div className="gdn">
      <svg viewBox="0 0 540 300" className="gdn-svg">
        {CONNECTIONS.map(c => {
          const wt = connW(c.from, c.to);
          const { x1, y1, x2, y2 } = seg(c.from, c.to);
          const rel = related(c.from, c.to);
          return (
            <line key={`${c.from}->${c.to}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={wt < 0 ? '#dc2626' : '#2563eb'}
              strokeWidth={(rel ? 1 : 0) + 0.6 + Math.min(Math.abs(wt), 8) / 8 * 3}
              opacity={active ? (rel ? 0.95 : 0.16) : 0.85} />
          );
        })}
        {Object.keys(POS).map(renderNode)}
        <text x={inputX} y={296} textAnchor="middle" fontSize={9} fill="#999">INPUTS</text>
        <text x={hidden1X} y={296} textAnchor="middle" fontSize={9} fill="#999">LAYER 2</text>
        <text x={hidden2X} y={296} textAnchor="middle" fontSize={9} fill="#999">LAYER 3</text>
        <text x={outputX} y={296} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
      </svg>

      <div className="gdn-info">
        {info ? (
          <>
            <span className="gdn-info-name">{info.name}</span>
            <span className="gdn-info-desc">{info.desc}</span>
            <span className="gdn-info-fire">{info.fire}</span>
          </>
        ) : (
          <span className="gdn-info-ph">Hover or click any neuron to see what it&apos;s for and how hard it&apos;s firing.</span>
        )}
      </div>

      <div className="gdn-meters">
        <div className="gdn-meter">
          <span className="gdn-m-label">prediction</span>
          <span className="gdn-m-val">{R.PCT}%</span>
          <span className="gdn-m-sub">target 100% — it rained</span>
        </div>
        <div className="gdn-meter">
          <span className="gdn-m-label">loss</span>
          <span className="gdn-m-val">{f3(R.loss)}</span>
          <div className="gdn-bar"><div className="gdn-bar-fill" style={{ width: `${Math.min(100, (R.loss / GDN_MAXLOSS) * 100)}%` }} /></div>
        </div>
        <div className="gdn-meter">
          <span className="gdn-m-label">training step</span>
          <span className="gdn-m-val">{step}<span className="gdn-of"> / {maxStep}</span></span>
        </div>
      </div>

      <div className="gdn-legend">
        <span><i className="pos" /> positive weight</span>
        <span><i className="neg" /> negative weight</span>
        <span>thickness = strength · greener node = firing harder · hover a neuron for details</span>
      </div>

      <div className="gdn-controls">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>◀ Back</button>
        <button className="reset" onClick={() => setStep(0)} disabled={step === 0}>Reset</button>
        <button className="fwd" onClick={() => setStep(s => Math.min(maxStep, s + 1))} disabled={step === maxStep}>Step ▶</button>
      </div>

      <style jsx>{`
        .gdn { margin: 1.25rem 0 0; padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .gdn-svg { width: 100%; max-width: 540px; height: auto; display: block; margin: 0 auto; }
        .gdn-svg :global(.gdn-node) { cursor: pointer; }
        .gdn-info {
          margin-top: 0.85rem; padding: 0.75rem 1rem; background: white; border: 1px solid #e2e8f0;
          border-radius: 8px; min-height: 70px;
        }
        .gdn-info-name { display: block; font-weight: 700; color: #15803d; font-size: 15px; margin-bottom: 0.2rem; }
        .gdn-info-desc { display: block; font-size: 13px; color: #555; line-height: 1.5; }
        .gdn-info-fire { display: block; font-size: 13px; color: #334155; margin-top: 0.3rem; font-variant-numeric: tabular-nums; }
        .gdn-info-ph { color: #94a3b8; font-style: italic; font-size: 13px; }
        .gdn-meters { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.85rem; }
        .gdn-meter { flex: 1; min-width: 130px; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 0.6rem 0.75rem; }
        .gdn-m-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 700; }
        .gdn-m-val { display: block; font-size: 22px; font-weight: 800; color: #16a34a; font-variant-numeric: tabular-nums; line-height: 1.2; }
        .gdn-of { font-size: 14px; color: #cbd5e1; font-weight: 600; }
        .gdn-m-sub { display: block; font-size: 11px; color: #94a3b8; }
        .gdn-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin-top: 0.35rem; overflow: hidden; }
        .gdn-bar-fill { height: 100%; background: #f59e0b; border-radius: 3px; transition: width 0.2s; }
        .gdn-legend { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.75rem; font-size: 11px; color: #64748b; align-items: center; }
        .gdn-legend i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; margin-right: 3px; vertical-align: middle; }
        .gdn-legend i.pos { background: #2563eb; }
        .gdn-legend i.neg { background: #dc2626; }
        .gdn-controls { display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .gdn-controls button { font-size: 13px; font-weight: 600; padding: 0.4rem 0.9rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white; color: #334155; cursor: pointer; }
        .gdn-controls button.fwd { background: #16a34a; color: white; border-color: #16a34a; }
        .gdn-controls button:disabled { opacity: 0.4; cursor: default; }
        @media (max-width: 640px) { .gdn-svg { max-width: 100%; } }
      `}</style>
    </div>
  );
}

function BackpropNetwork() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned ?? 'out';

  const R = START;

  const litConns = traceTo(active);
  const litNodes = new Set<string>(['out', active]);
  litConns.forEach(k => { const [f, t] = k.split('->'); litNodes.add(f); litNodes.add(t); });

  const info = nodeInfo(active, R);
  const winc = incomingWeights(active);
  const wbias = nodeBias(active);

  const renderNode = (id: string) => {
    const [x, y] = POS[id];
    const type = NODE_TYPE(id);
    const r = type === 'out' ? 23 : 19;
    const lit = litNodes.has(id);
    const isActive = id === active;
    const num = R.NUM[id];
    const inside = type === 'in' ? INPUT[+id.slice(3)].toFixed(1)
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
          style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.5))' } : undefined} />
        <text x={x} y={id === 'out' ? y + 3 : y + 3} textAnchor="middle"
          fontSize={id === 'out' || type === 'in' ? 10 : 9}
          fontWeight="bold" fill="#333">{inside}</text>
        {/* the neuron's name, so this reads as the same network from the Overview */}
        {type !== 'in' && (
          <text x={x} y={y + r + 11} textAnchor="middle" fontSize={7.5} fill="#94a3b8">
            {id === 'out' ? 'Rain' : type === 'h1' ? H1_SHORT[+id.slice(3)] : H2_SHORT[+id.slice(3)]}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="trace-network">
      <svg viewBox="0 0 540 300" className="trace-svg">
        {/* connections (orange on the active trace) */}
        {CONNECTIONS.map(c => {
          const key = `${c.from}->${c.to}`;
          const lit = litConns.has(key);
          const { x1, y1, x2, y2 } = seg(c.from, c.to);
          return (
            <line key={key} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={lit ? '#ea580c' : '#d1d5db'} strokeWidth={lit ? 2.5 : 1} />
          );
        })}

        {/* nodes */}
        {Object.keys(POS).map(renderNode)}

        {/* layer labels */}
        <text x={inputX} y={296} textAnchor="middle" fontSize={9} fill="#999">INPUTS</text>
        <text x={hidden1X} y={296} textAnchor="middle" fontSize={9} fill="#999">LAYER 2</text>
        <text x={hidden2X} y={296} textAnchor="middle" fontSize={9} fill="#999">LAYER 3</text>
        <text x={outputX} y={296} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
      </svg>

      <div className="info-panel">
        <h4>{info.title}</h4>
        {winc && (
          <div className="weights-in">
            <span className="weights-in-label">Weights on the way in — what it multiplies each signal by</span>
            <div className="weights-in-rows">
              {winc.map(it => (
                <div className="wrow" key={it.name}>
                  <span className="wsrc">{it.name}</span>
                  <span className={`wval ${it.w < 0 ? 'neg' : 'pos'}`}>× {wInt(it.w)}</span>
                </div>
              ))}
              {wbias !== null && (
                <div className="wrow wbias">
                  <span className="wsrc">then add its bias</span>
                  <span className={`wval ${wbias < 0 ? 'neg' : 'pos'}`}>{wInt(wbias)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        {info.sections.map(s => (
          <div className={`info-section${s.label.startsWith('Fix') ? ' is-fix' : ''}`} key={s.label}
            style={s.accent ? { borderLeftColor: s.accent } : undefined}>
            <span className="info-section-label" style={s.accent ? { color: s.accent } : undefined}>{s.label}</span>
            {s.body && <p>{s.body}</p>}
            {s.steps && (
              <div className="fix-steps">
                {s.steps.map(st => (
                  <div className="fix-step" key={st.k}>
                    <span className="fix-step-k" style={s.accent ? { color: s.accent } : undefined}>{st.k}</span>
                    <span className="fix-step-v">{st.v}</span>
                  </div>
                ))}
              </div>
            )}
            {s.grad !== undefined && <MiniGrad grad={s.grad} color={s.accent} />}
          </div>
        ))}
        {!active.startsWith('in') && (
          <div className="node-curve">
            <NodeCurve z={R.NUM[active].z} a={R.NUM[active].a} />
            <p className="node-curve-cap">
              Where <strong>{info.title.split('·')[1]?.split('—')[0].trim() || 'this neuron'}</strong> is sitting on its sigmoid. The flatter the curve here, the less blame can pass back through it.
            </p>
          </div>
        )}
        <span className="hint">
          {pinned ? 'Pinned — click it again to unpin. ' : ''}Click any node to trace the blame back to it.
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
        .weights-in {
          margin-bottom: 0.85rem;
          padding: 0.6rem 0.75rem;
          background: #f8fafc;
          border: 1px solid #eef2f7;
          border-radius: 8px;
        }
        .weights-in-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 0.45rem;
        }
        .wrow {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 1rem;
          font-size: 13px;
          padding: 0.12rem 0;
        }
        .wsrc { color: #475569; }
        .wval {
          font-weight: 700;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .wval.pos { color: #16a34a; }
        .wval.neg { color: #dc2626; }
        .wbias {
          margin-top: 0.3rem;
          padding-top: 0.35rem;
          border-top: 1px dashed #e2e8f0;
        }
        .wbias .wsrc { font-style: italic; color: #94a3b8; }
        .info-section {
          margin-bottom: 0.7rem;
          padding-left: 0.6rem;
          border-left: 2px solid #fed7aa;
        }
        .info-section:last-of-type {
          margin-bottom: 0;
        }
        .info-section-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #ea580c;
          margin-bottom: 0.15rem;
        }
        .info-section.is-fix {
          border-left-color: #86efac;
        }
        .info-section.is-fix .info-section-label {
          color: #16a34a;
        }
        .info-section.is-fix p {
          font-variant-numeric: tabular-nums;
        }
        .fix-steps {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .fix-step {
          font-size: 13px;
          line-height: 1.5;
        }
        .fix-step-k {
          display: block;
          font-weight: 600;
          color: #15803d;
          font-size: 12px;
          margin-bottom: 0.05rem;
        }
        .fix-step-v {
          display: block;
          color: #555;
        }
        .info-section :global(.mini-grad) {
          width: 100%;
          max-width: 200px;
          height: auto;
          display: block;
          margin: 0.4rem 0 0.1rem;
        }
        .node-curve {
          margin-top: 0.9rem;
          padding-top: 0.9rem;
          border-top: 1px solid #eef2f7;
          text-align: center;
        }
        .node-curve :global(.node-curve-svg) {
          width: 100%;
          max-width: 300px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .node-curve-cap {
          margin: 0.4rem auto 0;
          max-width: 320px;
          font-size: 12px;
          color: #94a3b8;
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
          Our network predicted {START.PCT}% chance of rain. It actually rained. The correct answer was 100%. We were off.
        </p>
        <p>
          We computed the loss — a number that tells us how wrong we were. But that number alone
          doesn&apos;t tell us what to do about it. We have a whole network full of weights that all
          contributed to this wrong answer. Which ones do we change? By how much? In which direction?
        </p>
        <p>
          The answer is <strong>backpropagation</strong>: start at the output and push the blame
          backward through the network, one layer at a time, until every weight knows exactly how
          much it was responsible for the mistake. This step shows you that flow in action.
        </p>
      </ExplanationBox>

      <ExplanationBox title="First, a Quick Recap: The Loss">
        <p>
          Backpropagation builds straight on the <strong>loss</strong> from the last step, so here it
          is in one breath. The whole network ran <strong>forward</strong> — the inputs went in, and
          each layer handed its result to the next — until the output neuron produced our guess
          ({START.PCT}%).
        </p>
        <p>
          Training has exactly one goal: make that number <strong>as small as possible</strong>. So
          the network looks at the loss it has <em>right now</em>, and backpropagation — this step —
          works out how to nudge every weight to reach a <strong>smaller loss</strong> next time.
          That &quot;which way shrinks the loss&quot; calculation is all backpropagation really is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Remember e? This Is the Payoff">
        <p>
          Before we watch the blame flow, the one tool the whole thing runs on. Way back when we
          built the sigmoid, we squashed every signal with the number <strong>e ≈ 2.718</strong> and
          promised it would quietly pay off once we reached training. This is that moment: to send a
          correction backward, every neuron needs exactly one thing — how much its output moves when
          its weighted sum nudges, the <em>slope of its own sigmoid</em>.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Because the sigmoid is built from <strong>e</strong>, that slope collapses into something
          beautifully simple: <strong>output × (1 − output)</strong>. No exponents left to evaluate —
          the neuron already knows its own output, so it already knows its own slope. Our output
          neuron sits at {f2(START.AO)}, so its slope is just {f2(START.AO)} × (1 − {f2(START.AO)}) ={' '}
          <strong>{f2(START.NUM.out.slope)}</strong> — exactly the number you&apos;ll see above it in
          the diagram below. Drag the dot to feel it: the slope is steepest in the middle (output ≈ .5)
          and flattens toward 0 and 1, where almost no correction can pass through — a neuron
          that&apos;s hard to teach.
        </p>
        <SigmoidExplorer />
      </ExplanationBox>

      <ExplanationBox title="Watch the Blame Flow Back">
        <p>
          Here is the whole network with the real numbers from this miss. We guessed {START.PCT}% but it
          rained, so the gap ({f3(START.DLDO)}) becomes the blame at the output. Going backward, each
          neuron multiplies the blame arriving from its right by its own <strong>slope</strong> (shown above
          each node) to get its own <strong>blame</strong> (shown inside).
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          Why multiply by the wire&apos;s weight on the way back? Because <strong>blame should match
          influence</strong>. On the way forward, a neuron swayed the final answer in proportion to how
          strongly it fired <em>and</em> how heavy the weight carrying its signal was — a confident
          neuron on a fat weight moved the output a lot. So the correction travels back through that{' '}
          <em>same</em> wire: the more a neuron pushed the result, the bigger the share of the miss it
          owns, and the harder its weights get nudged. A neuron whose signal barely reached the output
          gets barely any blame — it wasn&apos;t really responsible, so we leave it mostly alone.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Click any node</strong> to light up the path the blame takes to reach it — just like the
          earlier network diagrams — and read its full breakdown below the network. Notice how the blame
          gets smaller the further back you go: that fading is the famous <strong>vanishing gradient</strong>.
        </p>
        <BackpropNetwork />
      </ExplanationBox>

      <ExplanationBox title="One More Knob: the Bias Trains the Same Way">
        <p>
          Backprop just handed a correction to every <strong>weight</strong> — but each neuron also
          carries a <strong>bias</strong>. Does it need a special rule of its own? No. A bias is simply
          a weight whose input is permanently stuck at <strong>1</strong>, so the very same update
          applies: every knob moves by <strong>blame × its input</strong>.
        </p>
        <MathFormula label="Weight update">
          weight ← weight − learning rate × (blame × input)
        </MathFormula>
        <MathFormula label="Bias update">
          bias ← bias − learning rate × (blame × 1)
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          A weight is scaled by its input; the bias, multiplying by 1, simply takes the neuron&apos;s
          full, undiluted blame. The direction falls straight out of the sign of (prediction − target):
          guess too low on a rainy day and the bias drifts <strong>up</strong> so the neuron fires more
          readily next time; guess too high and it drifts <strong>down</strong>. That division of labor
          is the whole point — <strong>weights</strong> decide how much to listen to each input, while
          the <strong>bias</strong> sets how eager the neuron is to fire before any input even arrives.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting It Together: That's Gradient Descent">
        <p>
          Step back and look at the whole loop we just walked through. The network ran{' '}
          <strong>forward</strong> and guessed {START.PCT}%. We measured how wrong that was with the{' '}
          <strong>loss</strong>. Then we pushed the <strong>blame</strong>{' '}backward — the output&apos;s
          miss became its blame, and every neuron took its share by multiplying the blame coming from
          its right by its own <strong>slope</strong>. Finally each weight turned its neuron&apos;s
          blame into a <strong>gradient</strong> (blame × the signal that fed it) and stepped a little{' '}
          <em>against</em> it.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So here it is — the <strong>whole network</strong> doing exactly that, all at once. Press{' '}
          <strong>Step</strong> and watch every weight adjust together: the wires recolor and rethicken
          as their weights change, the neurons fire differently, the <strong>prediction climbs toward
          100%</strong>, and the <strong>loss shrinks</strong>. Step forward and back as much as you
          like — that rolling-downhill loop, repeated over thousands of examples, is all gradient
          descent really is.
        </p>
        <FullNetworkTrainer />
      </ExplanationBox>

    </div>
  );
}
