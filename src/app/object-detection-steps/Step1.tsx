'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          You&apos;ve probably seen demos where a computer draws boxes around every car, person, and
          traffic light in a live video feed — in real time. That&apos;s object detection. This course
          breaks down exactly how it works, including the algorithm that made real-time detection
          possible: <strong>YOLO</strong> (You Only Look Once).
        </p>
        <p>
          We&apos;ll build up every idea from scratch. By the end you&apos;ll understand not just
          <em> what</em> YOLO does, but <em>why</em> each design choice was necessary.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Four Tasks, One Spectrum">
        <p>
          Computer vision has four closely related tasks. They&apos;re often confused, so let&apos;s
          pin them down precisely with our running example: a camera mounted on a self-driving car
          looking at a busy street.
        </p>
        <p>
          <strong>Classification</strong> — The model looks at the whole image and answers one
          question: &quot;what is the dominant object here?&quot; Output: a single label, e.g.
          <em> car</em>. No position, no count. A street photo with ten cars still outputs just
          &quot;car.&quot; Useful for sorting albums; useless for driving.
        </p>
        <p>
          <strong>Localization</strong> — The model answers &quot;where is the one main object?&quot;
          Output: a single label <em>and</em> a bounding box. Still assumes one object per image.
          Better, but a real street has dozens of objects.
        </p>
        <p>
          <strong>Detection</strong> — The model finds <em>every</em> object of interest in the image
          and draws a box around each one. Output: a list of (label, box, confidence) triples.
          This is what self-driving cars need. This is what YOLO does.
        </p>
        <p>
          <strong>Segmentation</strong> — Goes further still: instead of a box, the model labels
          every individual pixel. Output: a colored mask overlaid on the image. More precise, but
          also much more compute-intensive. We won&apos;t cover segmentation here, but it&apos;s the
          natural next step after detection.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Detection Is Hard">
        <p>
          Classification asks one question and gives one answer. Detection must ask and answer that
          question for every possible location and every possible size of object, all at once.
          Consider the challenges:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Variable count</strong> — a scene might have 0 cars or 40. The output
            size isn&apos;t fixed.
          </li>
          <li>
            <strong>Scale variation</strong> — a car close to the camera occupies half the image; a
            car far away occupies a tiny patch. The same object, wildly different sizes.
          </li>
          <li>
            <strong>Overlapping objects</strong> — pedestrians walk in front of cars; you need to
            detect both separately.
          </li>
          <li>
            <strong>Speed</strong> — a self-driving car needs detections many times per second;
            slow algorithms are literally dangerous.
          </li>
        </ul>
        <p>
          Every module in this course addresses one or more of these challenges head-on.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example">
        <p>
          Throughout this course we use a single concrete scene: a street photo containing
          <strong> two cars</strong> and <strong>one pedestrian</strong>. The goal is for our model
          to output three bounding boxes — one tight around each object — labelled correctly with
          a confidence score attached to each.
        </p>
        <p>
          Every formula, every algorithm step, every worked example will refer back to this scene.
          By the time we finish the full YOLO pipeline, you&apos;ll be able to trace exactly what
          happens to that image from the moment it enters the network to the moment the final boxes
          appear on screen.
        </p>
      </ExplanationBox>
    </div>
  );
}
