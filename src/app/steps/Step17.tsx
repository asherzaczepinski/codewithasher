'use client';

import ExplanationBox from '@/components/ExplanationBox';
import InteractiveNetwork from '@/components/InteractiveNetwork';

export default function Step17() {
  return (
    <div>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '20px' }}>
        <strong>Where we are:</strong> One rain neuron gives us ≈82% confidence using just temperature and humidity.
        But real weather prediction needs more — what about wind, pressure, cloud cover? We need many neurons
        working together, organized into layers, each detecting different patterns.
      </div>

      <ExplanationBox title="From Single Neuron to Network">
        <p>
          You&apos;ve just built a complete neuron — it takes inputs, weights them, adds bias, and
          applies sigmoid to produce an activation. But one neuron can only learn simple patterns.
        </p>
        <p>
          To learn complex patterns like &quot;it will rain,&quot; we need to connect many neurons
          together into a <strong>network</strong>. Let&apos;s see how information flows through
          a complete neural network.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our 2-Hidden-Layer Network">
        <p>
          Here&apos;s the network we&apos;ll build: <strong>2 inputs</strong> (temperature, humidity),
          <strong>2 hidden layers</strong> (3 neurons each), and <strong>1 output</strong> (rain probability).
        </p>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '32px 16px',
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <svg width="460" height="200" viewBox="0 0 460 200">
            {/* Input layer */}
            <circle cx="45" cy="70" r="20" fill="#3b82f6"/>
            <circle cx="45" cy="140" r="20" fill="#3b82f6"/>
            <text x="45" y="75" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">temp</text>
            <text x="45" y="145" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">humid</text>

            {/* Hidden layer 1 */}
            <circle cx="150" cy="40" r="18" fill="#8b5cf6"/>
            <circle cx="150" cy="100" r="18" fill="#8b5cf6"/>
            <circle cx="150" cy="160" r="18" fill="#8b5cf6"/>
            <text x="150" y="44" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₁</text>
            <text x="150" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₂</text>
            <text x="150" y="164" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₃</text>

            {/* Hidden layer 2 */}
            <circle cx="270" cy="40" r="18" fill="#a855f7"/>
            <circle cx="270" cy="100" r="18" fill="#a855f7"/>
            <circle cx="270" cy="160" r="18" fill="#a855f7"/>
            <text x="270" y="44" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₄</text>
            <text x="270" y="104" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₅</text>
            <text x="270" y="164" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">h₆</text>

            {/* Output layer */}
            <circle cx="385" cy="100" r="22" fill="#22c55e"/>
            <text x="385" y="105" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600">rain?</text>

            {/* Connections - input to hidden1 */}
            <line x1="65" y1="70" x2="132" y2="40" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="65" y1="70" x2="132" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="65" y1="70" x2="132" y2="160" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="65" y1="140" x2="132" y2="40" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="65" y1="140" x2="132" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="65" y1="140" x2="132" y2="160" stroke="#d1d5db" strokeWidth="1.2"/>

            {/* Connections - hidden1 to hidden2 */}
            <line x1="168" y1="40" x2="252" y2="40" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="40" x2="252" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="40" x2="252" y2="160" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="100" x2="252" y2="40" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="100" x2="252" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="100" x2="252" y2="160" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="160" x2="252" y2="40" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="160" x2="252" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="168" y1="160" x2="252" y2="160" stroke="#d1d5db" strokeWidth="1.2"/>

            {/* Connections - hidden2 to output */}
            <line x1="288" y1="40" x2="363" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="288" y1="100" x2="363" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>
            <line x1="288" y1="160" x2="363" y2="100" stroke="#d1d5db" strokeWidth="1.2"/>

            {/* Labels */}
            <text x="45" y="185" textAnchor="middle" fill="#6b7280" fontSize="10">Input</text>
            <text x="150" y="185" textAnchor="middle" fill="#6b7280" fontSize="10">Hidden 1</text>
            <text x="270" y="185" textAnchor="middle" fill="#6b7280" fontSize="10">Hidden 2</text>
            <text x="385" y="140" textAnchor="middle" fill="#6b7280" fontSize="10">Output</text>
          </svg>
        </div>
      </ExplanationBox>

      <ExplanationBox title="How Information Flows">
        <p>
          Data flows forward through the network, layer by layer:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Input layer:</strong> Raw data enters (temperature 0.7, humidity 0.8)</li>
          <li><strong>Hidden layer 1:</strong> Each neuron detects basic patterns from the inputs</li>
          <li><strong>Hidden layer 2:</strong> Each neuron combines patterns from layer 1</li>
          <li><strong>Output layer:</strong> Combines all hidden layer 2 signals into final prediction</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          Each neuron works exactly like the one you just built — weighted sum, add bias, apply sigmoid.
          The only difference is that neurons in hidden layer 2 receive their inputs from hidden layer 1
          instead of from the raw data.
        </p>
      </ExplanationBox>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginTop: '0.75rem' }}>
        <strong>Think of it like asking friends:</strong> Instead of one person guessing if it&apos;ll rain,
        you ask three friends (hidden layer 1) to each look at the weather data. Each friend notices different
        things — one focuses on humidity, another on temperature patterns. Then three more friends (hidden layer 2)
        listen to the first group and combine their opinions. Finally, one person makes the call: rain or no rain.
        Each &quot;friend&quot; is a neuron outputting its confidence level.
      </div>

      <ExplanationBox title="Why Multiple Hidden Layers?">
        <p>
          Each layer learns increasingly abstract patterns:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Hidden layer 1:</strong> Simple patterns — &quot;high humidity,&quot; &quot;low temperature&quot;</li>
          <li><strong>Hidden layer 2:</strong> Combinations — &quot;humid AND cool,&quot; &quot;dry but warm&quot;</li>
          <li><strong>Output:</strong> Final decision based on these combined patterns</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          This is the power of <strong>deep learning</strong> — deeper networks can learn more
          complex patterns by building layers of abstraction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Try It: Interactive Network">
        <p>
          Adjust the sliders below to change the input values and watch the signals flow through
          the network. <strong>Hover over any node or connection</strong> to see the exact
          calculations happening at each step.
        </p>
      </ExplanationBox>

      <InteractiveNetwork />

      <ExplanationBox title="What You Just Saw">
        <p>
          Notice how changing the inputs creates different activation patterns throughout the network:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Colors:</strong> Brighter = stronger activation</li>
          <li><strong>Line thickness:</strong> Thicker = more signal flowing through</li>
          <li><strong>Green lines:</strong> Positive weights (amplify signal)</li>
          <li><strong>Red lines:</strong> Negative weights (suppress signal)</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          In the next steps, we&apos;ll learn how to build layers of neurons and connect them
          together to create networks like this one.
        </p>
      </ExplanationBox>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>Rain check:</strong> Our single rain neuron (≈82% confidence) is now just one of many neurons
        in a network. Each neuron in hidden layer 1 outputs its own confidence about a different pattern.
        Hidden layer 2 combines those confidences, and the output neuron gives us a final rain probability.
        Next, we&apos;ll see exactly how these layers connect and pass data forward.
      </div>
    </div>
  );
}
