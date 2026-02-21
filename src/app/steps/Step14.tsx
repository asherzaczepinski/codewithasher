'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step14() {
  return (
    <div>
      <p>
        <strong>Where we are:</strong> We have a network with 2 inputs, 2 hidden layers (3 neurons each),
        and 1 output. Each neuron works the same way — weighted sum, bias, sigmoid — but they&apos;re connected
        so one layer&apos;s confidence outputs become the next layer&apos;s inputs.
      </p>

      <ExplanationBox title="Connecting Layers">
        <p>
          The magic of deep learning happens when we connect layers together. The output
          of one layer becomes the input to the next. This creates a <strong>pipeline</strong>
          where data is progressively transformed, with each layer extracting more abstract features.
        </p>
        <p>
          In our network with two hidden layers:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>Raw inputs flow into <strong>hidden layer 1</strong></li>
          <li>Hidden layer 1 produces intermediate features</li>
          <li>Those features flow into <strong>hidden layer 2</strong></li>
          <li>Hidden layer 2 produces more abstract features</li>
          <li>Those flow into the <strong>output layer</strong> for the final prediction</li>
        </ul>
      </ExplanationBox>

      <div style={{
        background: 'var(--bg-tertiary)',
        padding: '1.5rem',
        borderRadius: '12px',
        margin: '1.5rem 0',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Input</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div className="neuron-viz">x₁</div>
              <div className="neuron-viz">x₂</div>
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>→</div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Hidden 1</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div className="neuron-viz active">h₁</div>
              <div className="neuron-viz active">h₂</div>
              <div className="neuron-viz active">h₃</div>
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>→</div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Hidden 2</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div className="neuron-viz active">h₄</div>
              <div className="neuron-viz active">h₅</div>
              <div className="neuron-viz active">h₆</div>
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>→</div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Output</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div className="neuron-viz active">y</div>
            </div>
          </div>
        </div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          2 inputs → 3 hidden (layer 1) → 3 hidden (layer 2) → 1 output
        </p>
      </div>

      <MathFormula label="Two-Hidden-Layer Network">
        h1 = layer(inputs, W₁, b₁) → h2 = layer(h1, W₂, b₂) → output = layer(h2, W₃, b₃)
      </MathFormula>

      <ExplanationBox title="Why 'Hidden' Layers?">
        <p>
          The middle layers are called &quot;hidden&quot; because we don&apos;t directly observe their values -
          we only see the inputs and final outputs. Each hidden layer&apos;s job is to create
          useful intermediate representations.
        </p>
        <p>
          Think of it like cooking: raw ingredients (inputs) → chopped ingredients
          (hidden layer 1) → mixed/seasoned ingredients (hidden layer 2) → final dish (output).
          Each step transforms the data into a form that&apos;s more useful for the next step.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain analogy:</strong> Raw weather data (temperature, humidity) → hidden layer 1 detects basic
        clues like &quot;it&apos;s muggy&quot; or &quot;it&apos;s cold&quot; (each neuron outputting a confidence) →
        hidden layer 2 combines those clues into &quot;muggy + cold = storm likely&quot; → output neuron gives
        final rain confidence. Each layer builds on the previous one&apos;s confidence levels.
      </p>

      <ExplanationBox title="Dimension Changes">
        <p>
          Notice how dimensions change through the network:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Input:</strong> 2 values [x₁, x₂]</li>
          <li><strong>Hidden 1 weights (W₁):</strong> 3×2 (3 neurons, each with 2 weights)</li>
          <li><strong>Hidden 1 output:</strong> 3 values [h₁, h₂, h₃]</li>
          <li><strong>Hidden 2 weights (W₂):</strong> 3×3 (3 neurons, each with 3 weights)</li>
          <li><strong>Hidden 2 output:</strong> 3 values [h₄, h₅, h₆]</li>
          <li><strong>Output weights (W₃):</strong> 1×3 (1 neuron with 3 weights)</li>
          <li><strong>Output:</strong> 1 value [y]</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Each layer transforms the data. The deeper we go, the more abstract the features become.
        </p>
      </ExplanationBox>

      <p>
        <strong>Simply put:</strong> Each neuron has one weight per input it receives. Hidden layer 1 neurons
        each get 2 inputs (temp, humidity) → 2 weights each. Hidden layer 2 neurons each get 3 inputs
        (the 3 confidence values from layer 1) → 3 weights each. The output neuron gets 3 inputs → 3 weights.
      </p>

      <WorkedExample title="Full Network Trace">
        <p>Let&apos;s trace data through our 2-hidden-layer network:</p>

        <p style={{ marginTop: '1rem' }}><strong>Input:</strong> [0.5, 0.8]</p>

        <p style={{ marginTop: '1rem' }}><strong>Hidden Layer 1 (3 neurons):</strong></p>
        <CalcStep number={1}>h₁ = sigmoid(0.5×0.4 + 0.8×0.6 + 0.1) = sigmoid(0.78) = 0.686</CalcStep>
        <CalcStep number={2}>h₂ = sigmoid(0.5×0.2 + 0.8×(-0.5) + (-0.2)) = sigmoid(-0.5) = 0.378</CalcStep>
        <CalcStep number={3}>h₃ = sigmoid(0.5×(-0.3) + 0.8×0.8 + 0.3) = sigmoid(0.79) = 0.688</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Hidden 1 Output:</strong> [0.686, 0.378, 0.688]</p>

        <p style={{ marginTop: '1rem' }}><strong>Hidden Layer 2 (3 neurons):</strong></p>
        <CalcStep number={4}>h₄ = sigmoid(0.686×0.3 + 0.378×0.5 + 0.688×(-0.2) + 0.1) = sigmoid(0.36) = 0.589</CalcStep>
        <CalcStep number={5}>h₅ = sigmoid(0.686×(-0.4) + 0.378×0.6 + 0.688×0.4 + (-0.1)) = sigmoid(0.18) = 0.545</CalcStep>
        <CalcStep number={6}>h₆ = sigmoid(0.686×0.5 + 0.378×(-0.3) + 0.688×0.7 + 0.2) = sigmoid(0.91) = 0.713</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Hidden 2 Output:</strong> [0.589, 0.545, 0.713]</p>

        <p style={{ marginTop: '1rem' }}><strong>Output Layer (1 neuron):</strong></p>
        <CalcStep number={7}>z = 0.589×0.4 + 0.545×0.3 + 0.713×0.5 + 0.1 = 0.856</CalcStep>
        <CalcStep number={8}>output = sigmoid(0.856) = 0.702</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          <strong>Final Output:</strong> 0.702
        </p>
      </WorkedExample>

      <ExplanationBox title="You Built a Deep Network!">
        <p>
          Congratulations! You&apos;ve built your first multi-layer neural network. This is
          fundamentally the same architecture used in:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>Multi-layer perceptrons (MLPs)</li>
          <li>The dense/fully-connected layers in CNNs</li>
          <li>The feed-forward parts of transformers</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          The network can now transform inputs through multiple non-linear steps, giving
          it the power to learn complex patterns. In the next step, we&apos;ll wrap this in
          a clean &quot;forward&quot; function and start thinking about how to train it.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain check:</strong> Data flows forward through our network — temperature and humidity enter,
        get transformed layer by layer (each neuron outputting its confidence), and a final rain prediction
        comes out. But right now the weights are random, so the prediction is meaningless. Next, we&apos;ll see
        what an untrained network actually outputs, and why it needs training.
      </p>
    </div>
  );
}
