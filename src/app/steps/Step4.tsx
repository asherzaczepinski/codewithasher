'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';


export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Normalization">
        <p>
          <strong>Scaling Our Inputs:</strong> We need to convert our weather data into decimals between 0 and 1.
        </p>
        <p>
          <strong>Temperature:</strong> If temperatures range from 0°C to 40°C,
          then 28°C becomes 28/40 = 0.7.
        </p>
        <p>
          <strong>Humidity:</strong> Already a percentage! 80% humidity = 0.8.
        </p>
        <p>
          <strong>Why Equal Scales Matter: </strong> Imagine if temperature ranged from 0-40 and humidity from 0-100.
          The larger humidity values would completely dominate the calculations, making it nearly impossible
          to learn from temperature. By scaling all inputs to similar ranges we give each feature
          a fair chance to influence the neuron&apos;s confidence.
        </p>
        <p>
          Think of it this way: if our rain neuron gets temperature as 28 and humidity as 0.8, the weight
          on temperature would overwhelm everything — the neuron&apos;s confidence would be almost entirely
          driven by temperature, ignoring the humidity signal that actually matters more for rain.
        </p>
      </ExplanationBox>

      <MathFormula label="Normalization Formula">
        normalized = (value - min) / (max - min)
      </MathFormula>

      <p>
        <strong>But where does "max" come from? </strong> You define it yourself based on domain knowledge. If the highest temperature you&apos;ve ever seen in your area is 113°F and the lowest is 55°F, you might set your range to 50–120°F — giving yourself a little buffer for future inputs the model hasn&apos;t seen yet. That range is fixed before training and used to scale every value going forward, including new predictions. You only need to do this for raw inputs — every layer after that handles its own scaling automatically through the squeeze function, so you never define ranges beyond the first layer.
      </p>

      <p>
        <strong>Progress check: </strong> Our rain neuron now has clean inputs — temperature = 0.7 and humidity = 0.8.
        But how does the neuron know that humidity matters more for rain than temperature? That&apos;s
        where weights come in next.
      </p>
    </div>
  );
}
