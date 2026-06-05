'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Why a Fixed Learning Rate Is Not Enough">
        <p>
          Every optimizer we have seen so far uses a fixed global learning rate &alpha;. But
          the optimal step size changes during training. Early in training the model is far
          from a good solution, loss is high, and large steps are fine &mdash; they get you
          to a reasonable region of parameter space quickly. Late in training the model is
          near a good solution, and large steps cause it to bounce around the minimum
          without ever settling in.
        </p>
        <p>
          A <strong>learning-rate schedule</strong> (also called &quot;annealing&quot;) solves
          this by reducing &alpha; over time according to a predefined formula. The schedule
          is a function from training step t (or epoch) to an effective learning rate &alpha;(t).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step Decay">
        <p>
          The simplest schedule: multiply &alpha; by a fixed factor (e.g. 0.1) every D steps
          (or epochs). Training starts fast, then gets precision-tuned at each decay point.
          The loss curve typically shows a sharp drop each time the learning rate steps down.
        </p>
      </ExplanationBox>

      <MathFormula label="Step decay schedule">
        &alpha;(t) = &alpha;0 &times; drop^(floor(t / D))
      </MathFormula>

      <ExplanationBox title="Exponential Decay">
        <p>
          Rather than discrete drops, exponential decay reduces &alpha; smoothly every step.
          The learning rate follows a continuous exponential curve from &alpha;0 toward zero.
          It is simple to implement but can decay too fast or too slow depending on the chosen
          rate constant k.
        </p>
      </ExplanationBox>

      <MathFormula label="Exponential decay schedule">
        &alpha;(t) = &alpha;0 &times; e^(&minus;k &times; t)
      </MathFormula>

      <ExplanationBox title="Cosine Annealing">
        <p>
          <strong>Cosine annealing</strong> (Loshchilov &amp; Hutter, 2017) is the schedule
          most commonly used in modern deep learning. The learning rate follows the first half
          of a cosine wave from &alpha;max down to &alpha;min over T total steps. The rate
          starts high, decreases slowly at first (exploring broadly), then drops steeply in
          the middle, then slows again near the minimum (settling precisely). This shape
          naturally matches the loss landscape.
        </p>
      </ExplanationBox>

      <MathFormula label="Cosine annealing schedule">
        &alpha;(t) = &alpha;min + 0.5 &times; (&alpha;max &minus; &alpha;min) &times; (1 + cos(&pi; &times; t / T))
      </MathFormula>

      <ExplanationBox title="Warmup: Don&apos;t Start at Full Speed">
        <p>
          At the very beginning of training, the model&apos;s parameters are random and the
          gradients are unreliable estimates of the true loss landscape. Starting with a large
          learning rate causes chaotic parameter updates that can push the model far from any
          useful region.
        </p>
        <p>
          <strong>Linear warmup</strong> ramps &alpha; from a tiny value (often 0) up to the
          target learning rate over the first W steps. After warmup, a decay schedule (often
          cosine) takes over. The warmup + cosine combo is the standard for training
          transformers: GPT, BERT, ViT, and most modern large models use it.
        </p>
      </ExplanationBox>

      <MathFormula label="Linear warmup (first W steps)">
        &alpha;(t) = &alpha;max &times; (t / W) &nbsp;&nbsp; for t &le; W
      </MathFormula>

      <ExplanationBox title="Intuition: Why Annealing Helps">
        <p>
          Think of parameter space as a hilly terrain you are exploring blindfolded. Early on,
          large steps help you cover ground and avoid getting stuck in the nearest local valley.
          As you zero in on a promising region, large steps bounce you out of it before you can
          examine it closely. Reducing the step size is how you slow down, look carefully, and
          settle into the best minimum you can find.
        </p>
        <p>
          Empirically, models trained with a good schedule consistently outperform those trained
          at a constant rate. On ImageNet, for example, the final step-decay drops from 0.1 to
          0.01 to 0.001 account for most of the last few percent of top-1 accuracy. The schedule
          is not cosmetic &mdash; it is essential.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Cyclical Learning Rates and Restarts">
        <p>
          An extension of cosine annealing, <strong>cosine annealing with warm restarts
          (SGDR)</strong>, periodically resets &alpha; back to &alpha;max and anneals again.
          Each cycle explores a slightly different region of parameter space, which can help
          the model escape sharp minima and find flatter ones (flatter minima generally
          generalize better). The period of each cycle is often doubled after each restart to
          allow progressively deeper local exploration.
        </p>
      </ExplanationBox>
    </div>
  );
}
