'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="ML Is Reasoning Under Uncertainty">
        <p>
          Every interesting machine learning problem involves uncertainty. A spam filter
          doesn&apos;t <em>know</em> whether an email is spam — it makes an educated guess.
          A medical diagnostic model doesn&apos;t <em>know</em> whether a patient has a disease
          — it assigns a probability. A self-driving car doesn&apos;t <em>know</em> what a blurry
          shape in the road is — it reasons about likelihoods and acts accordingly.
        </p>
        <p>
          The mathematical language for reasoning under uncertainty is <strong>probability</strong>.
          Without it, you can&apos;t understand why a model is confident or uncertain, how
          a model learns from data, or how to interpret a model&apos;s output.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Probability Quantifies Belief">
        <p>
          A probability is a number between 0 and 1 that represents how likely something is.
          A probability of <strong>0</strong> means impossible. A probability of <strong>1</strong> means certain.
          Everything in between represents partial belief.
        </p>
        <p>
          For example: &quot;There is a 0.85 probability this email is spam&quot; means the model
          is very confident — but not certain — that the email is spam. If the threshold for
          classifying as spam is 0.5, the model would flag it.
        </p>
        <p>
          ML models are not magic black boxes that spit out yes/no answers. They output{' '}
          <strong>probability scores</strong>, and understanding those scores requires understanding
          where they come from.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Course Covers">
        <p>
          We&apos;ll build your probability and statistics intuition from the ground up,
          using two running examples throughout:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Coin & dice problems</strong> — simple enough to compute by hand, perfect
            for building intuition about probability rules.
          </li>
          <li>
            <strong>A medical test scenario</strong> — a disease test that is 99% accurate,
            applied to a population where 1 in 1,000 people has the disease. The result will
            surprise you, and it&apos;s one of the most important lessons in all of statistics.
          </li>
        </ul>
        <p>
          By the end you&apos;ll understand probability rules, conditional probability,
          random variables, mean and variance, the normal distribution, and Bayes&apos; Theorem —
          the mathematical backbone of Naive Bayes classifiers and probabilistic ML models.
        </p>
      </ExplanationBox>
    </div>
  );
}
