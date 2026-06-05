'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="No Single Sensor Is Enough">
        <p>
          Camera sees the pedestrian clearly but cannot measure how far away they are directly.
          LiDAR measures distance precisely but may miss a second pedestrian hidden behind a
          parked car. Radar sees through rain but cannot distinguish a shopping trolley from a
          child. Every sensor has gaps — sensor fusion closes them by combining measurements into
          an estimate that is more accurate and more reliable than any single source alone.
        </p>
        <p>
          The key insight: if two sensors both estimate the same quantity but their errors are
          <em> independent</em>, combining them shrinks the uncertainty. A noisier sensor still
          contributes useful information — just less of it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weighted Estimates: Giving More Weight to Trusted Sensors">
        <p>
          Suppose the camera-based depth estimator reports the pedestrian is <strong>7.8 m</strong>
          away, with an uncertainty (standard deviation) of <strong>0.8 m</strong>. The LiDAR
          reports <strong>8.1 m</strong>, with an uncertainty of <strong>0.2 m</strong>. Which do
          you trust more?
        </p>
        <p>
          Intuitively, you trust LiDAR more — its uncertainty is four times smaller. The optimal
          way to combine two independent, unbiased estimates is <strong>inverse-variance
          weighting</strong>: each measurement gets a weight equal to the inverse of its variance
          (variance = standard deviation squared). The sensor with the smaller variance (less
          noise) receives the larger weight.
        </p>
      </ExplanationBox>

      <MathFormula label="Inverse-Variance Fusion">
        {'w₁ = 1/σ₁²   w₂ = 1/σ₂²'}
        {'\n\n'}
        {'fused estimate  x̂ = (w₁·x₁ + w₂·x₂) / (w₁ + w₂)'}
        {'\n\n'}
        {'fused variance  σ̂² = 1 / (w₁ + w₂)'}
      </MathFormula>

      <WorkedExample title="Fusing Camera and LiDAR Distance Readings">
        <p>
          Our car needs to know exactly how far the pedestrian is. Camera and LiDAR give different
          answers. Let&apos;s compute the optimal fused estimate step by step.
        </p>

        <CalcStep number={1}>
          Camera reading: x₁ = 7.8 m, standard deviation σ₁ = 0.8 m
        </CalcStep>
        <CalcStep number={2}>
          LiDAR reading: x₂ = 8.1 m, standard deviation σ₂ = 0.2 m
        </CalcStep>
        <CalcStep number={3}>
          Camera variance: σ₁² = 0.8² = 0.64 m²
        </CalcStep>
        <CalcStep number={4}>
          LiDAR variance: σ₂² = 0.2² = 0.04 m²
        </CalcStep>
        <CalcStep number={5}>
          Camera weight: w₁ = 1 / 0.64 ≈ 1.5625
        </CalcStep>
        <CalcStep number={6}>
          LiDAR weight: w₂ = 1 / 0.04 = 25.0
        </CalcStep>
        <CalcStep number={7}>
          Sum of weights: w₁ + w₂ = 1.5625 + 25.0 = 26.5625
        </CalcStep>
        <CalcStep number={8}>
          Fused estimate: x̂ = (1.5625 × 7.8 + 25.0 × 8.1) / 26.5625
          = (12.1875 + 202.5) / 26.5625
          = 214.6875 / 26.5625
          ≈ 8.08 m
        </CalcStep>
        <CalcStep number={9}>
          Fused variance: σ̂² = 1 / 26.5625 ≈ 0.0377 m²
          → fused std dev ≈ 0.194 m
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The fused estimate is <strong>8.08 m</strong> — very close to the LiDAR reading because
          LiDAR dominated (weight 25 vs 1.56). The fused uncertainty (0.194 m) is slightly
          tighter than LiDAR alone (0.2 m) because the camera contributed a small amount of
          independent evidence. Even a noisy sensor makes the answer a little better.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Kalman Filter: Fusion Across Time">
        <p>
          The inverse-variance formula fuses two measurements at a single moment. Real systems
          also need to fuse <em>across time</em>: the car&apos;s IMU produces a position update
          every 5 ms; GPS arrives every 100 ms; LiDAR every 100 ms. The estimates must be
          continuously reconciled into a single smooth trajectory.
        </p>
        <p>
          The <strong>Kalman filter</strong> (1960) is the classic solution. It maintains two
          quantities: a <em>state estimate</em> (e.g., position and velocity) and a
          <em> covariance matrix</em> encoding how confident it is in that estimate. Each time step
          has two phases:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Predict:</strong> use a motion model (e.g., &quot;the car was going 12 m/s so
            it is probably 0.12 m further along&quot;) to project the state forward. Uncertainty
            grows during prediction because the model is imperfect.
          </li>
          <li>
            <strong>Update:</strong> when a new sensor measurement arrives, blend it with the
            prediction using inverse-variance-style weighting. The blending coefficient is called
            the <em>Kalman gain</em>. Uncertainty shrinks after a measurement.
          </li>
        </ul>
        <p>
          The Extended Kalman Filter (EKF) and Unscented Kalman Filter (UKF) generalise this to
          nonlinear motion and sensor models — both are standard in production AV stacks. In our
          city-block example, the EKF fuses GPS, IMU, and wheel-odometry at 200 Hz to give the
          car a centimetre-accurate position estimate even during the 1-second gaps between GPS
          fixes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Fusion Beats Any Single Sensor">
        <p>
          Fusion is not merely additive — it is multiplicative in reliability. Consider the
          probability that at least one sensor works correctly at any moment. If camera reliability
          is 90 % and LiDAR reliability is 95 %, fusing them gives a system that fails only when
          both fail simultaneously: 10 % × 5 % = 0.5 % failure rate. That&apos;s a 20× reduction
          in failure probability compared with camera alone. With five sensor modalities, the
          failure probability drops to negligible under most conditions.
        </p>
        <p>
          This redundancy principle — not just accuracy improvement — is the primary engineering
          reason every serious autonomous vehicle carries every sensor type, even expensive ones.
        </p>
      </ExplanationBox>
    </div>
  );
}
