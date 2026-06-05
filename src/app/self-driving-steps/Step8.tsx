'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="From Plan to Physical Action">
        <p>
          The planner outputs a desired trajectory — a series of target positions and speeds over
          the next few seconds. The controller&apos;s job is to translate that trajectory into
          physical commands: a steering angle in degrees, a throttle percentage, and a brake
          pressure in kPa. These signals go directly to the car&apos;s actuators — the electric
          motor, hydraulic brakes, and electric power steering unit.
        </p>
        <p>
          The controller runs in a tight loop at 100 Hz or faster. Every 10 ms it checks where the
          car actually is, compares that to where the trajectory says it should be, and adjusts the
          actuator commands to close the gap. This is <strong>closed-loop control</strong> — the
          output (vehicle position) feeds back into the input (correction command). Without this
          loop, small errors would accumulate and the car would drift off-course.
        </p>
      </ExplanationBox>

      <ExplanationBox title="PID Control: The Workhorse Algorithm">
        <p>
          The most widely used closed-loop controller in engineering is the
          <strong> PID controller</strong> — Proportional, Integral, Derivative. It is elegant
          because it requires no model of the system being controlled; it only needs to observe the
          <em> error</em> (the difference between desired and actual state) and correct it using
          three complementary mechanisms.
        </p>
        <p>
          Define the error at time t as:
        </p>
        <MathFormula label="Tracking Error">
          e(t) = desired_value(t) − actual_value(t)
        </MathFormula>
        <p>
          For lateral (steering) control, desired_value is the target lateral position within the
          lane, and actual_value is the car&apos;s current lateral position. A positive e(t) means
          the car is to the left of where it should be; a negative e(t) means it is to the right.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Three Terms Explained">
        <p>
          <strong>Proportional (P):</strong> apply a correction proportional to the current error.
          If the car is 0.3 m left of target, steer right in proportion to 0.3. The proportional
          term provides the bulk of the correction but, on its own, often leaves a
          <em> steady-state error</em> — the car hovers slightly off-centre because the correction
          weakens as the error shrinks.
        </p>
        <p>
          <strong>Integral (I):</strong> sum up all past errors over time. If the car has been
          consistently 0.05 m to the left for the last 2 seconds — perhaps because of a road
          camber — the integral term grows, applying an increasing correction that eventually
          eliminates the persistent offset. The I term removes steady-state error.
        </p>
        <p>
          <strong>Derivative (D):</strong> react to the rate of change of the error. If the error
          is shrinking rapidly (the car is converging on the target fast), the D term damps the
          correction to prevent overshoot. Without it, the car would oscillate left and right
          around the target. The D term provides stability.
        </p>
        <MathFormula label="PID Control Output">
          {'u(t) = Kp·e(t)  +  Ki·∫e(t)dt  +  Kd·(de/dt)'}
        </MathFormula>
        <p>
          Kp, Ki, and Kd are tuning constants set by engineers (or learned via optimisation) to
          match the vehicle&apos;s dynamics. The control output u(t) is the steering angle
          command sent to the actuator.
        </p>
      </ExplanationBox>

      <WorkedExample title="PID Steering Correction: One Time Step">
        <p>
          The car is heading straight down the city block. The planner&apos;s trajectory targets
          the lane centre (lateral offset = 0 m). The controller reads a lateral error of
          +0.20 m (car is 20 cm right of centre). Tuning constants: Kp = 1.5, Ki = 0.3, Kd = 0.8.
          The previous error was +0.24 m (the error is shrinking). The integral of error so far is
          0.05 m·s (a small accumulated leftward bias from road camber). Time step Δt = 0.01 s.
        </p>

        <CalcStep number={1}>
          Current error: e(t) = 0 − 0.20 = −0.20 m (car is right of centre, so error is negative)
        </CalcStep>
        <CalcStep number={2}>
          Proportional term: P = Kp · e(t) = 1.5 × (−0.20) = −0.30
        </CalcStep>
        <CalcStep number={3}>
          Integral term: I = Ki · ∫e dt ≈ Ki · (accumulated sum) = 0.3 × 0.05 = +0.015
          (the small positive integral reflects the car has been slightly left before, partially opposing the current correction)
        </CalcStep>
        <CalcStep number={4}>
          Derivative term: de/dt = (e(t) − e(t−1)) / Δt = (−0.20 − (−0.24)) / 0.01 = 0.04 / 0.01 = +4.0 m/s
          (error is decreasing, i.e., the car is converging — D term should damp the correction)
        </CalcStep>
        <CalcStep number={5}>
          D contribution: D = Kd · (de/dt) = 0.8 × 4.0 = +3.2
          (positive → opposes the steering command, preventing overshoot)
        </CalcStep>
        <CalcStep number={6}>
          Total control output: u(t) = P + I + D = −0.30 + 0.015 + 3.2 = +2.915 (arbitrary units)
          → maps to a small leftward steering correction
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The resulting command steers gently left to return toward lane centre. The D term
          dominates here because the car is already converging — PID prevents it from
          overshooting to the left. On the next iteration, the error will be smaller and the
          whole cycle repeats.
        </p>
      </WorkedExample>

      <ExplanationBox title="Longitudinal Control: Speed and Braking">
        <p>
          A second PID controller (or a more advanced model-predictive controller) runs in parallel
          for <em>longitudinal</em> control — managing speed. The error is the difference between
          desired speed and actual speed. The output commands throttle or brake.
        </p>
        <p>
          When the planner orders a stop for the pedestrian crossing, the longitudinal controller
          receives a target speed ramp-down from 40 km/h to 0 km/h over ~2 seconds. It applies
          progressive braking to match that profile smoothly — no panic stop, no rolling past the
          target stop point.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Closing the Sense–Plan–Act Loop">
        <p>
          This module closes the circle we opened in Module 1. Here is the full loop for our
          city-block scenario in the moment the pedestrian steps off the curb:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Sense:</strong> Camera, LiDAR, and radar detect motion at the crosswalk.
          </li>
          <li>
            <strong>Perceive:</strong> YOLO identifies &quot;pedestrian,&quot; bounding box tracked
            across frames, velocity estimated at 1.2 m/s toward the road.
          </li>
          <li>
            <strong>Fusion:</strong> Camera depth (7.8 m) and LiDAR range (8.1 m) fused to 8.08 m
            using inverse-variance weighting.
          </li>
          <li>
            <strong>Localise:</strong> ICP map-match confirms car is 0.10 m right of lane centre,
            heading 0.3° left of road bearing.
          </li>
          <li>
            <strong>Plan:</strong> Cost-function evaluation selects &quot;decelerate to stop&quot;
            trajectory; pedestrian&apos;s predicted path crosses at 2 s.
          </li>
          <li>
            <strong>Control:</strong> Longitudinal PID ramps brake pressure; lateral PID holds lane
            centre during deceleration.
          </li>
          <li>
            <strong>Act:</strong> Car comes to a smooth stop 2 m before the pedestrian&apos;s
            crossing path, 1.8 seconds after detection.
          </li>
        </ul>
        <p>
          The entire loop — from photons hitting the camera sensor to hydraulic pressure in the
          brake caliper — completes in under 100 ms. That is the autonomy stack in action.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You&apos;ve Learned">
        <p>
          Across eight modules you have traced the complete autonomy stack:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>The four-stage Sense–Perceive–Plan–Act loop and why it runs continuously.</li>
          <li>SAE Levels 0–5 and where today&apos;s deployed systems sit (Level 4).</li>
          <li>Five sensor modalities, each with distinct strengths and failure modes.</li>
          <li>CNN-based object detection (YOLO), semantic segmentation, and multi-object tracking.</li>
          <li>Inverse-variance sensor fusion and the Kalman filter&apos;s predict–update rhythm.</li>
          <li>HD maps, ICP map-matching, and SLAM for centimetre-accurate localisation.</li>
          <li>Global route planning (A*) and local trajectory optimisation via cost functions.</li>
          <li>PID closed-loop control for both lateral and longitudinal vehicle dynamics.</li>
        </ul>
        <p>
          You now have the mental model to read research papers, understand AV system architecture
          diagrams, and reason clearly about where autonomous driving succeeds and where the hard
          unsolved problems remain. The city-block car made it safely to the far end — and so did
          you.
        </p>
      </ExplanationBox>
    </div>
  );
}
