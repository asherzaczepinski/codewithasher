'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Linear regression predicts a <em>number</em> — the price of a house, tomorrow&apos;s temperature,
          a student&apos;s test score. But many of the most important questions in machine learning
          ask for a <em>category</em>: Is this email spam or not spam? Will this patient develop
          diabetes? Did the student pass or fail?
        </p>
        <p>
          That&apos;s the job of <strong>classification</strong>, and logistic regression is one of the
          cleanest, most interpretable tools for doing it. Despite the name, logistic regression is
          a classification algorithm — it predicts which category an input belongs to.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Spam Detection">
        <p>
          Throughout this course we&apos;ll use a single concrete example: classifying emails
          as <strong>spam</strong> or <strong>not spam</strong>.
        </p>
        <p>
          Imagine each email is described by two features:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>x₁</strong> — number of suspicious words (&quot;free,&quot; &quot;winner,&quot; &quot;click here&quot;)</li>
          <li><strong>x₂</strong> — number of exclamation marks in the subject line</li>
        </ul>
        <p>
          Our model will look at those two numbers and output a probability — say, <strong>0.93</strong> — meaning
          &quot;I&apos;m 93% confident this is spam.&quot; If the probability is above 0.5 we label it spam; below 0.5
          we let it through.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Not Just Use Linear Regression?">
        <p>
          You might wonder: can&apos;t we just use linear regression and predict 1 for spam and 0 for not spam?
          It seems simple enough. The next module shows exactly why that breaks — and why we need a
          fundamentally different approach.
        </p>
        <p>
          By the end of this course you&apos;ll understand every equation involved: how raw numbers get
          squashed into probabilities, how the model learns from its mistakes, and how to extend it beyond
          two classes.
        </p>
      </ExplanationBox>
    </div>
  );
}
