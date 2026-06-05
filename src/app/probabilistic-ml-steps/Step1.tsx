'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Why Uncertainty Belongs in Machine Learning">
        <p>
          The world is not deterministic. A patient with a cough might have a cold, allergies, or
          something more serious. A radar blip could be a plane or noise. A sequence of words could
          have several plausible meanings. In every one of these cases, a model that forces a single
          answer throws away information that matters.
        </p>
        <p>
          Probabilistic machine learning keeps uncertainty explicit. Instead of outputting
          &quot;it will rain&quot;, a probabilistic model outputs a full distribution over outcomes —
          &quot;70% chance of rain, 30% chance of dry.&quot; That extra information lets downstream
          decisions be made rationally.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Distributions: A Quick Recap">
        <p>
          A <strong>probability distribution</strong> assigns a number between 0 and 1 to each
          possible outcome, with all numbers summing (or integrating) to 1.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Discrete distributions</strong> — a table of probabilities over a finite set.
            Example: P(weather = sunny) = 0.6, P(weather = rainy) = 0.4.
          </li>
          <li>
            <strong>Continuous distributions</strong> — a density function over a continuous range.
            Example: a Gaussian (bell curve) over temperature readings.
          </li>
          <li>
            <strong>Joint distribution</strong> — P(X, Y) describes the probability of X and Y
            together. From it, you can derive marginals and conditionals.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Bayes&apos; Rule: The Engine of Probabilistic ML">
        <p>
          Bayes&apos; rule tells us how to update our beliefs when we observe evidence. If we want to
          know the probability of a hidden cause H given an observed effect E, the rule is:
        </p>
      </ExplanationBox>

      <MathFormula label="Bayes&apos; Rule">
        P(H | E) = P(E | H) &times; P(H) / P(E)
      </MathFormula>

      <ExplanationBox title="Reading Bayes&apos; Rule">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>P(H)</strong> — the prior: our belief about H before seeing any evidence.</li>
          <li><strong>P(E | H)</strong> — the likelihood: how probable is this evidence if H is true?</li>
          <li><strong>P(E)</strong> — the marginal likelihood (normalizing constant): the total
            probability of seeing evidence E under all possible causes.</li>
          <li><strong>P(H | E)</strong> — the posterior: our updated belief after seeing E.</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Everything in probabilistic ML is, at its core, Bayes&apos; rule applied at scale.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Generative vs Discriminative Models">
        <p>
          There are two fundamentally different strategies for building a probabilistic model.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A <strong>discriminative model</strong> directly models the conditional distribution of the
          output given the input: P(Y | X). A logistic regression classifier is discriminative — it
          asks &quot;given this input, what is the probability of each label?&quot; Discriminative models
          are often accurate when you have lots of labeled data and only care about predicting Y.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A <strong>generative model</strong> models the full joint distribution P(X, Y) — how both
          inputs and outputs were generated together. From the joint, you can recover P(Y | X) via
          Bayes&apos; rule. More importantly, a generative model lets you ask: &quot;How probable is
          this input at all?&quot; — useful for anomaly detection, data generation, and handling
          missing data.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This course focuses on <strong>generative models with structure</strong> — models that
          represent complex joint distributions compactly using graphs, and then perform principled
          inference over them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          Here is what we will build up, module by module:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Part 1 — Models with Structure:</strong> conditional independence and why it
            matters, Bayesian networks (directed graphical models), Markov random fields and
            conditional random fields (undirected models), and hidden Markov models for sequences.
          </li>
          <li>
            <strong>Part 2 — Inference:</strong> Bayesian parameter inference with conjugate priors,
            Monte Carlo and MCMC sampling when exact inference is impossible, and variational
            inference as an optimization-based alternative. We close with a treatment of aleatoric
            vs epistemic uncertainty and why it matters in deployed systems.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Every concept is grounded in a running example: inferring a hidden weather state (sunny or
          rainy) from noisy observations such as whether someone carries an umbrella or whether the
          ground is wet. Simple enough to compute by hand; rich enough to illustrate everything.
        </p>
      </ExplanationBox>
    </div>
  );
}
