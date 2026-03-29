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
          Weights are what determine which pattern each neuron is looking for — whether it be muggy conditions, warm-and-wet combos, cool moisture, or anything else. By assigning high significance to certain inputs and low significance to others, a neuron becomes sensitive to exactly one specific combination in the data.
        </p>
        <p>
          Take a real neuron from our network: the <strong>Muggy Conditions</strong> neuron. Its job is to detect high humidity regardless of temperature. It assigns humidity a weight of <strong>+5</strong> and temperature a weight of <strong>−1</strong>. With temperature at 0.92 and humidity at 0.8, here&apos;s the actual weighted sum:
        </p>
        <MathFormula label="Muggy Conditions Neuron">
          sum = (0.92 × −1) + (0.8 × 5) = −0.92 + 4.0 = +3.08
        </MathFormula>
        <p>
          The +5 on humidity pulls the total up strongly whenever moisture is present — it&apos;s the dominant signal. The −1 on temperature isn&apos;t just neutral or ignored. It actively subtracts from the total as temperature rises. A hotter day means a lower sum. This neuron is specifically looking for moisture <em>without</em> warmth, so high temperatures work against it. That&apos;s what makes a negative weight fundamentally different from a near-zero weight: near-zero means &quot;I don&apos;t care about this input,&quot; while negative means &quot;this input is counter-evidence — the more of it I see, the less I should fire.&quot;
        </p>
        <p>
          Change the weights and you change what the neuron detects entirely. That specific combination — +5 humidity, −1 temperature — is what makes this a muggy-detector instead of a storm-detector or a heat-detector. This is how training works: it gradually adjusts weights until each neuron has settled into detecting something useful.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weights Across the Full Network">
        <p>
          In a full network, every single connection between every pair of neurons has its own weight. That means each neuron in each layer develops its own unique pattern — determined entirely by the weights it learns.
        </p>
        <p>
          Below is our full trained rain network from the overview. Hover over any neuron to see what pattern it learned to detect and how confidently it&apos;s firing given the current inputs. Notice how Layer 2 neurons each picked up a completely different pattern from the same two inputs — that&apos;s weights at work.
        </p>
        <WeightsNetwork />
        <p style={{ marginTop: '1rem' }}>
          Every neuron&apos;s confidence you see is the result of its inputs multiplied by its weights, summed up, and squeezed into 0–1. The weights are why Neuron 1 detects muggy conditions while Neuron 2 detects warm-and-wet combos — same inputs, completely different weights, completely different patterns.
        </p>
      </ExplanationBox>

      <p>
        <strong>Progress check:</strong> With humidity weighted at 2.0 and temperature at −0.3, our rain neuron is heavily influenced by humidity and only slightly pulled down by hot temperatures. But we&apos;re still missing one piece — what if the neuron should start with a built-in lean toward &quot;yes&quot; or &quot;no&quot; before any inputs even arrive? That&apos;s <strong>bias</strong>.
      </p>
    </div>
  );
}
