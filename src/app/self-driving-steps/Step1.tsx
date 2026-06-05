'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="The Hardest Problem in Applied AI">
        <p>
          A self-driving car must, in real time, figure out where it is in the world, understand
          everything happening around it, decide what to do next, and then physically execute that
          decision — all without a human in the loop. Miss any one step and the car crashes.
        </p>
        <p>
          This is not a single AI model. It is a tightly coupled <em>system of systems</em>, each
          demanding state-of-the-art engineering. That&apos;s what makes autonomous driving one of
          the hardest machine-learning problems ever tackled.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Autonomy Stack: Sense → Perceive → Plan → Act">
        <p>
          Every self-driving car — from a Waymo robotaxi to an experimental university prototype —
          runs roughly the same four-stage loop:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Sense</strong> — raw data floods in from cameras, LiDAR, radar, and GPS dozens
            of times per second.
          </li>
          <li>
            <strong>Perceive</strong> — algorithms interpret that raw data into a structured world
            model: where are the lane lines, the pedestrians, the red light?
          </li>
          <li>
            <strong>Plan</strong> — the car decides on a trajectory: slow down, change lanes, stop
            at the crosswalk.
          </li>
          <li>
            <strong>Act</strong> — low-level controllers translate the plan into precise steering
            angle, throttle percentage, and brake pressure.
          </li>
        </ul>
        <p>
          This loop runs continuously — typically 10–100 times per second — so the car always has
          an up-to-date response to a changing environment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: One City Block">
        <p>
          Throughout this course we follow a single autonomous car navigating one city block. It
          starts at a green light, drives past a double-parked delivery truck, yields to a
          pedestrian stepping off the curb, and parks smoothly at the far end.
        </p>
        <p>
          Every module adds one layer of understanding: by the end you will be able to trace
          exactly how the car sensed the pedestrian, recognised them, fused noisy distance
          estimates to localise them precisely, planned a path around them, and corrected its
          steering in real time to stay on that path.
        </p>
        <p>
          The perception layer (Modules 3–5) builds directly on the CNNs and YOLO object-detection
          ideas covered in the Neural Networks and Computer Vision courses — we will reference
          those connections explicitly so the full picture clicks together.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why This Is Hard">
        <p>
          Consider what a human driver handles effortlessly: a toddler darting between parked cars,
          a faded stop sign half-covered by a tree branch, an intersection with broken traffic
          lights, rain reducing visibility to 30 metres. Each scenario requires generalising from
          prior experience to a novel situation — and a mistake at 50 km/h can be fatal.
        </p>
        <p>
          Autonomous systems must handle all of this with <strong>guaranteed reliability</strong>,
          not just average-case performance. An accuracy of 99.9 % sounds impressive until you
          realise a car driving 10 hours a day makes roughly 36 000 decisions per second — at 99.9 %
          accuracy that is still 36 wrong decisions every second. The bar is extreme.
        </p>
      </ExplanationBox>
    </div>
  );
}
