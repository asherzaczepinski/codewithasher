'use client';

import { useState } from 'react';

export default function LayerCollapseDemo() {
  const [temp, setTemp] = useState(0.7);
  const [humid, setHumid] = useState(0.8);

  const E = 2.71828;
  const sigmoid = (z: number) => 1 / (1 + Math.pow(E, -z));

  // For LINEAR: simple weights that give a diagonal boundary
  const linearW = [0.8, 0.8];  // equal weight on both inputs
  const linearB = -0.6;

  // Linear prediction (just weighted sum)
  const linearOutput = temp * linearW[0] + humid * linearW[1] + linearB;

  // For SIGMOID network: 2 hidden neurons to create curved boundary
  // These weights create an AND-like pattern (need BOTH high humidity AND moderate temp)
  const h1_w = [2.0, 6.0];   // neuron 1: strongly wants high humidity
  const h1_b = -4.0;
  const h2_w = [-6.0, 2.0];  // neuron 2: strongly wants LOW temperature
  const h2_b = 3.0;
  // Output: needs BOTH neurons to fire (AND gate behavior)
  const out_w = [8.0, 8.0];
  const out_b = -10.0;

  // Sigmoid forward pass
  const h1_pre = temp * h1_w[0] + humid * h1_w[1] + h1_b;
  const h1_out = sigmoid(h1_pre);
  const h2_pre = temp * h2_w[0] + humid * h2_w[1] + h2_b;
  const h2_out = sigmoid(h2_pre);
  const out_pre = h1_out * out_w[0] + h2_out * out_w[1] + out_b;
  const sigmoidOutput = sigmoid(out_pre);

  // Helper to compute sigmoid prediction for any point
  const getSigmoidPred = (t: number, h: number) => {
    const h1 = sigmoid(t * h1_w[0] + h * h1_w[1] + h1_b);
    const h2 = sigmoid(t * h2_w[0] + h * h2_w[1] + h2_b);
    return sigmoid(h1 * out_w[0] + h2 * out_w[1] + out_b);
  };

  // Decision boundary for linear: where output = 0.5
  // temp * linearW[0] + humid * linearW[1] + linearB = 0.5
  // humid = (0.5 - linearB - temp * linearW[0]) / linearW[1]
  const getLinearBoundaryHumid = (t: number) => {
    return (0.5 - linearB - t * linearW[0]) / linearW[1];
  };

  // Graph dimensions
  const graphSize = 320;
  const padding = 45;
  const innerSize = graphSize - padding * 2;

  const toSvgX = (val: number) => padding + val * innerSize;
  const toSvgY = (val: number) => graphSize - padding - val * innerSize;

  // Generate heatmap for sigmoid version
  const heatmapCells = [];
  const cellSize = innerSize / 20;
  for (let ti = 0; ti < 20; ti++) {
    for (let hi = 0; hi < 20; hi++) {
      const t = ti / 20 + 0.025;
      const h = hi / 20 + 0.025;
      const pred = getSigmoidPred(t, h);
      heatmapCells.push({ ti, hi, pred });
    }
  }

  // Check if current point is in "rain" zone
  const linearPrediction = linearOutput >= 0.5 ? 'RAIN' : 'NO RAIN';
  const sigmoidPrediction = sigmoidOutput >= 0.5 ? 'RAIN' : 'NO RAIN';

  return (
    <div style={{ marginTop: '1.5rem' }}>
      {/* GRAPHS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Linear Decision Boundary Graph */}
        <div style={{
          background: '#fff',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '15px', color: '#374151' }}>
            Linear: Just One Line
          </h4>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
            Boundary: {linearW[0]}t + {linearW[1]}h + {linearB} = 0.5
          </div>
          <svg width={graphSize} height={graphSize} style={{ display: 'block', margin: '0 auto' }}>
            <defs>
              <clipPath id="graphClipLinear">
                <rect x={padding} y={padding} width={innerSize} height={innerSize} />
              </clipPath>
            </defs>

            {/* Rain region (blue) */}
            <polygon
              points={`${padding},${padding} ${padding},${toSvgY(getLinearBoundaryHumid(0))} ${graphSize-padding},${toSvgY(getLinearBoundaryHumid(1))} ${graphSize-padding},${padding}`}
              fill="#dbeafe"
              clipPath="url(#graphClipLinear)"
            />

            {/* No rain region (yellow) */}
            <polygon
              points={`${padding},${toSvgY(getLinearBoundaryHumid(0))} ${padding},${graphSize-padding} ${graphSize-padding},${graphSize-padding} ${graphSize-padding},${toSvgY(getLinearBoundaryHumid(1))}`}
              fill="#fef3c7"
              clipPath="url(#graphClipLinear)"
            />

            {/* Grid */}
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
              <g key={v}>
                <line x1={toSvgX(v)} y1={padding} x2={toSvgX(v)} y2={graphSize-padding} stroke="#e5e7eb" strokeWidth="1" />
                <line x1={padding} y1={toSvgY(v)} x2={graphSize-padding} y2={toSvgY(v)} stroke="#e5e7eb" strokeWidth="1" />
                <text x={toSvgX(v)} y={graphSize - padding + 15} textAnchor="middle" fontSize="10" fill="#666">{v}</text>
                <text x={padding - 8} y={toSvgY(v) + 4} textAnchor="end" fontSize="10" fill="#666">{v}</text>
              </g>
            ))}

            {/* Axes */}
            <line x1={padding} y1={graphSize-padding} x2={graphSize-padding} y2={graphSize-padding} stroke="#374151" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={graphSize-padding} stroke="#374151" strokeWidth="2" />

            {/* Decision boundary line */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(getLinearBoundaryHumid(0))}
              x2={toSvgX(1)}
              y2={toSvgY(getLinearBoundaryHumid(1))}
              stroke="#dc2626"
              strokeWidth="3"
              clipPath="url(#graphClipLinear)"
            />

            {/* Current point */}
            <circle cx={toSvgX(temp)} cy={toSvgY(humid)} r="10" fill={linearPrediction === 'RAIN' ? '#2563eb' : '#f59e0b'} stroke="#fff" strokeWidth="3" />

            {/* Labels */}
            <text x={graphSize/2} y={graphSize - 5} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="600">Temperature (t)</text>
            <text x={15} y={graphSize/2} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="600" transform={`rotate(-90, 15, ${graphSize/2})`}>Humidity (h)</text>

            {/* Region labels */}
            <text x={padding + 15} y={padding + 20} fontSize="13" fill="#1e40af" fontWeight="600">RAIN</text>
            <text x={graphSize - padding - 60} y={graphSize - padding - 10} fontSize="13" fill="#b45309" fontWeight="600">NO RAIN</text>
          </svg>
        </div>

        {/* Sigmoid Heatmap Graph */}
        <div style={{
          background: '#fff',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '15px', color: '#374151' }}>
            With Sigmoid: Curved Boundary
          </h4>

          {/* Color Legend at top */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '0.75rem',
            padding: '0.5rem',
            background: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#7c4a03',
                borderRadius: '4px',
                border: '1px solid #5c3503'
              }}></div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#7c4a03' }}>High Rain Prob</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#bae6fd',
                borderRadius: '4px',
                border: '1px solid #7dd3fc'
              }}></div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0369a1' }}>No Rain</span>
            </div>
          </div>

          <svg width={graphSize} height={graphSize} style={{ display: 'block', margin: '0 auto' }}>
            {/* Heatmap cells */}
            {heatmapCells.map(({ ti, hi, pred }) => (
              <rect
                key={`${ti}-${hi}`}
                x={padding + ti * cellSize}
                y={graphSize - padding - (hi + 1) * cellSize}
                width={cellSize + 0.5}
                height={cellSize + 0.5}
                fill={`hsl(${200 - pred * 170}, ${60 + pred * 30}%, ${85 - pred * 55}%)`}
              />
            ))}

            {/* Grid labels */}
            {[0, 0.25, 0.5, 0.75, 1].map(v => (
              <g key={v}>
                <text x={toSvgX(v)} y={graphSize - padding + 15} textAnchor="middle" fontSize="10" fill="#666">{v}</text>
                <text x={padding - 8} y={toSvgY(v) + 4} textAnchor="end" fontSize="10" fill="#666">{v}</text>
              </g>
            ))}

            {/* Axes */}
            <line x1={padding} y1={graphSize-padding} x2={graphSize-padding} y2={graphSize-padding} stroke="#374151" strokeWidth="2" />
            <line x1={padding} y1={padding} x2={padding} y2={graphSize-padding} stroke="#374151" strokeWidth="2" />

            {/* Highlight box around current cell instead of red line */}
            {(() => {
              // Find which cell the current point is in
              const cellTi = Math.floor(temp * 20);
              const cellHi = Math.floor(humid * 20);
              const clampedTi = Math.min(19, Math.max(0, cellTi));
              const clampedHi = Math.min(19, Math.max(0, cellHi));

              return (
                <rect
                  x={padding + clampedTi * cellSize - 2}
                  y={graphSize - padding - (clampedHi + 1) * cellSize - 2}
                  width={cellSize + 4}
                  height={cellSize + 4}
                  fill="none"
                  stroke="#fff"
                  strokeWidth="4"
                  rx="2"
                />
              );
            })()}
            {(() => {
              const cellTi = Math.floor(temp * 20);
              const cellHi = Math.floor(humid * 20);
              const clampedTi = Math.min(19, Math.max(0, cellTi));
              const clampedHi = Math.min(19, Math.max(0, cellHi));

              return (
                <rect
                  x={padding + clampedTi * cellSize - 2}
                  y={graphSize - padding - (clampedHi + 1) * cellSize - 2}
                  width={cellSize + 4}
                  height={cellSize + 4}
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  rx="2"
                />
              );
            })()}

            {/* Labels */}
            <text x={graphSize/2} y={graphSize - 5} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="600">Temperature (t)</text>
            <text x={15} y={graphSize/2} textAnchor="middle" fontSize="12" fill="#374151" fontWeight="600" transform={`rotate(-90, 15, ${graphSize/2})`}>Humidity (h)</text>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '12px' }}>
            <span style={{ color: '#0369a1' }}>0% (No Rain)</span>
            <div style={{
              width: '120px',
              height: '12px',
              background: 'linear-gradient(to right, #bae6fd, #7c4a03)',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}></div>
            <span style={{ color: '#7c4a03' }}>100% (Rain)</span>
          </div>
        </div>
      </div>

      {/* Sliders - now UNDER the graphs */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        marginTop: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '1rem',
        background: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Temperature (t): {temp.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            style={{ width: '180px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Humidity (h): {humid.toFixed(2)}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={humid}
            onChange={(e) => setHumid(parseFloat(e.target.value))}
            style={{ width: '180px' }}
          />
        </div>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f0f9ff',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #bae6fd'
      }}>
        <strong>Key Insight:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.25rem', lineHeight: '1.8' }}>
          <li>The <span style={{color: '#dc2626', fontWeight: 600}}>red line</span> in the left graph is the ONLY thing a linear network can learn — one straight boundary</li>
          <li>The <span style={{color: '#16a34a', fontWeight: 600}}>gradient</span> in the right graph shows sigmoid can learn smooth transitions — not just &quot;yes/no&quot;</li>
          <li><span style={{color: '#9333ea', fontWeight: 600}}>Biases</span> shift where the boundary sits (try imagining moving the line up/down)</li>
          <li><span style={{color: '#dc2626', fontWeight: 600}}>Weights</span> control the angle/steepness of the boundary</li>
        </ul>
      </div>

      {/* UNIFORM VS NON-UNIFORM SIGNIFICANCE */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1.25rem',
        background: '#faf5ff',
        borderRadius: '12px',
        fontSize: '14px',
        border: '2px solid #c4b5fd'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#6d28d9' }}>
          Why Sigmoid Works: Non-Uniform Significance
        </h4>
        <p style={{ margin: '0 0 1rem 0', lineHeight: '1.8' }}>
          In a linear function, every value has <strong>uniform significance</strong> — the jump from x=1 to x=2
          creates the exact same change in output as the jump from x=100 to x=101. The slope is constant everywhere.
          If your slope is 0.5, then x=1 gives y=0.5, x=3 gives y=1.5, and x=100 gives y=50. The &quot;meaning&quot; of
          each unit of x is identical no matter where you are on the number line.
        </p>
        <p style={{ margin: '0 0 1rem 0', lineHeight: '1.8' }}>
          Sigmoid breaks this uniformity by <strong>squishing values probabilistically</strong>. Values near zero
          get spread out (high sensitivity — small changes matter a lot), while extreme values get compressed
          (low sensitivity — the network has already &quot;made up its mind&quot;). This means x=0.1 vs x=0.2 might
          represent a meaningful difference, while x=10 vs x=10.1 barely matters at all.
        </p>
        <p style={{ margin: '0', lineHeight: '1.8', fontStyle: 'italic', color: '#5b21b6' }}>
          This non-uniform squishing is what allows different regions of the input space to have different
          &quot;meanings&quot; — enabling the curved boundaries you see above. Each layer can focus its sensitivity
          on different ranges, creating complex decision regions that a straight line could never capture.
        </p>
      </div>

    </div>
  );
}
