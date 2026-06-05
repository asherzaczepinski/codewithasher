'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Duplicate Box Problem">
        <p>
          After one YOLO forward pass, many cells fire. A large car might span four grid cells,
          and all four of them predict a box centered near the car. You end up with four nearly
          identical boxes all claiming to detect the same vehicle. Left unchecked, the model would
          report four cars where there is only one.
        </p>
        <p>
          <strong>Non-Max Suppression</strong> (NMS) is the post-processing step that collapses
          those duplicates into a single box. It keeps the <em>best</em> box for each object and
          discards the rest.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The NMS Algorithm">
        <p>
          NMS is applied separately for each class. The steps for, say, the &quot;car&quot; class:
        </p>
        <ol style={{ lineHeight: '2.0' }}>
          <li>Collect all predicted boxes with class = &quot;car&quot; and confidence &gt; threshold (e.g. 0.5).</li>
          <li>Sort these boxes by confidence score, highest first.</li>
          <li>Take the top box (highest confidence). Add it to the output list. It is a confirmed detection.</li>
          <li>
            Compute IoU between that confirmed box and every remaining box. Any remaining box with
            IoU ≥ NMS threshold (e.g. 0.45) is a duplicate — suppress it (remove it from the list).
          </li>
          <li>Repeat from step 3 with the next remaining box, until the list is empty.</li>
        </ol>
        <p>
          The result is a clean set of non-overlapping boxes, one per real object.
        </p>
      </ExplanationBox>

      <MathFormula label="NMS suppression condition">
        Suppress box B if: IoU(best_box, B) ≥ nms_threshold  AND  class(B) = class(best_box)
      </MathFormula>

      <WorkedExample title="Running NMS on Our Street Scene">
        <p>
          After the YOLO forward pass, the model produces the following candidate &quot;car&quot;
          boxes (all above the confidence threshold of 0.5). We have four boxes — three around
          Car A and one around Car B.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Input boxes (sorted by confidence):</p>
        <CalcStep number={1}>Box A1: center (0.250, 0.625), conf = 0.97  ← highest confidence</CalcStep>
        <CalcStep number={2}>Box A2: center (0.240, 0.620), conf = 0.84  ← neighboring cell, same car</CalcStep>
        <CalcStep number={3}>Box A3: center (0.260, 0.630), conf = 0.71  ← another neighboring cell</CalcStep>
        <CalcStep number={4}>Box B1: center (0.780, 0.600), conf = 0.93  ← Car B, far side of street</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Round 1 — process Box A1 (conf = 0.97):</p>
        <CalcStep number={5}>Add A1 to confirmed detections. ✓</CalcStep>
        <CalcStep number={6}>Compute IoU(A1, A2): boxes are nearly identical — IoU ≈ 0.82</CalcStep>
        <CalcStep number={7}>0.82 ≥ 0.45 → suppress A2</CalcStep>
        <CalcStep number={8}>Compute IoU(A1, A3): also nearly the same car — IoU ≈ 0.73</CalcStep>
        <CalcStep number={9}>0.73 ≥ 0.45 → suppress A3</CalcStep>
        <CalcStep number={10}>Compute IoU(A1, B1): completely different location — IoU ≈ 0.01</CalcStep>
        <CalcStep number={11}>0.01 &lt; 0.45 → keep B1</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Round 2 — process Box B1 (conf = 0.93, only box remaining):</p>
        <CalcStep number={12}>Add B1 to confirmed detections. ✓</CalcStep>
        <CalcStep number={13}>No remaining boxes — NMS complete.</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          NMS collapsed four candidate boxes down to two confirmed detections — one per real car.
          The same process runs separately for the &quot;pedestrian&quot; class (one box survives there too),
          giving us the final three boxes for our street scene.
        </p>
      </WorkedExample>

      <ExplanationBox title="Choosing the NMS Threshold">
        <p>
          The NMS IoU threshold controls how aggressively duplicates are suppressed:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Low threshold (e.g. 0.3)</strong> — any two boxes with moderate overlap are
            considered duplicates. This produces clean output but can accidentally suppress
            two distinct objects that are very close together (e.g. two cars side by side).
          </li>
          <li>
            <strong>High threshold (e.g. 0.6)</strong> — only nearly-identical boxes are
            suppressed. Fewer false suppressions of nearby objects, but more duplicate boxes
            survive in the output.
          </li>
        </ul>
        <p>
          A typical value is <strong>0.45</strong>. Soft-NMS (a variant) replaces hard suppression
          with a gradual score decay proportional to IoU, which handles crowded scenes more
          gracefully at the cost of a slightly more complex implementation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The algorithm described above translates into a short loop. The key insight is that
          sorting by confidence first means we always promote the best surviving box in each round.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="detection.py"
        caption="non_max_suppression() runs the greedy keep-or-suppress loop described in this step, then verified on our four-box street scene."
        code={`# ── Part 4: Non-Max Suppression ──────────────────────────────────────────────
# (Requires the iou() function defined in Part 2.)

def non_max_suppression(boxes, iou_threshold=0.45):
    # 'boxes' is a list of Box namedtuples (all same class, already filtered
    # by confidence threshold before calling this function).
    # Returns a list containing only the surviving, non-duplicate boxes.

    # Step 1 — Sort descending by confidence so the best box is always first.
    # Python's sorted() is stable and returns a NEW list; we never mutate the input.
    remaining = sorted(boxes, key=lambda b: b.conf, reverse=True)

    confirmed = []   # boxes we have decided to keep

    while remaining:
        # Step 2 — The first box in 'remaining' is always the highest-confidence
        # box left.  Accept it as a real detection unconditionally.
        best = remaining.pop(0)
        confirmed.append(best)

        # Step 3 — Compare 'best' against every box still in 'remaining'.
        # Build a new list that contains ONLY the boxes that are NOT duplicates.
        survivors = []
        for candidate in remaining:
            overlap = iou(best, candidate)
            # If overlap is below the threshold, the candidate is probably a
            # DIFFERENT object — keep it for the next round.
            # If overlap is at or above the threshold, it is likely the SAME
            # object seen from a neighboring cell — suppress it silently.
            if overlap < iou_threshold:
                survivors.append(candidate)
            # (boxes with overlap >= threshold are simply dropped here)
        remaining = survivors   # next iteration processes the trimmed list

    return confirmed


# ── Test with the four-box street-scene example from Step 7 ──────────────────
from collections import namedtuple
Box = namedtuple('Box', ['x', 'y', 'w', 'h', 'conf', 'cls'])

car_candidates = [
    Box(x=0.250, y=0.625, w=0.31, h=0.37, conf=0.97, cls='car'),   # A1 — real Car A
    Box(x=0.240, y=0.620, w=0.30, h=0.36, conf=0.84, cls='car'),   # A2 — duplicate
    Box(x=0.260, y=0.630, w=0.32, h=0.38, conf=0.71, cls='car'),   # A3 — duplicate
    Box(x=0.780, y=0.600, w=0.28, h=0.36, conf=0.93, cls='car'),   # B1 — real Car B
]

kept = non_max_suppression(car_candidates, iou_threshold=0.45)
print(f'Boxes in: {len(car_candidates)}   Boxes out: {len(kept)}')
for b in kept:
    print(f'  center=({b.x:.3f}, {b.y:.3f})  conf={b.conf}')
# Expected: 2 boxes — A1 (conf 0.97) and B1 (conf 0.93).
# A2 and A3 are suppressed because IoU with A1 exceeds 0.45.`}
      />
    </div>
  );
}
