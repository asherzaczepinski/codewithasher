'use client';

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }
function sigmoidPrime(z: number) { const s = sigmoid(z); return s * (1 - s); }

const OUTPUT = 0.70;
const TARGET = 1.0;
const Z = Math.log(OUTPUT / (1 - OUTPUT)); // ≈ 0.847

const RATE1 = Math.abs(OUTPUT - TARGET);   // 0.30
const RATE2 = sigmoidPrime(Z);             // ≈ 0.21
const LR = 0.5;

const WEIGHTS = [
  { name: 'Humidity weight',    input: 0.80, current: 0.40, color: '#2563eb' },
  { name: 'Temperature weight', input: 0.30, current: 0.60, color: '#7c3aed' },
  { name: 'Bias',               input: 1.00, current: -0.20, color: '#059669' },
];

// Mini sigmoid SVG
function SigmoidGraph() {
  const W = 200, H = 90;
  const mapX = (z: number) => (z + 4.5) / 9 * W;
  const mapY = (out: number) => (1 - out) * 70 + 10;

  const pts: string[] = [];
  for (let zi = -4.5; zi <= 4.5; zi += 0.15) {
    pts.push(`${mapX(zi).toFixed(1)},${mapY(sigmoid(zi)).toFixed(1)}`);
  }

  const cx = mapX(Z);
  const cy = mapY(OUTPUT);
  const svgSlope = (-70 * sigmoidPrime(Z)) / (W / 9);
  const dx = 28;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '90px', display: 'block' }}>
      {/* Grid lines */}
      <line x1={0} y1={mapY(0.5)} x2={W} y2={mapY(0.5)} stroke="#f3f4f6" strokeWidth={1} />
      <line x1={mapX(0)} y1={5} x2={mapX(0)} y2={H - 5} stroke="#f3f4f6" strokeWidth={1} />
      {/* Sigmoid curve */}
      <polyline points={pts.join(' ')} fill="none" stroke="#d1d5db" strokeWidth={2} />
      {/* Tangent line showing slope */}
      <line
        x1={cx - dx} y1={cy - svgSlope * dx}
        x2={cx + dx} y2={cy + svgSlope * dx}
        stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 2"
      />
      {/* Operating point */}
      <circle cx={cx} cy={cy} r={4.5} fill="#2563eb" />
      {/* Label */}
      <text x={cx + 7} y={cy - 4} fontSize={9} fill="#2563eb" fontWeight="bold">70%</text>
      <text x={3} y={H - 3} fontSize={8} fill="#9ca3af">steep here — slope = {RATE2.toFixed(2)}</text>
    </svg>
  );
}

// Horizontal bar
function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
      <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '5px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: '13px', fontWeight: 700, color, minWidth: '38px', textAlign: 'right' }}>
        {value.toFixed(3)}
      </span>
    </div>
  );
}

export default function GradientChainVisual() {
  const maxGradient = WEIGHTS.reduce((m, w) => Math.max(m, RATE1 * RATE2 * w.input), 0);

  return (
    <div className="chain-visual">
      {/* ── Scenario chip ── */}
      <div className="scenario-chip">
        Scenario: output neuron predicted <strong>70% rain</strong> · target was <strong>100%</strong> · tracing the <strong>humidity weight</strong>
      </div>

      {/* ── Signal flow ── */}
      <div className="flow-stages">

        {/* Stage 1 */}
        <div className="stage-card">
          <div className="stage-badge" style={{ background: '#dbeafe', color: '#1d4ed8' }}>Rate 1</div>
          <div className="stage-title">Error signal starts here</div>
          <Bar value={RATE1} max={1} color="#2563eb" />
          <p className="stage-desc">
            Prediction was 70%, target was 100%. The gap is <strong>0.30</strong>. This is the raw
            blame signal — how much the loss is changing per unit change in the output right now.
            It starts at 0.30 and will shrink as it travels through the next two steps.
          </p>
        </div>

        <div className="stage-arrow">× {RATE2.toFixed(2)}</div>

        {/* Stage 2 */}
        <div className="stage-card">
          <div className="stage-badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>Rate 2</div>
          <div className="stage-title">Sigmoid filters it</div>
          <SigmoidGraph />
          <Bar value={RATE1 * RATE2} max={1} color="#7c3aed" />
          <p className="stage-desc">
            The sigmoid slope at 70% output is <strong>{RATE2.toFixed(2)}</strong>. The signal
            gets multiplied by that slope: 0.30 × {RATE2.toFixed(2)} = <strong>{(RATE1 * RATE2).toFixed(3)}</strong>.
            The dot on the graph shows exactly where the neuron is on the S-curve — still on the
            steeper section, so the signal survives reasonably well. If the neuron were at 5% or
            95%, the slope would be near 0 and the signal would die here.
          </p>
        </div>

        <div className="stage-arrow">× 0.80</div>

        {/* Stage 3 */}
        <div className="stage-card">
          <div className="stage-badge" style={{ background: '#dcfce7', color: '#166534' }}>Rate 3</div>
          <div className="stage-title">Lever arm scales it</div>
          <Bar value={RATE1 * RATE2 * 0.80} max={1} color="#16a34a" />
          <p className="stage-desc">
            The humidity input is <strong>0.80</strong>. That&apos;s the lever arm — the signal gets
            multiplied one final time: {(RATE1 * RATE2).toFixed(3)} × 0.80 = <strong>{(RATE1 * RATE2 * 0.80).toFixed(4)}</strong>.
            This is the humidity weight&apos;s gradient. The sign is negative (we undershot 100%),
            so the rule is: subtract a negative = increase the weight.
          </p>
        </div>
      </div>

      {/* ── Weight update ── */}
      <div className="update-box">
        <div className="update-label">Weight correction (learning rate = {LR})</div>
        <div className="update-equation">
          <span className="eq-part">new weight</span>
          <span className="eq-op">=</span>
          <span className="eq-part">0.40</span>
          <span className="eq-op">−</span>
          <span className="eq-part">{LR} × (−{(RATE1 * RATE2 * 0.80).toFixed(4)})</span>
          <span className="eq-op">=</span>
          <span className="eq-result">{(0.40 + LR * RATE1 * RATE2 * 0.80).toFixed(4)}</span>
        </div>
        <p className="update-note">
          Gradient was negative so subtracting it adds to the weight — pushing the prediction
          upward toward 100%.
        </p>
      </div>

      {/* ── Multiple weights ── */}
      <div className="multi-section">
        <div className="multi-title">Every weight in the same neuron gets corrected — but by different amounts</div>
        <p className="multi-intro">
          Rate 1 and Rate 2 are the same for every weight in the output neuron — they all live
          in the same neuron, so they all share the same error signal and the same sigmoid slope.
          The only thing that differs is Rate 3: each weight has a different input, so each has
          a different lever arm, and therefore a different-sized correction.
        </p>

        <div className="weight-rows">
          {WEIGHTS.map(w => {
            const gradient = RATE1 * RATE2 * w.input;
            const correction = LR * gradient;
            const newWeight = w.current + correction;
            const barPct = (gradient / maxGradient) * 100;
            return (
              <div key={w.name} className="weight-row">
                <div className="weight-name">{w.name}</div>
                <div className="weight-details">
                  <span className="detail-chip">input = {w.input.toFixed(2)}</span>
                  <span className="detail-chip">gradient = −{gradient.toFixed(4)}</span>
                  <span className="detail-chip">correction = +{correction.toFixed(4)}</span>
                  <span className="detail-chip highlight">{w.current.toFixed(2)} → {newWeight.toFixed(4)}</span>
                </div>
                <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${barPct}%`, height: '100%', background: w.color, borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="multi-footer">
          The bias gets the biggest correction because its lever arm is 1.0 — the full signal,
          unscaled. Humidity comes second at 0.80. Temperature gets the smallest nudge because
          its input was only 0.30 — it had the least influence over the prediction, so it
          gets the least blame.
        </p>
      </div>

      <style jsx>{`
        .chain-visual {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .scenario-chip {
          display: inline-block;
          padding: 0.4rem 0.9rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          font-size: 13px;
          color: #475569;
          margin-bottom: 1.25rem;
        }

        .flow-stages {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .stage-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1rem;
        }

        .stage-badge {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 0.4rem;
        }

        .stage-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .stage-desc {
          margin: 0.6rem 0 0;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }

        .stage-arrow {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: #94a3b8;
          padding: 0.5rem 0;
        }

        .update-box {
          margin-top: 1.25rem;
          padding: 1rem;
          background: #1e293b;
          border-radius: 10px;
          color: white;
        }

        .update-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94a3b8;
          margin-bottom: 0.6rem;
        }

        .update-equation {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          font-size: 14px;
        }

        .eq-part {
          background: #334155;
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
          font-family: monospace;
        }

        .eq-op {
          color: #94a3b8;
          font-weight: bold;
        }

        .eq-result {
          background: #16a34a;
          padding: 0.25rem 0.5rem;
          border-radius: 5px;
          font-family: monospace;
          font-weight: bold;
          font-size: 16px;
        }

        .update-note {
          margin: 0.75rem 0 0;
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
        }

        .multi-section {
          margin-top: 1.25rem;
          padding: 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .multi-title {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .multi-intro {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin: 0 0 1rem;
        }

        .weight-rows {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .weight-row {
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .weight-name {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.4rem;
        }

        .weight-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .detail-chip {
          font-size: 12px;
          padding: 0.15rem 0.45rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          color: #475569;
          font-family: monospace;
        }

        .detail-chip.highlight {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #166534;
          font-weight: 700;
        }

        .multi-footer {
          margin: 1rem 0 0;
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
