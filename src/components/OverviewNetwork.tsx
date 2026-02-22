'use client';

import { useState, useMemo } from 'react';

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Same weights as InteractiveNetwork but we hide them from the user
const W = {
  inputToH1: [[-0.3, 0.9], [0.5, 0.7], [-0.4, 0.8]],
  h1ToH2: [[0.6, -0.3, 0.5], [0.4, 0.7, -0.2], [-0.5, 0.6, 0.8]],
  h2ToOut: [0.7, 0.5, 0.6],
  b1: [0.1, -0.2, 0.15],
  b2: [-0.1, 0.2, -0.15],
  bOut: -0.2,
};

const NEURON_LABELS: Record<string, { name: string; detects: string }> = {
  'input-temp': { name: 'Temperature', detects: 'How hot or cold it is (normalized 0–1)' },
  'input-humid': { name: 'Humidity', detects: 'How much moisture is in the air (normalized 0–1)' },
  'h1-0': { name: 'Muggy Conditions', detects: 'Detects high humidity regardless of temperature' },
  'h1-1': { name: 'Warm & Wet', detects: 'Detects when it\'s both hot and humid at the same time' },
  'h1-2': { name: 'Cool Moisture', detects: 'Detects high humidity combined with cooler temperatures' },
  'h2-0': { name: 'Storm Signal', detects: 'Fires when muggy conditions and warm-and-wet patterns combine' },
  'h2-1': { name: 'Drizzle Detector', detects: 'Fires when cool moisture is present without tropical heat' },
  'h2-2': { name: 'Overcast Check', detects: 'Fires when all Layer 2 signals are moderate — overcast but dry' },
  'output': { name: 'Rain Prediction', detects: 'Combines all pattern signals into a final rain probability' },
};

export default function OverviewNetwork() {
  const [temperature, setTemperature] = useState(0.7);
  const [humidity, setHumidity] = useState(0.8);
  const [hovered, setHovered] = useState<string | null>(null);

  const comp = useMemo(() => {
    const inp = [temperature, humidity];
    const h1: number[] = [];
    for (let i = 0; i < 3; i++) {
      h1.push(sigmoid(inp[0] * W.inputToH1[i][0] + inp[1] * W.inputToH1[i][1] + W.b1[i]));
    }
    const h2: number[] = [];
    for (let i = 0; i < 3; i++) {
      h2.push(sigmoid(h1[0] * W.h1ToH2[i][0] + h1[1] * W.h1ToH2[i][1] + h1[2] * W.h1ToH2[i][2] + W.b2[i]));
    }
    const out = sigmoid(h2[0] * W.h2ToOut[0] + h2[1] * W.h2ToOut[1] + h2[2] * W.h2ToOut[2] + W.bOut);
    return { inp, h1, h2, out };
  }, [temperature, humidity]);

  const getValue = (id: string): number => {
    if (id === 'input-temp') return temperature;
    if (id === 'input-humid') return humidity;
    if (id.startsWith('h1-')) return comp.h1[parseInt(id.split('-')[1])];
    if (id.startsWith('h2-')) return comp.h2[parseInt(id.split('-')[1])];
    if (id === 'output') return comp.out;
    return 0;
  };

  const getColor = (v: number): string => {
    const r = Math.round(255 - v * 155);
    const g = Math.round(100 + v * 155);
    const b = Math.round(100 + v * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const info = hovered ? NEURON_LABELS[hovered] : null;
  const confidence = hovered ? getValue(hovered) : 0;

  // Layout
  const iX = 60, h1X = 185, h2X = 325, oX = 450;
  const iY = [100, 200];
  const hY = [60, 150, 240];
  const oY = 150;

  const allNodes: { id: string; x: number; y: number; r: number }[] = [
    { id: 'input-temp', x: iX, y: iY[0], r: 18 },
    { id: 'input-humid', x: iX, y: iY[1], r: 18 },
    ...([0, 1, 2].map(i => ({ id: `h1-${i}`, x: h1X, y: hY[i], r: 18 }))),
    ...([0, 1, 2].map(i => ({ id: `h2-${i}`, x: h2X, y: hY[i], r: 18 }))),
    { id: 'output', x: oX, y: oY, r: 22 },
  ];

  // Connections
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const ii of [0, 1]) {
    for (const hi of [0, 1, 2]) {
      connections.push({ x1: iX + 18, y1: iY[ii], x2: h1X - 18, y2: hY[hi] });
    }
  }
  for (const fi of [0, 1, 2]) {
    for (const ti of [0, 1, 2]) {
      connections.push({ x1: h1X + 18, y1: hY[fi], x2: h2X - 18, y2: hY[ti] });
    }
  }
  for (const hi of [0, 1, 2]) {
    connections.push({ x1: h2X + 18, y1: hY[hi], x2: oX - 22, y2: oY });
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

      <svg viewBox="0 0 520 300" className="net-svg">
        {connections.map((c, i) => (
          <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke="#cbd5e1" strokeWidth={1.5} />
        ))}

        {allNodes.map(n => {
          const v = getValue(n.id);
          const isHovered = hovered === n.id;
          const isOutput = n.id === 'output';
          return (
            <g key={n.id}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={n.x} cy={n.y} r={n.r}
                fill={getColor(v)}
                stroke={isHovered ? '#2563eb' : isOutput ? '#2563eb' : '#475569'}
                strokeWidth={isHovered ? 3.5 : isOutput ? 2.5 : 2}
                style={isHovered ? { filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.5))' } : {}}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                fontSize={isOutput ? 11 : 10} fontWeight="bold" fill="#1e293b"
                style={{ pointerEvents: 'none' }}>
                {isOutput ? `${(v * 100).toFixed(0)}%` : v.toFixed(2)}
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

      <div className={`tooltip-box ${info ? 'visible' : ''}`}>
        {info ? (
          <>
            <div className="tooltip-name">{info.name}</div>
            <div className="tooltip-detects">{info.detects}</div>
            <div className="tooltip-conf">
              Confidence: <strong>{(confidence * 100).toFixed(1)}%</strong>
            </div>
          </>
        ) : (
          <div className="tooltip-placeholder">Hover over any neuron to see what it detects</div>
        )}
      </div>

      <div className="rain-bar">
        <div className="rain-label">Rain Probability</div>
        <div className="rain-value">{(comp.out * 100).toFixed(1)}%</div>
        <div className="rain-message">
          {comp.out > 0.7 ? 'High chance of rain — bring an umbrella!' :
           comp.out > 0.4 ? 'Moderate chance — maybe bring an umbrella.' :
           'Low chance of rain — probably safe without one.'}
        </div>
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
          min-height: 70px;
          transition: opacity 0.15s;
        }
        .tooltip-name {
          font-weight: 700;
          color: #2563eb;
          font-size: 15px;
          margin-bottom: 0.25rem;
        }
        .tooltip-detects {
          font-size: 14px;
          color: #555;
          line-height: 1.4;
        }
        .tooltip-conf {
          margin-top: 0.4rem;
          font-size: 14px;
          color: #334155;
        }
        .tooltip-conf strong {
          color: #2563eb;
          font-size: 16px;
        }
        .tooltip-placeholder {
          color: #94a3b8;
          font-style: italic;
          text-align: center;
          font-size: 14px;
        }
        .rain-bar {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          border-radius: 8px;
          color: white;
          text-align: center;
        }
        .rain-label {
          font-size: 14px;
          opacity: 0.9;
        }
        .rain-value {
          font-size: 28px;
          font-weight: 700;
          margin: 0.15rem 0;
        }
        .rain-message {
          font-size: 13px;
          opacity: 0.85;
        }
        @media (max-width: 640px) {
          .sliders { flex-direction: column; gap: 1rem; }
          .net-svg { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
