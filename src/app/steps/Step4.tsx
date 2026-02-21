'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Weights: How the Network Decides What Matters">
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '0.75rem' }}>
          <strong>Key idea:</strong> Weights control how strongly one signal influences the next neuron.
        </div>
        <p>
          In a neural network, each neuron combines the signals it receives using a simple formula:
        </p>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem', margin: '0.75rem 0', fontFamily: 'monospace', fontSize: '0.95rem' }}>
          Neuron Output = (Input₁ × Weight₁) + (Input₂ × Weight₂) + (Input₃ × Weight₃) + …
        </div>
        <p>
          <strong>Input</strong> is the confidence coming from the previous neuron (or input variable).
          <br/>
          <strong>Weight</strong> is how important that input is for this neuron.
        </p>
        <p>
          So the neuron doesn&apos;t just add all signals equally. It multiplies each input by its weight to see how much it should influence the output.
        </p>
      </ExplanationBox>

      <ExplanationBox title='Example: Hidden Neuron "Storm Conditions"'>
        <p>Inputs from the first layer:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Humidity: 0.90</li>
          <li>Pressure: 0.70</li>
          <li>Temperature: 0.30</li>
        </ul>
        <p>Weights for this neuron:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Humidity → 0.8 (very important)</li>
          <li>Pressure → 0.5 (somewhat important)</li>
          <li>Temperature → 0.2 (less important)</li>
        </ul>
        <p>The neuron combines these inputs by multiplying each by its weight and adding them together:</p>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.75rem', margin: '0.75rem 0', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.8' }}>
          Humidity contribution: 0.90 × 0.8 = 0.72<br/>
          Pressure contribution: 0.70 × 0.5 = 0.35<br/>
          Temperature contribution: 0.30 × 0.2 = 0.06
        </div>
        <p>
          Adding these gives a total input of 1.13. After applying a function to scale it between 0 and 1, the neuron might output <strong>0.87</strong> confidence that storm conditions are forming.
        </p>
      </ExplanationBox>

      <ExplanationBox title='Another Example: Hidden Neuron "Heat Pattern"'>
        <p>Inputs are the same:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Humidity: 0.90</li>
          <li>Pressure: 0.70</li>
          <li>Temperature: 0.30</li>
        </ul>
        <p>Weights for this neuron:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Temperature → 0.7 (very important)</li>
          <li>Humidity → 0.5 (medium)</li>
          <li>Pressure → 0.1 (very weak)</li>
        </ul>
        <p>
          Multiplying inputs by weights and summing shows which signals matter most for this neuron. After scaling, this neuron outputs <strong>0.73</strong> confidence for detecting the heat pattern.
        </p>
      </ExplanationBox>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>Key takeaway:</strong> Weights let each neuron specialize — focusing on some inputs more than others. This is how a network builds structure and recognizes patterns: by deciding which inputs matter most for each neuron.
      </div>
    </div>
  );
}
