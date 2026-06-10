'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The YOLO Insight">
        <p>
          &quot;You Only Look Once&quot; is not just a catchy name — it describes a concrete
          architectural decision that makes real-time detection possible. Instead of running a
          classifier thousands of times (sliding window) or first finding candidate regions and
          then classifying them (R-CNN), YOLO treats detection as a single <strong>regression
          problem</strong>: feed the whole image into a CNN exactly once, and have the network
          output all bounding boxes and class labels simultaneously.
        </p>
        <p>
          One forward pass. All boxes. Done.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Dividing the Image Into a Grid">
        <p>
          To give the single output a fixed structure, YOLO divides the input image into an{' '}
          <strong>S × S grid</strong>. A common choice is 7×7 or 13×13 depending on the YOLO
          version. Each grid cell is responsible for detecting objects whose <em>center</em> falls
          inside that cell.
        </p>
        <p>
          Critically, the grid is <em>conceptual</em> — the CNN processes the full image, not
          individual cells. The grid is just a way to organize the output tensor.
        </p>
      </ExplanationBox>

      <MathFormula label="YOLO output tensor shape">
        Output shape: S × S × [B × (x, y, w, h, confidence) + C]{'\n'}
        {'\n'}
        S = grid size (e.g. 7){'\n'}
        B = boxes predicted per cell (e.g. 2){'\n'}
        C = number of classes (e.g. 20 for PASCAL VOC)
      </MathFormula>

      <ExplanationBox title="What Each Cell Predicts">
        <p>
          For each of the S×S cells the network predicts:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>B bounding boxes</strong>, each with (x, y, w, h, confidence). The x and y
            coordinates are relative to the cell&apos;s top-left corner (so they live in [0, 1]
            within the cell). The w and h are relative to the whole image.
          </li>
          <li>
            <strong>C class probabilities</strong> — one probability per class, shared across all
            B boxes in the cell. So the cell says &quot;if there&apos;s an object here, it&apos;s
            probably a car&quot; once, not separately for each box.
          </li>
          <li>
            <strong>Confidence score</strong> per box — this is the model&apos;s estimate of
            Pr(object) × IoU(predicted, ground truth). High confidence means: &quot;I&apos;m
            fairly sure there&apos;s something here and my box is accurate.&quot;
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Mapping Our Street Scene onto a 7×7 Grid">
        <p>
          Our 640×480 street photo, placed on a 7×7 grid. Each cell covers roughly 91×69 pixels.
        </p>

        <CalcStep number={1}>Cell width  = 640 / 7 ≈ 91.4 px per cell horizontally</CalcStep>
        <CalcStep number={2}>Cell height = 480 / 7 ≈ 68.6 px per cell vertically</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Car A — center at pixel (160, 300):</p>
        <CalcStep number={3}>Grid column = ⌊160 / 91.4⌋ = ⌊1.75⌋ = 1  (0-indexed)</CalcStep>
        <CalcStep number={4}>Grid row    = ⌊300 / 68.6⌋ = ⌊4.37⌋ = 4</CalcStep>
        <CalcStep number={5}>Responsible cell: (row=4, col=1) — this cell must predict Car A</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Pedestrian — center at pixel (320, 220):</p>
        <CalcStep number={6}>Grid column = ⌊320 / 91.4⌋ = ⌊3.50⌋ = 3</CalcStep>
        <CalcStep number={7}>Grid row    = ⌊220 / 68.6⌋ = ⌊3.21⌋ = 3</CalcStep>
        <CalcStep number={8}>Responsible cell: (row=3, col=3) — this cell must predict the pedestrian</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Each cell owns the detection of objects centered within it. Two different cells handle
          two different objects, even though the objects may physically overlap on screen.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why This Is Fast">
        <p>
          The entire output tensor — 7×7×30 numbers for the original YOLO with B=2 and C=20 — is
          produced in a single forward pass through a CNN (YOLO v1 used a GoogLeNet-inspired
          backbone). No second network, no proposal generation, no repeated crops.
        </p>
        <p>
          The original YOLO ran at <strong>45 frames per second</strong> on a Titan X GPU. That&apos;s
          fast enough for real-time video. The Fast YOLO variant hit 155 fps. Compare this to the
          sliding window approach from Step 3 that took hundreds of seconds per frame.
        </p>
        <p>
          The speed comes at a cost: each cell can only predict B boxes and only for one class.
          If two object centers fall in the same cell, YOLO v1 can only detect one of them.
          Later versions (v2 onward) address this with anchor boxes — which we cover next.
        </p>
      </ExplanationBox>
    </div>
  );
}
