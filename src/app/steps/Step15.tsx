'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

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

const INPUT = [1.0, 0.5];   // temperature, humidity — picked so the network starts at ~70%
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

// What each neuron actually does in the network — the same roles shown in the
// earlier forward-pass diagrams — so a click explains the neuron, not just its math.
const H1_ROLE = [
  'This neuron learned to spot "humid but cool" weather — it leans negative on temperature (−0.3) and hard on humidity (0.9).',
  'This neuron fires when both readings are moderate-to-high — positive on temperature (0.5) and humidity (0.7).',
  'Another "humid and cooler" detector — negative on temperature (−0.4), strong on humidity (0.8).',
];
const H2_ROLE = [
  'This neuron combines the layer-1 patterns: it amplifies detectors 1 and 3 and pushes back on detector 2.',
  'This neuron responds strongly to layer-1 detector 2, while slightly damping detector 3.',
  'This neuron suppresses layer-1 detector 1 but amplifies detectors 2 and 3 — a different mix of the evidence.',
];

function nodeInfo(id: string, R: ReturnType<typeof runNetwork>): { title: string; description: string } {
  if (id === 'out') return {
    title: `Output — the final rain prediction (${R.PCT}%)`,
    description: `This is the network's answer neuron — its whole job is to combine evidence. Each of the three layer-2 neurons hands it one signal (a learned pattern that votes "this looks like rain" or "this doesn't"); the output multiplies each vote by its own weight (0.7, 0.5, 0.6), adds them up, and squashes the total into a 0–100% rain probability. We guessed ${R.PCT}% but it rained, so the gap is ${f3(R.DLDO)}. To correct it, we take that gap × the output's sensitivity right now (slope ${f2(R.NUM.out.slope)}) = blame ${f3(R.NUM.out.delta)}. The curve on the right shows where it's sitting and how steep it is there.`,
  };
  if (id.startsWith('h2')) {
    const i = +id.slice(3);
    return {
      title: `Hidden layer 2 · neuron ${i + 1} — a pattern combiner`,
      description: `${H2_ROLE[i]} During the backward pass, blame arrives from the output, shrunk by the wire's weight to ${f3(R.CONN_BLAME[`h2-${i}->out`])}, then scaled by this neuron's sensitivity (slope ${f2(R.NUM[id].slope)}) → blame ${f3(R.NUM[id].delta)}.`,
    };
  }
  if (id.startsWith('h1')) {
    const i = +id.slice(3);
    return {
      title: `Hidden layer 1 · neuron ${i + 1} — a feature detector`,
      description: `${H1_ROLE[i]} Reading the two raw inputs, it builds one simple feature for the deeper layers to combine. Going backward, all three layer-2 neurons feed blame into it; summed that's ${f3(R.SUM1[i])}, scaled by its sensitivity (slope ${f2(R.NUM[id].slope)}) → blame ${f3(R.NUM[id].delta)}. Notice it's far smaller than the output's blame — blame fades the further back it travels (the "vanishing gradient").`,
    };
  }
  const k = +id.slice(3);
  const which = id === 'in-0' ? 'temperature' : 'humidity';
  return {
    title: id === 'in-0' ? 'Temperature input' : 'Humidity input',
    description: `This is the raw ${which} reading fed into the network (${INPUT[k].toFixed(1)}) — a fixed measurement from the real world, so there's nothing here to train and it never gets blamed. But its value is the lever arm for every weight leaving it: the bigger the reading, the bigger the nudge those first-layer weights receive.`,
  };
}

function seg(from: string, to: string) {
  const [ax, ay] = POS[from], [bx, by] = POS[to];
  const ar = from === 'out' ? 22 : 18;
  const br = to === 'out' ? 22 : 18;
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

function BackpropNetwork() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned ?? 'out';

  const R = START;

  const litConns = traceTo(active);
  const litNodes = new Set<string>(['out', active]);
  litConns.forEach(k => { const [f, t] = k.split('->'); litNodes.add(f); litNodes.add(t); });

  const info = nodeInfo(active, R);
  // The little curve gets its own identity — a violet that is deliberately NOT the
  // blue/red used by the network nodes and the earlier diagrams.
  const curveColor = '#7c3aed';

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
        <text x={inputX} y={290} textAnchor="middle" fontSize={9} fill="#999">INPUTS</text>
        <text x={hidden1X} y={290} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 1</text>
        <text x={hidden2X} y={290} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 2</text>
        <text x={outputX} y={290} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
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
          {active.startsWith('in') ? (
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
          That guess was then passed into the <strong>loss</strong>: a single number for how far off
          we landed. It <em>squares</em> the gap — picture the area of a square whose side is how
          wrong we were — so a small miss barely costs anything while a big miss costs a lot. Right
          now that number is <strong>{f3(START.loss)}</strong>.
        </p>
        <p>
          Training has exactly one goal: make that number <strong>as small as possible</strong>. So
          the network looks at the loss it has <em>right now</em>, and backpropagation — this step —
          works out how to nudge every weight to reach a <strong>smaller loss</strong> next time.
          That &quot;which way shrinks the loss&quot; calculation is all backpropagation really is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch the Blame Flow Back">
        <p>
          Here is the whole network with the real numbers from this miss. We guessed {START.PCT}% but it
          rained, so the gap ({f3(START.DLDO)}) becomes the blame at the output. Going backward, each
          neuron multiplies the blame arriving from its right by its own <strong>slope</strong> (shown above
          each node) to get its own <strong>blame</strong> (shown inside).
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Click any node</strong> to light up the path the blame takes to reach it — just like the
          earlier network diagrams — and to see the little <strong>curve</strong> that node is sitting on, with
          its slope drawn in. Notice how the blame gets smaller the further back you go: that fading is the
          famous <strong>vanishing gradient</strong>.
        </p>
        <BackpropNetwork />
      </ExplanationBox>

      <ExplanationBox title="The Backward Pass in Code">
        <p>
          Every arrow you just traced is one line of the backward pass below. Each layer takes the
          blame coming from the layer to its right, sends it back through the weights, and scales it
          by that layer&apos;s own slope — the chain rule, applied one layer at a time.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="neural_network.py"
        caption="Backpropagation: take the error at the output and push it back through every layer to get each neuron's blame."
        code={`import numpy as np

# The same 2 -> 3 -> 3 -> 1 rain network from the diagram above.
# Backpropagation answers one question for every weight:
# "how much did YOU contribute to the error?"  That number is the gradient.

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# A handy fact: the slope of the sigmoid at output a is just a * (1 - a).
# We reuse the activations we already have from the forward pass.
def sigmoid_slope(a):
    return a * (1 - a)

# --- forward pass (kept from the earlier steps) ---
def forward(x, p):
    a1 = sigmoid(p["W1"] @ x + p["b1"])     # hidden layer 1 activations
    a2 = sigmoid(p["W2"] @ a1 + p["b2"])    # hidden layer 2 activations
    out = sigmoid(p["W3"] @ a2 + p["b3"])   # final rain probability
    return a1, a2, out

# --- backward pass: push the blame back, layer by layer ---
def backward(x, target, p):
    a1, a2, out = forward(x, p)

    # 1. Start at the end: how wrong were we?  (prediction - target)
    error = out - target

    # 2. Blame at the output = error * how sensitive the output is right now.
    delta_out = error * sigmoid_slope(out)

    # 3. Send that blame back through W3 into layer 2, then scale each
    #    neuron by its own slope. This is the chain rule, one layer at a time.
    delta2 = (p["W3"] * delta_out) * sigmoid_slope(a2)

    # 4. Same move again: the blame flows back through W2 into layer 1.
    delta1 = (p["W2"].T @ delta2) * sigmoid_slope(a1)

    # Each delta is the blame for that neuron. Notice delta1 comes out much
    # smaller than delta_out -- blame fades the further back it travels
    # (exactly the "vanishing gradient" you saw in the diagram).
    return delta_out, delta2, delta1`}
      />
    </div>
  );
}
