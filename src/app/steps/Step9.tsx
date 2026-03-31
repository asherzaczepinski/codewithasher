'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';

function SigmoidGraph() {
  const zMin = -10;
  const zMax = 10;
  const zRange = zMax - zMin; // 200

  // Generate sigmoid curve points
  const points: [number, number][] = [];
  for (let i = zMin * 10; i <= zMax * 10; i++) {
    const z = i / 10;
    const sig = 1 / (1 + Math.exp(-z));
    const x = 40 + ((z - zMin) / zRange) * 400;
    const y = 260 - sig * 240;
    points.push([x, y]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const toX = (z: number) => 40 + ((z - zMin) / zRange) * 400;

  // Highlighted zone: z = -4 to +4
  const xLeft = toX(-4);
  const xRight = toX(4);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <svg width="500" height="300" viewBox="0 0 500 300" style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        {/* Highlighted effective zone */}
        <rect x={xLeft} y="20" width={xRight - xLeft} height="240" fill="#3b82f6" opacity="0.12" rx="4" />
        <line x1={xLeft} y1="20" x2={xLeft} y2="260" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,4" />
        <line x1={xRight} y1="20" x2={xRight} y2="260" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x={xLeft - 4} y="275" textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="600">-4</text>
        <text x={xRight + 4} y="275" textAnchor="middle" fontSize="11" fill="#3b82f6" fontWeight="600">+4</text>

        {/* Label for highlighted zone */}
        <text x={(xLeft + xRight) / 2} y="14" textAnchor="middle" fontSize="12" fill="#3b82f6" fontWeight="700">
          Effective Learning Zone
        </text>

        {/* Axes */}
        <line x1="40" y1="140" x2="460" y2="140" stroke="#94a3b8" strokeWidth="1" />
        <line x1={toX(0)} y1="20" x2={toX(0)} y2="260" stroke="#94a3b8" strokeWidth="1" />

        {/* Axis label */}
        <text x="465" y="144" fontSize="12" fill="#64748b" fontWeight="600">z</text>

        {/* Tick marks and labels on z axis */}
        {[-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10].map(z => {
          const x = toX(z);
          const isBlueLabel = z === -4 || z === 4;
          return (
            <g key={z}>
              <line x1={x} y1="137" x2={x} y2="143" stroke="#94a3b8" strokeWidth="1" />
              {!isBlueLabel && (
                <text x={x} y="275" textAnchor="middle" fontSize="9" fill="#94a3b8">{z}</text>
              )}
            </g>
          );
        })}

        {/* σ labels: 0, 0.5, 1 */}
        <text x="30" y="264" textAnchor="middle" fontSize="10" fill="#94a3b8">0</text>
        <text x="30" y="144" textAnchor="middle" fontSize="10" fill="#94a3b8">0.5</text>
        <text x="30" y="24" textAnchor="middle" fontSize="10" fill="#94a3b8">1</text>

        {/* Sigmoid curve */}
        <path d={pathD} fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function Step9() {
  return (
    <div>
      <p>
        <strong>Where we are: </strong> We know sigmoid converts z into a confidence level, and it works
        best when z is between -4 and +4. Our rain neuron&apos;s z = −0.6 was fine with just 2 inputs —
        but how do we keep z in range when a neuron has dozens of inputs?
      </p>

      <ExplanationBox title="Recall: The z Equation">
        <p>
          From our earlier overview, you learned that z is the weighted sum of inputs — the raw signal
          that determines how confident the neuron will be:
        </p>
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.75rem',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          z = (input<sub>1</sub> × weight<sub>1</sub>) + (input<sub>2</sub> × weight<sub>2</sub>) + ... + bias
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          Each term is an input times its weight. The final z is the sum of
          all these terms plus a bias. To control where z lands, we need to control <em>both</em> the
          inputs (via normalization) and the weights (via initialization).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Goal: Keep z in the Effective Zone">
        <SigmoidGraph />

        <p style={{ marginTop: '0.75rem' }}>
          In the previous steps, we gave you a <strong>brief overview </strong> of how weights, biases,
          and normalization fit into the big picture. Now let&apos;s go deeper into the <em>actual math</em> behind
          why these things work the way they do.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Everything comes back to one key insight: <strong>sigmoid is only useful when z is roughly
          between -4 and +4. </strong> Look at the graph above — in that tiny blue zone near the center,
          the curve is steep, meaning small changes in z produce meaningful changes in the output.
          Now look at how the curve behaves everywhere else across the full -10 to +10 range: it&apos;s
          completely flat.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Whether z is 10 or 100, sigmoid(z) ≈ 1.0000 either way. The neuron&apos;s confidence barely
          changes no matter what z is, so it can&apos;t tell the difference between its inputs.
          If every input produces the same confidence, the neuron has no way to figure out which
          inputs are important and which aren&apos;t — so it can&apos;t update its weights in any
          meaningful way. It&apos;s stuck, and <strong>learning stops.</strong>
        </p>

        <p style={{ marginTop: '0.75rem' }}>
          So our entire goal with normalization and weight initialization is to ensure that z values
          land inside this effective zone. If we get this right, the network can learn — each neuron
          produces meaningfully different outputs for different inputs, so it can figure out which
          inputs matter and adjust its weights accordingly. If we get it wrong, the neuron&apos;s output
          flatlines and it can&apos;t learn anything. Let&apos;s see exactly how the math makes this happen.
        </p>

        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1rem'
        }}>
          <p style={{ fontWeight: '700', marginBottom: '1rem' }}>Why -4 to +4? Let&apos;s prove it with numbers:</p>

          {/* z = -3 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = -3:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(-3) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>3</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '100px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 20.09</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#2563eb' }}>0.047</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Outputs ~5%. Clearly different from 0 — the neuron has room to move.
            </div>
          </div>

          {/* z = 0 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 0:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(0) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>0</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '60px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 1</div>
              </span>
              <span style={{ fontSize: '18px' }}> = <strong style={{ color: '#2563eb' }}>0.500</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Right in the middle — maximum sensitivity. Small changes in z make big changes in output.
            </div>
          </div>

          {/* z = 4 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 4:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(4) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-4</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '110px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0.0183</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#2563eb' }}>0.982</strong></span>
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Outputs ~98%. Still has room to move — not completely stuck at 1.
            </div>
          </div>

          <p style={{ fontWeight: '700', marginTop: '0.5rem', marginBottom: '1rem' }}>Now look what happens <span style={{ color: '#ef4444' }}>outside</span> that range:</p>

          {/* z = 5 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 5:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(5) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '80px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-5</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '110px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0.0067</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#ef4444' }}>0.9933</strong></span>
            </div>
          </div>

          {/* z = 10 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 10:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(10) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '90px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-10</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '130px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0.000045</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#ef4444' }}>0.99995</strong></span>
            </div>
          </div>

          {/* z = 100 */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b', fontSize: '16px' }}>
              z = 100:
            </div>
            <div style={{ fontFamily: 'Georgia, serif', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '18px' }}>sigmoid(100) = </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '100px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + e<sup>-100</sup></div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ </span>
              <span style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }}>
                <div style={{ fontSize: '20px', paddingBottom: '2px' }}>1</div>
                <div style={{ borderTop: '2px solid #1e293b', width: '60px' }}></div>
                <div style={{ fontSize: '20px', paddingTop: '2px' }}>1 + 0</div>
              </span>
              <span style={{ fontSize: '18px' }}> ≈ <strong style={{ color: '#ef4444' }}>1.00000</strong></span>
            </div>
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '14px', color: '#64748b' }}>
            From z = 5 to z = 100, the output only changed by 0.007. The neuron is giving
            basically the same answer for wildly different inputs — it&apos;s completely stuck.
          </p>
        </div>
      </ExplanationBox>

      <p>
        <strong>Progress check: </strong> With just 2 inputs (temperature and humidity), our rain neuron naturally
        gets a small z. But a real weather model with 50+ inputs would sum up many more terms, pushing z
        into the flat zones. Next we&apos;ll see exactly how normalization and Xavier initialization
        keep z in the sweet spot — no matter how many inputs.
      </p>
    </div>
  );
}
