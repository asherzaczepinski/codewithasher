'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          All three schedules &mdash; step decay, exponential decay, and cosine annealing
          &mdash; as standalone functions. Each takes the current epoch and returns the
          effective learning rate for that step.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="lr_schedules.py"
        caption="Step decay drops sharply at fixed intervals; exponential decay falls smoothly but can reach near-zero too early; cosine annealing slows down near both ends for a natural fit to the loss landscape."
        code={`import math

# ── 1. Step Decay ──────────────────────────────────────────────────────────────
# The most intuitive schedule: multiply the learning rate by a fixed factor
# (drop) every D epochs. The loss curve typically shows a visible kink each
# time the rate drops -- you can literally see it in TensorBoard.

def step_decay(epoch, lr0=0.1, drop=0.1, drop_every=30):
    # lr0        -- initial learning rate at epoch 0
    # drop       -- multiplicative factor applied at each decay point (e.g. 0.1 = 10x smaller)
    # drop_every -- how many epochs between each decay step
    # floor(epoch / drop_every) counts how many full decay intervals have elapsed.
    # E.g. epoch=45, drop_every=30 -> floor(1.5) = 1 -> one decay has happened.
    n_decays = epoch // drop_every
    return lr0 * (drop ** n_decays)


# ── 2. Exponential Decay ───────────────────────────────────────────────────────
# The learning rate falls along a continuous exponential curve every step.
# Simple and smooth, but the rate constant k must be chosen carefully:
#   too large -> lr reaches near-zero before convergence
#   too small -> barely any decay effect by the end of training

def exponential_decay(epoch, lr0=0.1, k=0.05):
    # lr0 -- initial learning rate
    # k   -- decay rate constant; larger k = faster decay
    # e^(-k * epoch) shrinks monotonically from 1.0 toward 0 as epoch grows.
    return lr0 * math.exp(-k * epoch)


# ── 3. Cosine Annealing ────────────────────────────────────────────────────────
# The current standard for most deep-learning papers. Follows the first half
# of a cosine wave from lr_max down to lr_min over T total epochs.
# Key property: the schedule is slow near BOTH ends --
#   * Slow start  -> takes time to commit to a direction early on
#   * Slow finish -> settles precisely near the final minimum rather than bouncing

def cosine_annealing(epoch, T=100, lr_max=0.1, lr_min=0.0):
    # T      -- total number of training epochs (full annealing period)
    # lr_max -- learning rate at epoch 0
    # lr_min -- floor learning rate (often 0, sometimes 1e-6 to keep some signal)
    # cos(pi * epoch / T) goes from +1 (at epoch 0) to -1 (at epoch T).
    # The formula maps that range to [lr_max, lr_min].
    cosine_factor = 0.5 * (1.0 + math.cos(math.pi * epoch / T))
    return lr_min + (lr_max - lr_min) * cosine_factor


# ── Compare the three schedules across 100 epochs ─────────────────────────────
T = 100
print(f"{'epoch':>6}  {'step':>8}  {'exp':>8}  {'cosine':>8}")
for ep in [0, 10, 30, 50, 70, 90, 99]:
    s = step_decay(ep, lr0=0.1, drop=0.1, drop_every=30)
    e = exponential_decay(ep, lr0=0.1, k=0.05)
    c = cosine_annealing(ep, T=T, lr_max=0.1)
    print(f"{ep:>6}  {s:>8.5f}  {e:>8.5f}  {c:>8.5f}")

# Observation: step decay holds lr constant then drops suddenly;
# exponential is smooth but hits near-zero early;
# cosine stays high longer then sweeps down -- ideal for the typical loss curve shape.`}
      />
    </div>
  );
}
