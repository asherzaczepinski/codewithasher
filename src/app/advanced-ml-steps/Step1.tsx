'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Beyond the Standard Toolbox">
        <p>
          You already know the classics: linear regression, decision trees, gradient descent,
          and backpropagation. Those tools work remarkably well — but every real-world deployment
          eventually runs into problems they were never designed to solve.
        </p>
        <p>
          A model trained on hospital data from one city performs poorly in another. A spam
          filter learns that certain words predict spam, but never asks <em>why</em> — so it
          can be fooled with a single cleverly placed word. A hiring algorithm is accurate on
          average but systematically disadvantages one demographic group. A self-driving system
          misclassifies a stop sign because someone stuck a sticker on it.
        </p>
        <p>
          These failures share a common thread: the model learned a pattern without understanding
          the world it operates in. This course is about the research frontier that confronts
          these gaps head-on.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Four Frontier Problems">
        <p>
          <strong>Robustness</strong> — Can the model hold up when inputs are slightly perturbed,
          corrupted, or deliberately attacked? Standard training minimizes average error but says
          nothing about worst-case behavior. Adversarial examples and distribution shift expose
          this gap.
        </p>
        <p>
          <strong>Trust: Fairness and Interpretability</strong> — Even if a model is accurate,
          can we trust it? Does it treat all groups equitably? Can a human expert audit its
          reasoning and catch mistakes before they cause harm? Black-box accuracy is not enough
          when the stakes are high.
        </p>
        <p>
          <strong>Causality</strong> — Machine learning excels at finding correlations, but
          decisions require understanding causes. If we intervene — change a drug dosage,
          adjust a policy — what actually happens? Answering that requires tools beyond correlation.
        </p>
        <p>
          <strong>Adaptability</strong> — The world is not static. New tasks appear with only
          a handful of examples. Data arrives in streams. Knowledge from one task should transfer
          to another. How do we build systems that learn efficiently and keep learning without
          forgetting?
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          <strong>Part 1 — Robustness, Causality &amp; Trust</strong> opens with kernel methods
          and structured prediction, which show how to handle complex output spaces. We then study
          adversarial examples and robust training. From there we move to causal inference — the
          formal language of interventions and counterfactuals. Part 1 closes with fairness metrics
          and interpretability methods including SHAP, LIME, and mechanistic interpretability.
        </p>
        <p>
          <strong>Part 2 — Learning Paradigms &amp; Structure</strong> covers meta-learning
          (learning to learn quickly from few examples), then continual, active, and online learning.
          The course closes with graph neural networks — which bring structure into the model itself —
          and AutoML, which automates architecture design, capping with a look at memory-augmented
          and multimodal foundation models.
        </p>
        <p>
          Each module is self-contained but builds on the previous one. The running thread is a
          single question: <em>what does it take to build ML systems we can actually rely on in the world?</em>
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Should Already Know">
        <p>
          This is an advanced survey. You should be comfortable with supervised learning,
          neural networks, gradient descent, and basic probability. We will explain every new
          concept from scratch, but we will not re-derive backpropagation or explain what a
          loss function is.
        </p>
        <p>
          Mathematical notation is used throughout because precision matters — hand-waving
          hides the real ideas. Every formula is accompanied by a plain-English explanation
          so you can always check that you understand what the math is actually saying.
        </p>
      </ExplanationBox>
    </div>
  );
}
