'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';


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

    </div>
  );
}
