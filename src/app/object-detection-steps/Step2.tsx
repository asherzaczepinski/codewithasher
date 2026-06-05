'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What a Bounding Box Is">
        <p>
          A bounding box is the rectangle drawn around a detected object. It is the fundamental
          output unit of any detection system. Before we can train a model to predict boxes, we
          need a precise, unambiguous way to represent them mathematically.
        </p>
        <p>
          The standard representation uses four numbers plus two pieces of metadata:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>x</strong> — horizontal coordinate of the box&apos;s center</li>
          <li><strong>y</strong> — vertical coordinate of the box&apos;s center</li>
          <li><strong>w</strong> — width of the box</li>
          <li><strong>h</strong> — height of the box</li>
          <li><strong>class</strong> — what object is inside (e.g. &quot;car&quot; or &quot;pedestrian&quot;)</li>
          <li><strong>confidence</strong> — how certain the model is that this box contains an object</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="A single detection output">
        detection = (x, y, w, h, class, confidence)
      </MathFormula>

      <ExplanationBox title="Normalized Coordinates">
        <p>
          Images come in all sizes — 640×480, 1920×1080, 4K. If we stored raw pixel coordinates,
          a model trained on 640-wide images would produce nonsense on 1920-wide images.
        </p>
        <p>
          The solution is <strong>normalization</strong>: express every coordinate as a fraction of
          the image dimensions, so every value lives in the range [0, 1].
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>x and y are divided by the image width and height respectively</li>
          <li>w and h are also divided by the image width and height</li>
          <li>The top-left corner of the image is (0, 0); the bottom-right is (1, 1)</li>
        </ul>
        <p>
          This makes the representation resolution-independent. A car that fills the right half of
          any image always has x ≈ 0.75, w ≈ 0.5 — regardless of how many pixels that is.
        </p>
      </ExplanationBox>

      <MathFormula label="Normalization formulas">
        x_norm = x_pixels / image_width{'\n'}
        y_norm = y_pixels / image_height{'\n'}
        w_norm = box_width_pixels / image_width{'\n'}
        h_norm = box_height_pixels / image_height
      </MathFormula>

      <WorkedExample title="Encoding Our Street-Scene Boxes">
        <p>
          Our street photo is <strong>640 × 480 pixels</strong>. The scene has two cars and one
          pedestrian. Let&apos;s encode each one.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Car A (left side, large, close up):</p>
        <CalcStep number={1}>Pixel box: center at (160, 300), width = 200 px, height = 180 px</CalcStep>
        <CalcStep number={2}>x_norm = 160 / 640 = 0.25</CalcStep>
        <CalcStep number={3}>y_norm = 300 / 480 = 0.625</CalcStep>
        <CalcStep number={4}>w_norm = 200 / 640 = 0.3125</CalcStep>
        <CalcStep number={5}>h_norm = 180 / 480 = 0.375</CalcStep>
        <CalcStep number={6}>Result: (0.25, 0.625, 0.3125, 0.375, &quot;car&quot;, 0.97)</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Pedestrian (center, tall and narrow):</p>
        <CalcStep number={7}>Pixel box: center at (320, 220), width = 60 px, height = 200 px</CalcStep>
        <CalcStep number={8}>x_norm = 320 / 640 = 0.50</CalcStep>
        <CalcStep number={9}>y_norm = 220 / 480 = 0.458</CalcStep>
        <CalcStep number={10}>w_norm = 60 / 640 = 0.094</CalcStep>
        <CalcStep number={11}>h_norm = 200 / 480 = 0.417</CalcStep>
        <CalcStep number={12}>Result: (0.50, 0.458, 0.094, 0.417, &quot;pedestrian&quot;, 0.91)</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice how the pedestrian box is <em>tall and narrow</em> (w &lt; h) while the car box is
          <em> wide and squat</em> (w &gt; h). This shape difference will matter enormously when we
          get to anchor boxes.
        </p>
      </WorkedExample>

      <ExplanationBox title="What the Model Must Output">
        <p>
          For every object in the scene the model must predict all six values above. For our
          street photo that&apos;s 3 objects × 6 values = 18 numbers total. But here&apos;s the
          catch the model doesn&apos;t know in advance how many objects are present. The clever
          engineering required to handle this variable-length output is exactly what YOLO solves,
          and we&apos;ll get there in Part 2.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Here is how we represent a bounding box in code and convert between the two common
          coordinate formats: center-form (x, y, w, h) and corner-form (x1, y1, x2, y2).
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="detection.py"
        caption="A box as a named tuple plus a helper that converts center-form to corner-form."
        code={`import numpy as np
from collections import namedtuple

# ── Part 1: Bounding-box representation ──────────────────────────────────────

# We store every detection as a lightweight named tuple so fields are
# accessible by name (box.x, box.conf) rather than magic indices.
# All coordinates are NORMALISED to [0, 1] relative to the image size,
# so this representation works for any image resolution.
Box = namedtuple('Box', ['x', 'y', 'w', 'h', 'conf', 'cls'])

# Build the three boxes from our street-scene example (Step 2 worked example).
car_a      = Box(x=0.250, y=0.625, w=0.3125, h=0.375,  conf=0.97, cls='car')
car_b      = Box(x=0.780, y=0.600, w=0.280,  h=0.360,  conf=0.93, cls='car')
pedestrian = Box(x=0.500, y=0.458, w=0.094,  h=0.417,  conf=0.91, cls='pedestrian')

# ── Center-form  →  Corner-form conversion ───────────────────────────────────
# Center-form  (x, y, w, h): the network outputs this naturally.
# Corner-form  (x1, y1, x2, y2): needed for IoU arithmetic (Step 4).
# The conversion is just half-width / half-height arithmetic.

def center_to_corners(box):
    # Compute the four corners of the box.
    # x1, y1 are the TOP-LEFT corner; x2, y2 are the BOTTOM-RIGHT corner.
    half_w = box.w / 2.0   # half-width, added/subtracted from the center x
    half_h = box.h / 2.0   # half-height, added/subtracted from the center y
    x1 = box.x - half_w   # left edge
    y1 = box.y - half_h   # top edge  (y increases downward in image space)
    x2 = box.x + half_w   # right edge
    y2 = box.y + half_h   # bottom edge
    return np.array([x1, y1, x2, y2])

# Verify: Car A should span roughly x=[0.094, 0.406], y=[0.438, 0.813]
corners_a = center_to_corners(car_a)
print('Car A corners (x1 y1 x2 y2):', np.round(corners_a, 3))`}
      />
    </div>
  );
}
