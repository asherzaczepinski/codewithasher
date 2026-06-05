'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Shape Problem">
        <p>
          Objects in the real world come in wildly different shapes. A standing pedestrian is
          roughly 3× taller than they are wide. A car viewed from the side is 2–3× wider than it
          is tall. A bicycle is tall and narrow. A bus is enormous and wide.
        </p>
        <p>
          If each grid cell just predicts raw (x, y, w, h) values, the network starts from nothing
          every time. It must somehow learn, from scratch, that &quot;when there&apos;s a pedestrian,
          output a tall narrow box.&quot; This is slow to learn and unstable.
        </p>
        <p>
          <strong>Anchor boxes</strong> (also called <em>prior boxes</em>) solve this by giving
          the network a head start: a set of pre-defined box shapes derived from the training data.
          The network then only needs to predict <em>how much to adjust</em> each anchor — a much
          easier task.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Defining Anchors">
        <p>
          Anchors are chosen before training by running k-means clustering on all the ground-truth
          box shapes (widths and heights) in the training set. The cluster centroids become the
          anchor shapes.
        </p>
        <p>
          For example, YOLOv2 uses 5 anchors per cell. For a dataset with cars, pedestrians, and
          bicycles you might end up with anchors like:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Anchor 1: w=0.10, h=0.40 — tall narrow (pedestrian)</li>
          <li>Anchor 2: w=0.30, h=0.18 — wide squat (car, near)</li>
          <li>Anchor 3: w=0.12, h=0.12 — small square (bicycle wheel, distant car)</li>
          <li>Anchor 4: w=0.55, h=0.22 — very wide (bus / truck)</li>
          <li>Anchor 5: w=0.20, h=0.35 — medium tall (cyclist)</li>
        </ul>
        <p>
          These are normalized widths and heights (as a fraction of the full image). Each cell now
          predicts one set of adjustments <em>per anchor</em>, instead of one raw box.
        </p>
      </ExplanationBox>

      <MathFormula label="Anchor box offset predictions">
        Network predicts: (tₓ, tᵧ, tᵥ, t_h, confidence) per anchor{'\n'}
        {'\n'}
        Final box center:  bₓ = sigmoid(tₓ) + cell_col{'\n'}
        Final box center:  bᵧ = sigmoid(tᵧ) + cell_row{'\n'}
        Final box width:   bᵥ = anchor_w × exp(tᵥ){'\n'}
        Final box height:  b_h = anchor_h × exp(t_h)
      </MathFormula>

      <ExplanationBox title="Why Sigmoid and Exp?">
        <p>
          The formulas above look a bit odd at first. Here&apos;s the reasoning behind each piece:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>sigmoid(tₓ) and sigmoid(tᵧ)</strong> — sigmoid squashes any real number into
            (0, 1). Adding the result to the cell column/row index ensures the predicted center
            stays <em>within its cell</em> — it can&apos;t jump to a neighboring cell by predicting
            a huge offset.
          </li>
          <li>
            <strong>exp(tᵥ) and exp(t_h)</strong> — exp is always positive, so the predicted
            scale factor is always positive (boxes can&apos;t have negative dimensions). When the
            network predicts t=0, exp(0)=1, so the box defaults exactly to the anchor size with
            no adjustment needed.
          </li>
        </ul>
        <p>
          This parameterization makes training more stable: instead of learning to output
          &quot;width = 0.31,&quot; the network learns to output &quot;this anchor is about right,
          just scale it by 1.05&quot; — a much smaller adjustment.
        </p>
      </ExplanationBox>

      <WorkedExample title="Decoding an Anchor Prediction for Car A">
        <p>
          The network processes the cell at (row=4, col=1) and produces a prediction for Anchor 2
          (the wide-squat car anchor: w=0.30, h=0.18). The raw network outputs are:
        </p>

        <CalcStep number={1}>tₓ = 0.75,  tᵧ = −0.30,  tᵥ = 0.118,  t_h = −0.054</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Decode center position:</p>
        <CalcStep number={2}>sigmoid(0.75) = 1 / (1 + e^(−0.75)) ≈ 0.679</CalcStep>
        <CalcStep number={3}>bₓ = 0.679 + 1 (cell_col) = 1.679  → divide by 7 → x_norm ≈ 0.240</CalcStep>
        <CalcStep number={4}>sigmoid(−0.30) ≈ 0.426</CalcStep>
        <CalcStep number={5}>bᵧ = 0.426 + 4 (cell_row) = 4.426  → divide by 7 → y_norm ≈ 0.632</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Decode width and height:</p>
        <CalcStep number={6}>bᵥ = 0.30 × exp(0.118) = 0.30 × 1.125 ≈ 0.338</CalcStep>
        <CalcStep number={7}>b_h = 0.18 × exp(−0.054) = 0.18 × 0.947 ≈ 0.170</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Final predicted box: center (0.240, 0.632), width 0.338, height 0.170.
          The ground-truth Car A box was (0.250, 0.625, 0.3125, 0.375). The center is very close;
          the height is off — the network still needs training to nail the vertical extent.
          But notice that even with random-ish offsets, the wide-car anchor gave us a reasonable
          starting point far better than a square or a tall narrow box would have.
        </p>
      </WorkedExample>

      <ExplanationBox title="Multiple Anchors Per Cell">
        <p>
          Because each cell predicts offsets for <em>every</em> anchor independently, a single
          cell can simultaneously detect both a pedestrian (via the tall-narrow anchor) and a car
          (via the wide-squat anchor) — even if their centers both happen to fall in the same cell.
          This is the key improvement over YOLO v1&apos;s limit of one object per cell.
        </p>
        <p>
          During training, each ground-truth box is assigned to the anchor whose shape has the
          highest IoU with it. Only that anchor&apos;s prediction is trained to match the object;
          the other anchors in the cell are ignored for that particular example.
        </p>
      </ExplanationBox>

    </div>
  );
}
