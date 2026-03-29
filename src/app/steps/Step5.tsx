'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WeightsNetwork from '@/components/WeightsNetwork';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="What Are Weights?">
        <p>
          Before a neuron can output anything, it first computes a <strong>weighted sum</strong> — every input gets multiplied by its own weight, and all of those products get added together into a single total:
        </p>
        <MathFormula label="Weighted Sum">
          sum = (input₁ × w₁) + (input₂ × w₂) + ...
        </MathFormula>
        <p>
          Weights are what determine which pattern each neuron looks for. A high weight on an input means that input strongly influences the total. A near-zero weight means the neuron mostly ignores it. Weights can also be negative — meaning that input actively pulls the total down the more it appears.
        </p>
        <p>
          The specific combination of weights across all of a neuron&apos;s inputs is what defines its pattern. Change the weights and you change what the neuron detects entirely.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights Across the Full Network">
        <p>
          In a full network, every single connection between every pair of neurons has its own weight. That means each neuron in each layer develops its own unique pattern — determined entirely by the weights it learns.
        </p>
        <p>
          Below is our full trained rain network from the overview. Hover over any neuron to see what pattern it learned to detect and the raw weighted sum it computed. Notice how Layer 2 neurons each assign completely different weights to the same two inputs — producing different weighted sums, and detecting entirely different patterns.
        </p>
        <WeightsNetwork />
      </ExplanationBox>

    </div>
  );
}
