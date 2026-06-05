'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Why Vision is a Hard Problem">
        <p>
          Humans recognize a handwritten &quot;7&quot; in milliseconds without thinking about it. But
          a computer only sees a grid of numbers — and those numbers change dramatically depending on
          how the digit is positioned, rotated, or how thick the pen stroke was. Two images of the
          same digit can look completely different at the pixel level.
        </p>
        <p>
          This is the core challenge of computer vision: the same real-world object produces wildly
          different raw pixel values depending on lighting, angle, size, and position. Any system
          that tries to match pixels directly will fail immediately.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How CNNs Changed Everything">
        <p>
          Convolutional Neural Networks (CNNs) solved this problem by borrowing an insight from
          biology: the visual cortex responds to local patches of an image, not the entire scene at
          once. A neuron in your brain fires when it detects an edge in a small region of your
          visual field — it doesn&apos;t care where in the image that edge appears.
        </p>
        <p>
          CNNs mimic this. Instead of looking at every pixel globally, they slide small filters
          across the image, detecting local patterns — edges, corners, textures — wherever they
          appear. This makes them robust to position and scale shifts, and drastically reduces the
          number of parameters needed.
        </p>
        <p>
          Today, CNNs power face recognition on your phone, medical image analysis, self-driving car
          perception, and yes — reading handwritten digits on envelopes at postal sorting facilities.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example: Handwritten Digits">
        <p>
          Throughout this course we will work with one concrete example: recognizing handwritten
          digits, specifically the digit <strong>7</strong> written on a small grayscale grid. This
          is intentionally simple — small enough to do the math by hand, real enough to teach every
          concept that scales to full image recognition systems.
        </p>
        <p>
          By the end you will be able to trace a digit image all the way through a CNN — from raw
          pixel values, through convolution and pooling layers, to a final classification — and
          understand exactly what is happening at every step.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Should Already Know">
        <p>
          This course assumes you are comfortable with the basics of neural networks: what a
          neuron does, what a weight and bias are, and roughly how training with gradient descent
          works. If you have completed the Neural Networks course here, you are perfectly prepared.
        </p>
        <p>
          We will introduce every CNN-specific concept from scratch. No prior experience with image
          processing or computer vision is required.
        </p>
      </ExplanationBox>
    </div>
  );
}
