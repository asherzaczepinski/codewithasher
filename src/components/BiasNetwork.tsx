'use client';

import { useState, useMemo } from 'react';

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

const W = {
  inputToH1: [[-1, 5], [3, 3], [-4, 4]],
  h1ToH2: [[3, 4, -1], [-2, -1, 4], [-3, -2, -3]],
  h2ToOut: [8, 5, -6],
  b1: [-2, -4, -1],
  b2: [-4, -2, 4],
  bOut: -2,
};

const BIAS_MAP: Record<string, number> = {
  'h1-0': W.b1[0], 'h1-1': W.b1[1], 'h1-2': W.b1[2],
  'h2-0': W.b2[0], 'h2-1': W.b2[1], 'h2-2': W.b2[2],
  'output': W.bOut,
};

const NEURON_LABELS: Record<string, { name: string; detects: string }> = {
  'input-temp': { name: 'Temperature', detects: 'How hot or cold it is (range from 0–1)' },
  'input-humid': { name: 'Humidity', detects: 'How much moisture is in the air (range from 0–1)' },
  'h1-0': { name: 'Muggy Conditions', detects: 'Detects high humidity regardless of temperature' },
  'h1-1': { name: 'Warm & Wet', detects: 'Detects when it\'s both hot and humid at the same time' },
  'h1-2': { name: 'Cool Moisture', detects: 'Detects high humidity combined with cooler temperatures' },
  'h2-0': { name: 'Storm Signal', detects: 'Fires when muggy conditions and warm-and-wet patterns combine' },
  'h2-1': { name: 'Drizzle Detector', detects: 'Fires when cool moisture is present without tropical heat' },
  'h2-2': { name: 'Clear & Dry', detects: 'Fires when none of the rain-related patterns are active — signaling dry conditions' },
  'output': { name: 'Rain Prediction', detects: 'Combines all pattern signals into a final rain probability' },
};

export default function BiasNetwork() {
  const [temperature, setTemperature] = useState(0.7);
  const [humidity, setHumidity] = useState(0.8);
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);

  const active = locked ?? hovered;

  const comp = useMemo(() => {
    const inp = [temperature, humidity];
    const h1WeightedSum: number[] = [];
    const h1: number[] = [];
    for (let i = 0; i < 3; i++) {
      const ws = inp[0] * W.inputToH1[i][0] + inp[1] * W.inputToH1[i][1];
      h1WeightedSum.push(ws);
      h1.push(sigmoid(ws + W.b1[i]));
    }
    const h2WeightedSum: number[] = [];
    const h2: number[] = [];
    for (let i = 0; i < 3; i++) {
      const ws = h1[0] * W.h1ToH2[i][0] + h1[1] * W.h1ToH2[i][1] + h1[2] * W.h1ToH2[i][2];
      h2WeightedSum.push(ws);
      h2.push(sigmoid(ws + W.b2[i]));
    }
    const outWeightedSum = h2[0] * W.h2ToOut[0] + h2[1] * W.h2ToOut[1] + h2[2] * W.h2ToOut[2];
    const out = sigmoid(outWeightedSum + W.bOut);
    return { inp, h1WeightedSum, h1, h2WeightedSum, h2, outWeightedSum, out };
  }, [temperature, humidity]);

  const getValue = (id: string): number => {
    if (id === 'input-temp') return temperature;
    if (id === 'input-humid') return humidity;
    if (id.startsWith('h1-')) return comp.h1[parseInt(id.split('-')[1])];
    if (id.startsWith('h2-')) return comp.h2[parseInt(id.split('-')[1])];
    if (id === 'output') return comp.out;
    return 0;
  };

  const getWeightedSumNoBias = (id: string): number | null => {
    if (id.startsWith('h1-')) return comp.h1WeightedSum[parseInt(id.split('-')[1])];
    if (id.startsWith('h2-')) return comp.h2WeightedSum[parseInt(id.split('-')[1])];
    if (id === 'output') return comp.outWeightedSum;
    return null;
  };

  // Inputs: green scale by value. Neurons: green for positive bias, red for negative bias.
  const getColor = (id: string): string => {
    const grey = 130;
    if (id.startsWith('input')) {
      const v = getValue(id);
      const r = Math.round(grey * (1 - v) + 34 * v);
      const g = Math.round(grey * (1 - v) + 197 * v);
      const b = Math.round(grey * (1 - v) + 56 * v);
      return `rgb(${r}, ${g}, ${b})`;
    }
    const bias = BIAS_MAP[id] ?? 0;
    const t = Math.min(Math.abs(bias) / 4, 1);
    if (bias >= 0) {
      return `rgb(${Math.round(grey*(1-t)+34*t)}, ${Math.round(grey*(1-t)+197*t)}, ${Math.round(grey*(1-t)+56*t)})`;
    } else {
      return `rgb(${Math.round(grey*(1-t)+239*t)}, ${Math.round(grey*(1-t)+68*t)}, ${Math.round(grey*(1-t)+68*t)})`;
    }
  };

  const info = active ? NEURON_LABELS[active] : null;

  // Layout — identical to OverviewNetwork
  const iX = 60, h1X = 185, h2X = 325, oX = 450;
  const iY = [100, 200];
  const hY = [60, 150, 240];
  const oY = 150;

  const allNodes: { id: string; x: number; y: number; r: number }[] = [
    { id: 'input-temp', x: iX, y: iY[0], r: 18 },
    { id: 'input-humid', x: iX, y: iY[1], r: 18 },
    ...([0, 1, 2].map(i => ({ id: `h1-${i}`, x: h1X, y: hY[i], r: 18 }))),
    ...([0, 1, 2].map(i => ({ id: `h2-${i}`, x: h2X, y: hY[i], r: 18 }))),
    { id: 'output', x: oX, y: oY, r: 18 },
  ];

  const connections: { x1: number; y1: number; x2: number; y2: number; from: string; to: string }[] = [];
  for (const ii of [0, 1]) {
    for (const hi of [0, 1, 2]) {
      connections.push({ x1: iX + 18, y1: iY[ii], x2: h1X - 18, y2: hY[hi], from: ii === 0 ? 'input-temp' : 'input-humid', to: `h1-${hi}` });
    }
  }
  for (const fi of [0, 1, 2]) {
    for (const ti of [0, 1, 2]) {
      connections.push({ x1: h1X + 18, y1: hY[fi], x2: h2X - 18, y2: hY[ti], from: `h1-${fi}`, to: `h2-${ti}` });
    }
  }
  for (const hi of [0, 1, 2]) {
    connections.push({ x1: h2X + 18, y1: hY[hi], x2: oX - 18, y2: oY, from: `h2-${hi}`, to: 'output' });
  }

  return (
    <div className="overview-net">
      <div className="sliders">
        <div className="slider-group">
          <label>
            Temperature: <strong>{temperature.toFixed(2)}</strong>
            <span className="hint">(0 = cold, 1 = hot)</span>
          </label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>
        <div className="slider-group">
          <label>
            Humidity: <strong>{humidity.toFixed(2)}</strong>
            <span className="hint">(0 = dry, 1 = humid)</span>
          </label>
          <input
            type="range" min="0" max="1" step="0.01"
            value={humidity}
            onChange={(e) => setHumidity(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <svg viewBox="0 0 520 300" className="net-svg" onClick={() => { setLocked(null); setHovered(null); }}>
        {connections.map((c, i) => {
          const isIncoming = active && c.to === active;
          return (
            <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke={isIncoming ? '#1e293b' : active ? 'rgba(203,213,225,0.25)' : '#cbd5e1'}
              strokeWidth={isIncoming ? 2 : 1.2}
              style={isIncoming ? { transition: 'all 0.15s' } : {}} />
          );
        })}

        {allNodes.map(n => {
          const isActive = active === n.id;
          const isInput = n.id.startsWith('input');
          const isOutput = n.id === 'output';
          const bias = BIAS_MAP[n.id];
          return (
            <g key={n.id}
              onMouseEnter={() => { if (!locked) setHovered(n.id); }}
              onMouseLeave={() => { if (!locked) setHovered(null); }}
              onClick={(e) => { e.stopPropagation(); setLocked(locked === n.id ? null : n.id); }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={n.x} cy={n.y} r={n.r}
                fill={getColor(n.id)}
                stroke={isActive ? '#1e293b' : '#475569'}
                strokeWidth={isActive ? 2.8 : 2}
                style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.3))' } : {}}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                fontSize={isOutput ? 11 : 10} fontWeight="bold" fill="#1e293b"
                style={{ pointerEvents: 'none' }}>
                {isInput
                  ? getValue(n.id).toFixed(2)
                  : isOutput
                    ? `${(getValue(n.id) * 100).toFixed(0)}%`
                    : (bias >= 0 ? '+' : '') + bias
                }
              </text>
            </g>
          );
        })}

        {/* Labels */}
        <text x={iX - 22} y={iY[0] + 4} textAnchor="end" fontSize={9} fill="#64748b">Temp</text>
        <text x={iX - 22} y={iY[1] + 4} textAnchor="end" fontSize={9} fill="#64748b">Humid</text>
        <text x={oX + 28} y={oY + 4} textAnchor="start" fontSize={9} fill="#64748b">Rain</text>

        <text x={iX} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">INPUTS</text>
        <text x={h1X} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">LAYER 2</text>
        <text x={h2X} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">LAYER 3</text>
        <text x={oX} y={285} textAnchor="middle" fontSize={9} fill="#94a3b8">OUTPUT</text>
      </svg>

      <div className={`tooltip-box ${active ? 'visible' : ''}`}>
        {active && info ? (() => {
          const isInput = active.startsWith('input');
          const bias = BIAS_MAP[active] ?? null;
          const ws = getWeightedSumNoBias(active);
          const total = ws !== null && bias !== null ? ws + bias : null;
          const conf = getValue(active);
          return (
            <>
              <div className="tooltip-name">{info.name}</div>
              <div className="tooltip-section">
                <div className="tooltip-label">{isInput ? 'Description:' : 'What it learned to detect:'}</div>
                <div className="tooltip-desc">{info.detects}</div>
              </div>
              {!isInput && bias !== null && ws !== null && (
                <div className="tooltip-section">
                  <div className="tooltip-label">How bias shifts the sum:</div>
                  <div className="tooltip-receive-line">
                    Weighted sum (no bias): <strong>{ws >= 0 ? '+' : ''}{ws.toFixed(2)}</strong>
                  </div>
                  <div className="tooltip-receive-line">
                    Bias: <strong style={{ color: bias > 0 ? '#16a34a' : '#dc2626' }}>{bias > 0 ? '+' : ''}{bias}</strong>
                  </div>
                  <div className="tooltip-receive-line" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.3rem', marginTop: '0.2rem' }}>
                    Total: <strong>{total! >= 0 ? '+' : ''}{total!.toFixed(2)}</strong>
                  </div>
                  <div className="tooltip-math-note">
                    {bias > 0
                      ? `+${bias} bias gives this neuron a head start — it fires unless inputs suppress it.`
                      : `${bias} bias sets a high bar — inputs must overcome this deficit to make it fire.`
                    }
                  </div>
                </div>
              )}
              {isInput && (
                <div className="tooltip-section">
                  <div className="tooltip-confidence">
                    Current value: <strong>{(conf * 100).toFixed(1)}%</strong>
                  </div>
                </div>
              )}
            </>
          );
        })() : (
          <div className="tooltip-placeholder">Hover or click any neuron to see how its bias shifts the sum</div>
        )}
      </div>

      <style jsx>{`
        .overview-net {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .sliders {
          display: flex;
          gap: 2rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .slider-group {
          flex: 1;
          min-width: 180px;
        }
        .slider-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 14px;
          color: #444;
        }
        .slider-group strong {
          color: #2563eb;
          font-size: 16px;
        }
        .hint {
          display: block;
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
        .slider-group input[type="range"] {
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          background: #e2e8f0;
          border-radius: 4px;
          outline: none;
        }
        .slider-group input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
        }
        .net-svg {
          width: 100%;
          max-width: 520px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .tooltip-box {
          margin-top: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: opacity 0.15s;
        }
        .tooltip-name {
          font-weight: 700;
          color: #2563eb;
          font-size: 17px;
          margin-bottom: 0.5rem;
        }
        .tooltip-section {
          margin-bottom: 0.5rem;
        }
        .tooltip-label {
          font-weight: 600;
          font-size: 14px;
          color: #334155;
          margin-bottom: 0.2rem;
        }
        .tooltip-receive-line {
          font-size: 14px;
          color: #555;
          padding-left: 0;
          line-height: 1.6;
        }
        .tooltip-receive-line strong {
          color: #1e293b;
        }
        .tooltip-desc {
          font-size: 14px;
          color: #555;
          line-height: 1.4;
        }
        .tooltip-confidence {
          font-size: 14px;
          color: #334155;
          line-height: 1.5;
        }
        .tooltip-confidence strong {
          color: #2563eb;
          font-size: 16px;
        }
        .tooltip-math-note {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid #e2e8f0;
          font-size: 13px;
          color: #94a3b8;
          font-style: italic;
        }
        .tooltip-placeholder {
          color: #475569;
          font-style: italic;
          text-align: center;
          font-size: 16px;
          font-weight: 500;
        }
        @media (max-width: 640px) {
          .sliders { flex-direction: column; gap: 1rem; }
          .net-svg { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
