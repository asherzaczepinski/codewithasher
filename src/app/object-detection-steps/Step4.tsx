'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Core Question: How Good Is My Box?">
        <p>
          Once a model predicts a bounding box, we need a number that answers: &quot;how closely
          does this predicted box match the ground-truth box a human drew?&quot; That number needs
          to be 1.0 for a perfect match, 0.0 for no overlap at all, and something sensible in
          between.
        </p>
        <p>
          That number is <strong>Intersection over Union</strong>, universally written as{' '}
          <strong>IoU</strong>. It is used in three places: training (as part of the loss
          function), evaluation (to decide whether a detection &quot;counts&quot; as correct), and
          non-max suppression (coming up in Step 7).
        </p>
      </ExplanationBox>

      <MathFormula label="Intersection over Union (IoU)">
        IoU = Area of Intersection / Area of Union
      </MathFormula>

      <ExplanationBox title="Visualizing Intersection and Union">
        <p>
          Imagine two rectangles on a canvas — the ground-truth box (drawn by a human annotator)
          and the predicted box (output by the model).
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Intersection</strong> — the region covered by <em>both</em> boxes
            simultaneously. If the boxes barely overlap, the intersection is tiny. If one box is
            completely inside the other, the intersection equals the smaller box.
          </li>
          <li>
            <strong>Union</strong> — the region covered by <em>either</em> box (or both). It is
            the total area painted if you fill both boxes. Union = Area A + Area B − Intersection
            (subtract intersection once because we counted it twice).
          </li>
        </ul>
        <p>
          Dividing intersection by union normalizes the score. A perfect prediction (boxes
          identical) gives IoU = area / area = 1.0. No overlap at all gives IoU = 0 / union = 0.
        </p>
      </ExplanationBox>

      <MathFormula label="Union from individual areas">
        Union = Area_predicted + Area_groundTruth − Intersection
      </MathFormula>

      <ExplanationBox title="Computing Intersection Area from Coordinates">
        <p>
          Given two axis-aligned rectangles, the intersection (if it exists) is itself an
          axis-aligned rectangle. Its corners are found by taking the inner corners of the two boxes.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Left edge of intersection: max(left_A, left_B)</li>
          <li>Right edge: min(right_A, right_B)</li>
          <li>Top edge: max(top_A, top_B)  — assuming y increases downward</li>
          <li>Bottom edge: min(bottom_A, bottom_B)</li>
        </ul>
        <p>
          If right &lt; left or bottom &lt; top, the boxes don&apos;t overlap and intersection = 0.
          Otherwise, intersection width = right − left, intersection height = bottom − top, and
          area = width × height.
        </p>
      </ExplanationBox>

      <WorkedExample title="Full IoU Calculation for Our Street Scene">
        <p>
          The model predicts a box around Car A. The human annotator drew a slightly different box.
          Both are expressed in pixels on our 640×480 image. We use pixel coordinates here for
          clarity (the math is identical for normalized coordinates).
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Ground-truth box (human label):</p>
        <CalcStep number={1}>Center: (160, 300), width = 200 px, height = 180 px</CalcStep>
        <CalcStep number={2}>Left = 160 − 100 = 60,  Right = 160 + 100 = 260</CalcStep>
        <CalcStep number={3}>Top  = 300 − 90  = 210,  Bottom = 300 + 90  = 390</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Predicted box (model output):</p>
        <CalcStep number={4}>Center: (175, 310), width = 210 px, height = 170 px</CalcStep>
        <CalcStep number={5}>Left = 175 − 105 = 70,  Right = 175 + 105 = 280</CalcStep>
        <CalcStep number={6}>Top  = 310 − 85  = 225,  Bottom = 310 + 85  = 395</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Intersection rectangle:</p>
        <CalcStep number={7}>Inter_left   = max(60, 70)   = 70</CalcStep>
        <CalcStep number={8}>Inter_right  = min(260, 280) = 260</CalcStep>
        <CalcStep number={9}>Inter_top    = max(210, 225) = 225</CalcStep>
        <CalcStep number={10}>Inter_bottom = min(390, 395) = 390</CalcStep>
        <CalcStep number={11}>Inter_width  = 260 − 70  = 190 px</CalcStep>
        <CalcStep number={12}>Inter_height = 390 − 225 = 165 px</CalcStep>
        <CalcStep number={13}>Area_intersection = 190 × 165 = <strong>31,350 px²</strong></CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Individual box areas:</p>
        <CalcStep number={14}>Area_groundTruth = 200 × 180 = 36,000 px²</CalcStep>
        <CalcStep number={15}>Area_predicted   = 210 × 170 = 35,700 px²</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Union and IoU:</p>
        <CalcStep number={16}>Area_union = 36,000 + 35,700 − 31,350 = <strong>40,350 px²</strong></CalcStep>
        <CalcStep number={17}>IoU = 31,350 / 40,350 = <strong>0.777</strong></CalcStep>

        <p style={{ marginTop: '1rem' }}>
          An IoU of <strong>0.777</strong> is a solid prediction. In most benchmarks, a detection
          is counted as correct when IoU ≥ 0.5, and a high-quality detection requires IoU ≥ 0.75.
          Our model is nearly there with its first guess — after training it will do even better.
        </p>
      </WorkedExample>

      <ExplanationBox title="IoU as a Threshold">
        <p>
          IoU isn&apos;t just used for measuring quality. It&apos;s used as a hard threshold in
          two critical algorithms:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Evaluation</strong> — the standard COCO benchmark reports AP at IoU thresholds
            of 0.5 and 0.75. A detector is only credited with finding an object if its box has
            IoU ≥ threshold with the ground-truth box.
          </li>
          <li>
            <strong>Non-Max Suppression</strong> — when the model emits many overlapping boxes
            around the same car, we use IoU to decide which boxes are duplicates. Any two boxes
            with IoU above a threshold (typically 0.45) are considered to be detecting the same
            object, so we keep only the highest-confidence one.
          </li>
        </ul>
        <p>
          We&apos;ll use IoU heavily in Step 7. For now, the key takeaway is simple: IoU is the
          universal ruler for measuring how well boxes agree.
        </p>
      </ExplanationBox>

    </div>
  );
}
