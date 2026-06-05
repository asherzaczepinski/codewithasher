'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WeightsNetwork from '@/components/WeightsNetwork';
import CodeBlock from '@/components/CodeBlock';

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
          Below is our full trained rain network from the overview. Hover over any neuron to see what pattern it learned to detect and how confidently it&apos;s firing given the current inputs. Notice how Layer 2 neurons each apply a different signifigance: "weight" to the input values and create a adifferent weighted sum  same two inputs — that&apos;s weights at work.
        </p>
        <WeightsNetwork />
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Weights are just numbers stored in a numpy array. A single dot product replaces the manual &quot;multiply each pair and add them up&quot; loop.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="neural_network.py"
        caption="Weights stored as a numpy array; np.dot replaces the manual multiply-and-sum loop."
        code={`# --- Step 2: Weights and the weighted sum ---
# Each connection between an input and a neuron has its own weight.
# A weight is just a number the network will learn during training.
# For now we write down example weights to see how the math works.

# Our input vector from Step 1 (temperature and humidity, both normalized):
# x = np.array([0.917, 0.8])

# Weights for ONE neuron -- one weight per input:
weights = np.array([-4.0, 4.0])
# weights[0] = -4.0  -> strong NEGATIVE influence from temperature
#               A big negative weight means: "the higher this input,
#               the more this neuron wants to stay quiet."
# weights[1] = +4.0  -> strong POSITIVE influence from humidity
#               A big positive weight means: "the higher this input,
#               the more this neuron wants to fire."
# A weight near 0 would mean the neuron almost ignores that input entirely.

# The weighted sum is just the dot product: multiply each (input, weight) pair
# and add the results.  np.dot handles that in one call.
weighted_sum = np.dot(x, weights)
# Equivalent long form: x[0]*weights[0] + x[1]*weights[1]
# = 0.917 * (-4.0) + 0.8 * 4.0  =  -3.668 + 3.2  =  -0.468

# This single number -0.468 is the neuron's raw opinion before bias and sigmoid.
# Later, every layer in our network will use np.dot (or @) for exactly this.`}
      />

    </div>
  );
}
