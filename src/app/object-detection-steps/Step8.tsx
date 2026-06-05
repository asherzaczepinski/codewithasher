'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Assembling the Complete Pipeline">
        <p>
          Every piece is now in place. Let&apos;s trace our street photo — two cars and one
          pedestrian — through the full YOLO pipeline from raw pixels to final annotated boxes,
          connecting every step in this course.
        </p>
      </ExplanationBox>

      <MathFormula label="The five stages of YOLO inference">
        Image → CNN Backbone → Grid of Predictions → Confidence Filter → NMS → Final Boxes
      </MathFormula>

      <WorkedExample title="Tracing Our Street Photo End to End">
        <p style={{ fontWeight: 600 }}>Stage 1 — Input image:</p>
        <CalcStep number={1}>640×480 RGB street photo. Resize to model input (e.g. 416×416 for YOLOv3).</CalcStep>
        <CalcStep number={2}>Normalize pixel values from [0, 255] to [0, 1].</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Stage 2 — CNN backbone forward pass:</p>
        <CalcStep number={3}>The image passes through a deep CNN (e.g. Darknet-53 for YOLOv3).</CalcStep>
        <CalcStep number={4}>The network extracts features at multiple scales via convolutional layers — same convolution mechanics you know from CNNs.</CalcStep>
        <CalcStep number={5}>Output: a 13×13×255 tensor (for 3 anchors, 80 COCO classes: 3×(5+80)=255).</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Stage 3 — Decode grid predictions:</p>
        <CalcStep number={6}>For each of the 13×13 = 169 cells, decode 3 anchor predictions using sigmoid + exp offsets (Step 6).</CalcStep>
        <CalcStep number={7}>Total raw boxes: 169 × 3 = 507 candidate boxes.</CalcStep>
        <CalcStep number={8}>Car A&apos;s cell (row≈7, col≈3 on a 13×13 grid) fires its wide-car anchor with confidence 0.97.</CalcStep>
        <CalcStep number={9}>Pedestrian&apos;s cell fires its tall-narrow anchor with confidence 0.91.</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Stage 4 — Confidence threshold filter:</p>
        <CalcStep number={10}>Multiply objectness score × class probability for each box.</CalcStep>
        <CalcStep number={11}>Discard any box with score &lt; 0.5. Most of the 507 boxes are empty cells — they go away.</CalcStep>
        <CalcStep number={12}>Remaining: ~8–15 candidate boxes across all classes (a few near each real object).</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Stage 5 — Non-Max Suppression:</p>
        <CalcStep number={13}>Run NMS separately for each class (Step 7).</CalcStep>
        <CalcStep number={14}>&quot;Car&quot; NMS: 4 candidates → 2 survivors (one per car). Duplicates around Car A suppressed via high IoU ≥ 0.45.</CalcStep>
        <CalcStep number={15}>&quot;Pedestrian&quot; NMS: 2 candidates → 1 survivor.</CalcStep>
        <CalcStep number={16}>Final output: 3 boxes — Car A (0.250, 0.625, 0.31, 0.375, conf 0.97), Car B (0.780, 0.600, 0.28, 0.36, conf 0.93), Pedestrian (0.500, 0.458, 0.094, 0.417, conf 0.91).</CalcStep>
      </WorkedExample>

      <ExplanationBox title="Speed vs Accuracy Trade-offs">
        <p>
          YOLO is explicitly designed for speed. Here&apos;s how the major versions evolved:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>YOLOv1 (2016)</strong> — 7×7 grid, 2 anchors, 20 classes. 45 fps on a Titan X.
            One class per cell was the key limitation.
          </li>
          <li>
            <strong>YOLOv2 / YOLO9000 (2016)</strong> — introduced anchor boxes (k-means),
            batch normalization, multi-scale training. 67 fps, significantly better accuracy.
            YOLO9000 could detect 9,000 classes by combining detection and classification datasets.
          </li>
          <li>
            <strong>YOLOv3 (2018)</strong> — multi-scale predictions (3 grid sizes: 13×13, 26×26,
            52×52) for better small-object detection. Darknet-53 backbone. Still ~30 fps at
            full accuracy on a V100.
          </li>
          <li>
            <strong>YOLOv4 / v5 / v8 / v11 (2020–2024)</strong> — incremental improvements:
            better data augmentation, improved loss functions, mosaic augmentation, CSP blocks.
            Each generation pushes the accuracy/speed Pareto frontier further.
          </li>
        </ul>
        <p>
          In practice, YOLO variants dominate real-time applications: self-driving cars, drone
          navigation, sports analytics, retail inventory counting, and security cameras. When the
          task demands processing video at 30+ fps on constrained hardware, YOLO&apos;s single-pass
          design is the right tool.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Now Know">
        <p>
          You&apos;ve built up the full object detection stack from scratch:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Bounding boxes</strong> — the (x, y, w, h, class, confidence) representation and why coordinates are normalized.</li>
          <li><strong>Sliding window</strong> — the naive approach and precisely why it fails (millions of forward passes, too slow by 4 orders of magnitude).</li>
          <li><strong>IoU</strong> — the universal ruler for measuring box quality, computed as intersection / union.</li>
          <li><strong>YOLO grid</strong> — dividing the image into S×S cells so one forward pass covers everything, with each cell responsible for objects whose center falls inside it.</li>
          <li><strong>Anchor boxes</strong> — pre-defined shape templates from k-means clustering, with sigmoid+exp offset predictions to decode the final box.</li>
          <li><strong>Non-Max Suppression</strong> — iteratively keeping the best box and suppressing overlapping duplicates via IoU threshold.</li>
          <li><strong>Full pipeline</strong> — image → CNN → 507 raw boxes → confidence filter → NMS → 3 clean boxes.</li>
        </ul>
        <p>
          Every car that gets boxed in a self-driving car&apos;s camera feed, every person tagged in
          a security system, every ball tracked in a sports broadcast — they all run a variant of
          this exact pipeline.
        </p>
      </ExplanationBox>
    </div>
  );
}
