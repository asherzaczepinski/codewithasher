'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Machine learning is, at its core, a search problem. A model starts out making bad
          predictions and we want it to get better. But &quot;getting better&quot; has to mean
          something precise — and that&apos;s where calculus comes in.
        </p>
        <p>
          Calculus is <strong>the mathematics of change</strong>. It answers one question with
          stunning precision: if you nudge an input by a tiny amount, how much does the output
          change? That one question, asked over and over, is how every modern ML model learns.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Central Idea: Minimizing Error">
        <p>
          Imagine you&apos;re trying to fit a curve through some data points. Your model makes a
          prediction, compares it to the true answer, and computes an <strong>error</strong> — a
          single number that measures how wrong it is. A perfect model has error zero. A terrible
          model has a large error.
        </p>
        <p>
          Training means finding the model settings (called <em>parameters</em>) that make the
          error as small as possible. Picture the error as a bowl-shaped surface. The bottom of
          the bowl is where error is lowest. Training is the process of rolling a ball down into
          that bowl.
        </p>
        <p>
          To roll downhill, the ball needs to know <strong>which direction is downhill</strong>.
          Calculus — specifically derivatives and gradients — is exactly the tool that answers
          that question. Every step of training is one application of this idea.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example">
        <p>
          Throughout this course we use one concrete scenario: a model that predicts a number
          (say, tomorrow&apos;s temperature) from a single input. The model has one adjustable
          parameter — a weight <em>w</em>. The error is a smooth, bowl-shaped curve when you
          plot it against <em>w</em>.
        </p>
        <p>
          In every module we will ask: <em>what does calculus tell us about this error curve
          at the current value of w?</em> By the final module you will know exactly how
          gradient descent finds the bottom of that bowl — and why it works.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need">
        <p>
          <strong>Algebra only.</strong> You need to be comfortable with expressions like
          3x&nbsp;+&nbsp;2 and x&sup2;, and you need to be able to substitute a number in for
          a variable. That is the entire prerequisite. Every calculus concept is built up from
          first principles here — no prior calculus required.
        </p>
      </ExplanationBox>
    </div>
  );
}
