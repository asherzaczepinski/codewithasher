'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';


export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Normalization">
        <p>
          <strong>Scaling Our Inputs:</strong> We need to convert our weather data into decimals between 0 and 1 before they reach the neuron.
        </p>
        <p>
          <strong>Temperature:</strong> If temperatures in our dataset range from 32°F to 104°F, then 98°F becomes (98 − 32) / (104 − 32) ≈ <strong>0.92</strong>.
        </p>
        <p>
          <strong>Humidity:</strong> Already a percentage — 80% humidity = <strong>0.8</strong>.
        </p>
        <p>
          <strong>Why This Matters So Much:</strong> Without normalization, the neuron sees a raw temperature of <strong>98</strong> and a raw humidity of <strong>0.8</strong>. That&apos;s a 122× difference in scale — purely because of units, not importance. The temperature value would completely steamroll the humidity signal. The neuron would end up almost entirely driven by temperature and could barely learn from humidity, even though humidity is actually the stronger predictor of rain. Normalization fixes this by putting both inputs on the same 0–1 playing field so neither one wins just because its number is bigger.
        </p>
      </ExplanationBox>

      <MathFormula label="Normalization Formula">
        normalized = (value - min) / (max - min)
      </MathFormula>

      <p>
        <strong>But where does "max" come from? </strong> You define it yourself based on domain knowledge. If the highest temperature you&apos;ve ever seen in your area is 113°F and the lowest is 55°F, you might set your range to 50–120°F — giving yourself a little buffer for future inputs the model hasn&apos;t seen yet. That range is fixed before training and used to scale every value going forward, including new predictions. You only need to do this for raw inputs — every layer after that handles its own scaling automatically through the squeeze function, so you never define ranges beyond the first layer.
      </p>

      <ExplanationBox title="In Python">
        <p>
          Here is how we write the normalization formula as a reusable function and apply it to our two weather inputs before they ever touch a neuron.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="neural_network.py"
        caption="Min-max normalization squashes any raw measurement into the 0-to-1 range the network expects."
        code={`import numpy as np

# --- Step 1: Normalization ---
# Before feeding raw sensor readings into the network we squeeze them into [0, 1].
# The formula is: normalized = (value - lo) / (hi - lo)
# lo and hi are the observed min and max for that sensor -- you set them once,
# before training, based on domain knowledge, and never change them.

def normalize(value, lo, hi):
    # Subtract the minimum so the range starts at 0,
    # then divide by the full span so the range ends at 1.
    # Any value exactly equal to lo -> 0.0; any value equal to hi -> 1.0.
    return (value - lo) / (hi - lo)

# Our two raw sensor readings for today:
raw_temp     = 98.0   # degrees Fahrenheit
raw_humidity = 80.0   # percentage (0-100)

# Realistic ranges we decided on from historical data:
TEMP_LO, TEMP_HI         = 32.0, 104.0   # coldest and hottest we expect to see
HUMIDITY_LO, HUMIDITY_HI = 0.0,  100.0   # humidity is already a percentage

temp_norm     = normalize(raw_temp,     TEMP_LO, TEMP_HI)       # -> 0.917
humidity_norm = normalize(raw_humidity, HUMIDITY_LO, HUMIDITY_HI) # -> 0.800

# Pack the two normalized values into a single numpy array.
# This is the input vector x that every neuron in the first layer will receive.
x = np.array([temp_norm, humidity_norm])
# x is now [0.917, 0.8] -- both on the same 0-1 scale, neither one dominating.`}
      />

    </div>
  );
}
