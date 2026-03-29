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
          Take a real neuron from our network: the <strong>Cool Moisture</strong> neuron. Its job is to detect high humidity paired with cooler temperatures — think foggy mornings, damp overcast days, the kind of grey chill that leads to drizzle. It assigns humidity a weight of <strong>+4</strong> and temperature a weight of <strong>−4</strong>. With temperature at 0.92 and humidity at 0.8, here&apos;s the actual weighted sum:
        </p>
        <MathFormula label="Cool Moisture Neuron">
          sum = (0.92 × −4) + (0.8 × 4) = −3.68 + 3.2 = −0.48
        </MathFormula>
        <p>
          The +4 on humidity pushes the total up — moisture is the whole point. But the −4 on temperature is just as strong and pulling in the opposite direction. If the air is super hot, this neuron actively works against itself. That makes sense: if it&apos;s hot and humid, that&apos;s not cool moisture — that&apos;s the &quot;Warm &amp; Wet&quot; neuron&apos;s job. Heat is direct counter-evidence here, and the −4 weight reflects that perfectly. That&apos;s what makes a negative weight different from a near-zero weight: near-zero means &quot;I don&apos;t care about this input,&quot; while negative means &quot;the more of this I see, the less I should fire.&quot;
        </p>
        <p>
          If that still feels abstract, here are two concrete scenarios — same humidity, different temperature (normalized from a 0–40°C range):
        </p>
        <MathFormula label="Scenario A — 10°C, humidity 0.7 → temp normalized to 0.25">
          sum = (0.25 × −4) + (0.7 × 4) = −1.0 + 2.8 = +1.8
        </MathFormula>
        <MathFormula label="Scenario B — 40°C, humidity 0.7 → temp normalized to 1.0">
          sum = (1.0 × −4) + (0.7 × 4) = −4.0 + 2.8 = −1.2
        </MathFormula>
        <p>
          Same humidity both times, but the hotter temperature dragged the sum from +1.8 all the way down to −1.2. The cool damp day fires strongly — exactly what this neuron is looking for. The scorching humid day goes negative, meaning the neuron is actively suppressed. The temperature didn&apos;t just fail to help — it overpowered the humidity signal entirely.
        </p>
        <p>
          You might be wondering: couldn&apos;t we just make the Cool Moisture neuron&apos;s temperature weight conditional — positive when temperature is low, then flip to negative once it gets too hot? The problem is a weight is just a fixed number. It can&apos;t flip halfway through.
        </p>
        <p>
          But the network doesn&apos;t need it to. Instead of one neuron trying to do both, there&apos;s a second neuron — Warm &amp; Wet — that has a <em>positive</em> temperature weight. At low temperatures, Cool Moisture fires confidently and Warm &amp; Wet barely activates. At high temperatures, it flips: Cool Moisture gets suppressed and Warm &amp; Wet takes over. The next layer receives both of their confidence levels and naturally picks up on which one fired — achieving the exact splitting effect, just spread across two neurons instead of crammed into one conditional weight.
        </p>
        <p>
          There&apos;s also a deeper reason weights stay fixed numbers rather than conditionals — it keeps the training math clean. When we get to backpropagation, the way the network learns is by computing how much each weight contributed to the final error, then nudging it slightly. That only works cleanly when each weight is a simple constant multiplier — the math for figuring out &quot;how much did this weight affect the output&quot; is just one clean calculation per weight. If a weight could flip sign mid-input, the math breaks down: there&apos;s no smooth way to compute &quot;which direction should I nudge this?&quot; at the switchover point. By keeping weights as fixed numbers and letting the stacking of neurons handle complexity, the whole training process stays mathematically straightforward.
        </p>
        <p>
          And here&apos;s the key thing: <em>you never tell the network what to look for</em>. You just give it data and let it train. It figures out on its own that separating &quot;cool moisture&quot; from &quot;warm and wet&quot; makes it better at predicting rain — because that distinction genuinely helps. The weights are the network&apos;s way of encoding whatever mathematical patterns turned out to be most useful.
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
