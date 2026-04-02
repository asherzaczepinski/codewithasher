'use client';

import { useState } from 'react';

// Exact same coordinates as InteractiveNetwork
const inputX = 60;
const hidden1X = 180;
const hidden2X = 320;
const outputX = 440;
const inputY = [100, 200];
const hiddenY = [60, 150, 240];
const outputY = 150;

// All connections as [fromLayer, fromIdx, toLayer, toIdx]
type Conn = { from: string; to: string; x1: number; y1: number; x2: number; y2: number };

const CONNECTIONS: Conn[] = [
  // Input → Hidden 1
  ...[0, 1].flatMap(ii =>
    [0, 1, 2].map(ni => ({
      from: `in-${ii}`, to: `h1-${ni}`,
      x1: inputX + 18,   y1: inputY[ii],
      x2: hidden1X - 18, y2: hiddenY[ni],
    }))
  ),
  // Hidden 1 → Hidden 2
  ...[0, 1, 2].flatMap(f =>
    [0, 1, 2].map(t => ({
      from: `h1-${f}`, to: `h2-${t}`,
      x1: hidden1X + 18, y1: hiddenY[f],
      x2: hidden2X - 18, y2: hiddenY[t],
    }))
  ),
  // Hidden 2 → Output
  ...[0, 1, 2].map(ni => ({
    from: `h2-${ni}`, to: 'out',
    x1: hidden2X + 18, y1: hiddenY[ni],
    x2: outputX - 22,  y2: outputY,
  })),
];

// When hovering a node, highlight the connections that bring blame INTO it (from the right)
function incomingConns(nodeId: string): Set<string> {
  return new Set(
    CONNECTIONS.filter(c => c.to === nodeId).map(c => `${c.from}->${c.to}`)
  );
}

const NODE_INFO: Record<string, { title: string; description: string }> = {
  out: {
    title: 'Output Node — Where Blame Originates',
    description: "This is where the mistake lives. The prediction came out wrong, so blame starts here — how wrong the prediction was, scaled by how sensitive the output was at this point on the sigmoid curve. From here it travels backward along every incoming connection.",
  },
  'h2-0': {
    title: 'Hidden Layer 2, Neuron 1',
    description: "Blame arrives from the output through the weight connecting them. A heavier weight means this neuron had more influence over the output — so it receives more blame. The blame is also scaled by how steep this neuron's sigmoid curve was. Steeper = more correction passes through.",
  },
  'h2-1': {
    title: 'Hidden Layer 2, Neuron 2',
    description: "Same process as its neighbors. Each layer-2 neuron gets its own share of the output's blame, proportional to its weight to the output and its sigmoid slope. A flatter sigmoid slope here means the correction signal weakens — that's the vanishing gradient problem.",
  },
  'h2-2': {
    title: 'Hidden Layer 2, Neuron 3',
    description: "Blame flows in from the output through its connecting weight. Each of the three layer-2 neurons receives a different amount — depending on how much each one actually contributed to the wrong prediction.",
  },
  'h1-0': {
    title: 'Hidden Layer 1, Neuron 1',
    description: "Blame arrives here from all three layer-2 neurons at once — three separate paths, each carrying a different amount scaled by the weight on that path. They all add up into one combined blame score. Then the total is multiplied by the sigmoid slope at this neuron. By layer 1, the blame is much smaller, but still enough to nudge the weights.",
  },
  'h1-1': {
    title: 'Hidden Layer 1, Neuron 2',
    description: "Three blame signals arrive (one from each layer-2 neuron), each scaled by the weight on that connection. They combine here into a single total. The sigmoid slope at this neuron then scales that total — this is the second of the three rates in the chain.",
  },
  'h1-2': {
    title: 'Hidden Layer 1, Neuron 3',
    description: "Three paths of blame converge here from the layer above. Each path carries a fraction of its source neuron's blame, determined by the connecting weight. The fractions add up, then get multiplied by the local sigmoid slope.",
  },
  'in-0': {
    title: 'Temperature Input',
    description: "Raw inputs don't get a blame score — there's no weight here to update. But the temperature value acts as a lever arm for temperature weights in layer 1: when those weights get their correction, the size of that correction is multiplied by this value. A larger input = a bigger adjustment to its connected weights.",
  },
  'in-1': {
    title: 'Humidity Input',
    description: "Same role as temperature. No weight here to update, but the humidity value scales the correction applied to humidity weights in layer 1. A slightly larger value means a slightly stronger correction — the weight connected to a stronger input had more influence, so it gets a proportionally larger nudge.",
  },
};

export default function GradientFlowNetwork() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const highlighted = hoveredNode ? incomingConns(hoveredNode) : new Set<string>();
  const active = hoveredNode ? NODE_INFO[hoveredNode] : null;

  return (
    <div className="gradient-network">
      <div className="network-container">
        <svg viewBox="0 0 520 300" className="network-svg">
          {/* Connections */}
          {CONNECTIONS.map(c => {
            const key = `${c.from}->${c.to}`;
            const isLit = highlighted.has(key);
            return (
              <line
                key={key}
                x1={c.x1} y1={c.y1}
                x2={c.x2} y2={c.y2}
                stroke={isLit ? '#ea580c' : '#d1d5db'}
                strokeWidth={isLit ? 2.5 : 1}
              />
            );
          })}

          {/* Input nodes */}
          {[0, 1].map(i => {
            const id = `in-${i}`;
            const isH = hoveredNode === id;
            return (
              <g key={id} className={`node ${isH ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredNode(id)}
                onMouseLeave={() => setHoveredNode(null)}>
                <circle cx={inputX} cy={inputY[i]} r={18}
                  fill={isH ? '#dbeafe' : 'white'}
                  stroke={isH ? '#2563eb' : '#333'}
                  strokeWidth={isH ? 3 : 2} />
                <text x={inputX} y={inputY[i] + 4} textAnchor="middle" fontSize={9} fill={isH ? '#2563eb' : '#555'}>
                  {i === 0 ? 'Temp' : 'Humid'}
                </text>
              </g>
            );
          })}

          {/* Hidden layer 1 nodes */}
          {[0, 1, 2].map(i => {
            const id = `h1-${i}`;
            const isH = hoveredNode === id;
            return (
              <g key={id} className={`node ${isH ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredNode(id)}
                onMouseLeave={() => setHoveredNode(null)}>
                <circle cx={hidden1X} cy={hiddenY[i]} r={18}
                  fill={isH ? '#f3f4f6' : 'white'}
                  stroke={isH ? '#6b7280' : '#333'}
                  strokeWidth={isH ? 3 : 2} />
                <text x={hidden1X} y={hiddenY[i] + 4} textAnchor="middle" fontSize={9} fill={isH ? '#374151' : '#555'}>
                  H1
                </text>
              </g>
            );
          })}

          {/* Hidden layer 2 nodes */}
          {[0, 1, 2].map(i => {
            const id = `h2-${i}`;
            const isH = hoveredNode === id;
            return (
              <g key={id} className={`node ${isH ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredNode(id)}
                onMouseLeave={() => setHoveredNode(null)}>
                <circle cx={hidden2X} cy={hiddenY[i]} r={18}
                  fill={isH ? '#f3f4f6' : 'white'}
                  stroke={isH ? '#6b7280' : '#333'}
                  strokeWidth={isH ? 3 : 2} />
                <text x={hidden2X} y={hiddenY[i] + 4} textAnchor="middle" fontSize={9} fill={isH ? '#374151' : '#555'}>
                  H2
                </text>
              </g>
            );
          })}

          {/* Output node */}
          <g className={`node ${hoveredNode === 'out' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredNode('out')}
            onMouseLeave={() => setHoveredNode(null)}>
            <circle cx={outputX} cy={outputY} r={22}
              fill={hoveredNode === 'out' ? '#fee2e2' : 'white'}
              stroke={hoveredNode === 'out' ? '#dc2626' : '#333'}
              strokeWidth={hoveredNode === 'out' ? 3 : 2} />
            <text x={outputX} y={outputY + 5} textAnchor="middle" fontSize={11} fill={hoveredNode === 'out' ? '#dc2626' : '#555'}>Rain</text>
            <text x={outputX + 28} y={outputY + 4} textAnchor="start" fontSize={9} fill="#666">%</text>
          </g>

          {/* Layer labels */}
          <text x={inputX}   y={280} textAnchor="middle" fontSize={9} fill="#999">INPUT</text>
          <text x={hidden1X} y={280} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 1</text>
          <text x={hidden2X} y={280} textAnchor="middle" fontSize={9} fill="#999">HIDDEN 2</text>
          <text x={outputX}  y={280} textAnchor="middle" fontSize={9} fill="#999">OUTPUT</text>
        </svg>

        <div className={`info-panel ${active ? 'visible' : ''}`}>
          {active ? (
            <>
              <h4>{active.title}</h4>
              <p>{active.description}</p>
            </>
          ) : (
            <p className="hint">Hover over any node to see how blame reaches it</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .gradient-network {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .network-container {
          position: relative;
        }

        .network-svg {
          width: 100%;
          max-width: 500px;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .network-svg .node {
          cursor: pointer;
        }

        .network-svg .node.hovered circle {
          filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.5));
        }

        .info-panel {
          margin-top: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          min-height: 100px;
        }

        .info-panel h4 {
          margin: 0 0 0.5rem 0;
          color: #2563eb;
          font-size: 15px;
        }

        .info-panel p {
          margin: 0;
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }

        .info-panel .hint {
          color: #999;
          font-style: italic;
          text-align: center;
        }

        @media (max-width: 640px) {
          .network-svg {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
