'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Obvious First Idea">
        <p>
          We already know how to classify a single image — a CNN takes in the whole image and
          outputs a label. So the most obvious approach to detection is: <em>just run the
          classifier on every possible crop of the image</em>. Slide a fixed-size window across
          every position, classify what&apos;s inside, record any positive hits.
        </p>
        <p>
          This approach is called the <strong>sliding window</strong> method. It works in
          principle. Understanding exactly why it fails in practice motivates every smarter
          algorithm that follows.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How the Slide Works">
        <p>
          Pick a window size — say 64×64 pixels. Starting from the top-left corner of the image,
          place the window, run the classifier, step right by a stride (e.g. 8 pixels), repeat.
          When you reach the right edge, move down by one stride and start again from the left.
          After exhausting all positions at one scale, shrink the window (or equivalently, upscale
          the image) and repeat.
        </p>
        <p>
          You need multiple scales because a car that&apos;s 200 pixels wide won&apos;t fit in a
          64-pixel window, and a car 30 pixels wide won&apos;t fill it either.
        </p>
      </ExplanationBox>

      <MathFormula label="Number of window positions (one scale)">
        positions = ⌊(W − w) / stride + 1⌋ × ⌊(H − h) / stride + 1⌋
      </MathFormula>

      <WorkedExample title="Counting the Classifier Calls">
        <p>
          Let&apos;s count how many times we&apos;d run the classifier on our 640×480 street photo,
          using just three window sizes and a stride of 8.
        </p>

        <CalcStep number={1}>Window 64×64, stride 8: positions_x = (640−64)/8 + 1 = 72, positions_y = (480−64)/8 + 1 = 53</CalcStep>
        <CalcStep number={2}>64×64 total positions: 72 × 53 = 3,816</CalcStep>
        <CalcStep number={3}>Window 128×128, stride 8: positions_x = (640−128)/8 + 1 = 65, positions_y = (480−128)/8 + 1 = 45</CalcStep>
        <CalcStep number={4}>128×128 total positions: 65 × 45 = 2,925</CalcStep>
        <CalcStep number={5}>Window 256×256, stride 8: positions_x = (640−256)/8 + 1 = 49, positions_y = (480−256)/8 + 1 = 29</CalcStep>
        <CalcStep number={6}>256×256 total positions: 49 × 29 = 1,421</CalcStep>
        <CalcStep number={7}>Grand total classifier calls: 3,816 + 2,925 + 1,421 = <strong>8,162</strong></CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Over <strong>8,000 full CNN forward passes</strong> for just three scales and a coarse
          stride. A real system needs 10+ scales and a stride of 1–4 pixels. That pushes the count
          past <strong>1 million</strong> classifier calls per frame.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why This Is Hopelessly Slow">
        <p>
          A modern CNN takes roughly 5–50 ms per inference on a GPU. At 8,000 calls that&apos;s
          40–400 seconds per frame. Video runs at 30 frames per second. We need detection in under
          33 ms total — not 400 seconds. Sliding window is off by four orders of magnitude.
        </p>
        <p>
          Beyond raw speed, there are further problems:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Aspect ratio blindness</strong> — a square window poorly fits a tall pedestrian
            or a wide car lying on its side. You&apos;d need to add rectangular windows too, which
            multiplies the count again.
          </li>
          <li>
            <strong>Redundant computation</strong> — neighboring windows share almost all their
            pixels, yet each triggers a completely independent forward pass.
          </li>
          <li>
            <strong>Threshold tuning</strong> — every window returns a score, so you need to
            decide which score counts as a detection. Too low and you get thousands of false
            positives; too high and you miss real objects.
          </li>
        </ul>
        <p>
          Two families of solutions emerged. <strong>Region proposal networks</strong> (R-CNN and
          its descendants) first use a fast algorithm to suggest ~2,000 candidate regions, then
          classify only those. <strong>Single-shot detectors</strong> like YOLO skip proposals
          entirely and predict boxes directly in one forward pass. YOLO is dramatically faster,
          which is why it dominates real-time applications.
        </p>
      </ExplanationBox>
    </div>
  );
}
