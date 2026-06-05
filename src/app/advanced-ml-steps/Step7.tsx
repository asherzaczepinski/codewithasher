'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Non-Stationary World Problem">
        <p>
          Standard ML assumes the training and test distributions are identical and fixed.
          The real world violates this constantly. Users change their behavior. Sensors drift.
          New concepts emerge. Adversaries adapt. A model trained on data from 2022 may perform
          poorly on data from 2025 even if the task &quot;type&quot; is the same.
        </p>
        <p>
          This module covers three related but distinct approaches to learning in a changing world:
          continual learning (retaining old knowledge while acquiring new), active learning
          (choosing which data to label), and online learning (updating as each new datum arrives).
          Multi-task learning, which shares representations across tasks trained simultaneously,
          is closely related and we cover it briefly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Continual Learning and Catastrophic Forgetting">
        <p>
          <strong>Continual learning</strong> (also called lifelong or sequential learning) is
          the problem of learning a sequence of tasks T1, T2, T3, ... without access to previous
          task data, while retaining performance on all prior tasks.
        </p>
        <p>
          The central obstacle is <strong>catastrophic forgetting</strong>: when a neural network
          is fine-tuned on a new task, the weights shift to minimize the new loss, and this shift
          typically destroys the representations built for earlier tasks. The network
          &quot;overwrites&quot; old knowledge with new knowledge because gradient descent has no
          mechanism to protect old weights.
        </p>
        <p>
          Three main strategies to address catastrophic forgetting:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Regularization-based:</strong> Add a penalty that discourages large changes
          to weights important for previous tasks. EWC (Elastic Weight Consolidation) measures
          each weight&apos;s importance via the Fisher information matrix and adds a quadratic penalty
          proportional to importance.</li>
          <li><strong>Replay-based:</strong> Store or generate examples from previous tasks and
          interleave them with new task data during training. The brain&apos;s hippocampal replay
          during sleep is the biological analogy.</li>
          <li><strong>Architecture-based:</strong> Allocate new capacity for new tasks — expand
          the network, mask out task-specific subnetworks, or use parameter isolation —
          so new learning cannot overwrite old representations.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="EWC Regularization Objective">
        L_new(theta) + sum_i (lambda/2) F_i (theta_i - theta*_i)^2
      </MathFormula>

      <ExplanationBox title="EWC Unpacked">
        <p>
          In the EWC formula: L_new(theta) is the loss on the current task. theta*_i is the
          optimal parameter value from the previous task. F_i is the Fisher information for
          parameter i — a measure of how much that parameter&apos;s value mattered to the previous
          task&apos;s predictions. Lambda controls the trade-off between plasticity (learning new
          things) and stability (retaining old things).
        </p>
        <p>
          If F_i is large, weight i was critical for the old task, and moving it far from
          theta*_i incurs a large penalty. If F_i is small, the weight was not important and
          can be reused freely. EWC thus selectively protects important weights while leaving
          unimportant ones free for new learning.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Active Learning">
        <p>
          In standard supervised learning, labeled data is treated as fixed. In many real
          applications, labeling is expensive: a radiologist&apos;s time, a domain expert&apos;s annotation,
          a wet-lab experiment. <strong>Active learning</strong> asks: given a budget of B labels,
          which B unlabeled examples should we ask an oracle to label to maximize model performance?
        </p>
        <p>
          The model plays an active role in its own data collection. Common acquisition strategies:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Uncertainty sampling:</strong> Query the examples the model is most uncertain
          about — e.g., those closest to the decision boundary, or those where the predictive entropy
          is highest.</li>
          <li><strong>Query by committee:</strong> Train a committee of models; query examples where
          committee members disagree most.</li>
          <li><strong>Expected model change:</strong> Query the example that, if labeled, would cause
          the largest gradient update — i.e., the most informative single example.</li>
          <li><strong>Core-set selection:</strong> Choose a geometrically diverse subset of unlabeled
          points that &quot;covers&quot; the full unlabeled distribution, ensuring no large region is ignored.</li>
        </ul>
        <p>
          Active learning is particularly powerful in low-label regimes. It routinely achieves the
          same accuracy as random labeling with 5&ndash;10x fewer labels on structured datasets.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Online Learning">
        <p>
          <strong>Online learning</strong> processes data one example at a time (or in small
          mini-batches) and updates the model immediately, without storing the full dataset.
          This is essential for streaming data: click-through prediction, financial markets,
          network intrusion detection — environments where data arrives continuously and the
          distribution may shift at any moment.
        </p>
        <p>
          The theoretical framework for online learning uses <strong>regret</strong> as the
          performance measure: how much worse does the online learner do compared to the best
          fixed model in hindsight? A good online learning algorithm has sublinear regret —
          regret grows slower than T, so the average per-step regret goes to zero as T grows.
        </p>
        <p>
          Stochastic gradient descent (SGD) is itself an online learning algorithm. More
          sophisticated methods like AdaGrad adapt their learning rate per-parameter based
          on the history of gradients, providing provably better regret bounds when gradients
          are sparse.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Multi-Task Learning">
        <p>
          <strong>Multi-task learning (MTL)</strong> trains a single model on multiple related
          tasks simultaneously, sharing a common representation. Unlike continual learning (which
          sees tasks sequentially), MTL has access to all task data at once and uses shared
          hidden layers to transfer information across tasks.
        </p>
        <p>
          MTL works best when tasks share underlying structure: a model that simultaneously
          predicts part-of-speech tags and named entities in text learns richer sentence
          representations than either model trained alone. The shared layers act as a
          regularizer — they cannot overfit to any single task&apos;s idiosyncrasies.
        </p>
        <p>
          The main challenge in MTL is task balancing: tasks with very different loss scales or
          gradient magnitudes can cause one task to dominate training. Techniques like gradient
          normalization and uncertainty-based task weighting address this.
        </p>
      </ExplanationBox>

      <WorkedExample title="Uncertainty Sampling in Active Learning">
        <p>
          A binary classifier outputs probabilities for three unlabeled examples. We have a
          budget of one label to request from the oracle.
        </p>
        <CalcStep number={1}>Example A: P(Y=1) = 0.92 — the model is very confident it is class 1.</CalcStep>
        <CalcStep number={2}>Example B: P(Y=1) = 0.51 — the model is nearly maximally uncertain.</CalcStep>
        <CalcStep number={3}>Example C: P(Y=1) = 0.08 — the model is very confident it is class 0.</CalcStep>
        <CalcStep number={4}>
          Entropy: H(A) = -0.92 log(0.92) - 0.08 log(0.08) = 0.078 + 0.200 = 0.278 bits.
          H(B) = -0.51 log(0.51) - 0.49 log(0.49) = 0.143 + 0.148 = 0.291 bits (near maximum of 1 bit for binary).
          H(C) = H(A) by symmetry = 0.278 bits.
        </CalcStep>
        <CalcStep number={5}>
          Uncertainty sampling selects Example B — it is closest to the decision boundary and
          its label will provide the most information about where that boundary lies.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          If we had labeled example A or C instead, we would learn something the model already
          guessed correctly. Labeling B tells us whether the model&apos;s near-50/50 uncertainty
          was warranted — the most valuable single piece of information we can acquire.
        </p>
      </WorkedExample>
    </div>
  );
}
