'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Some questions have a yes-or-no answer: &quot;Will it rain today?&quot; But many of the
          most useful questions in the real world ask for a <em>number</em>: &quot;How much will
          this house sell for?&quot; That kind of question is what <strong>regression</strong> is
          built to answer.
        </p>
        <p>
          In this course you will learn linear regression — one of the oldest, most reliable, and
          most widely used tools in data science. By the end you will understand not just what it
          does, but exactly <em>why</em> it works and how a computer finds the best possible answer
          automatically.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: House Prices">
        <p>
          Throughout every module we will use one concrete example: <strong>predicting the price of
          a house from its size in square feet</strong>.
        </p>
        <p>
          Imagine you have a spreadsheet of recent sales. Each row has two numbers — the size of
          the house and the price it sold for. A natural question is: if I know a new house is
          1 400 sq ft, what price should I expect?
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>House A: 1 000 sq ft → $200 000</li>
          <li>House B: 1 500 sq ft → $275 000</li>
          <li>House C: 2 000 sq ft → $360 000</li>
          <li>House D: 2 500 sq ft → $430 000</li>
        </ul>
        <p>
          There is a clear trend: bigger houses cost more. Linear regression finds the straight line
          through these points that best captures that trend, then uses it to predict prices for any
          size you give it.
        </p>
        <p>
          In later modules we will extend this to <em>multiple features</em> — size, number of
          bedrooms, age of the house, and more — but we start with one feature so the math stays
          completely visible.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Regression vs. Classification">
        <p>
          It is worth knowing the difference between the two main kinds of supervised learning
          before we dive in:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Classification</strong> — the output is a category. &quot;Will it rain? Yes or
            no.&quot; &quot;Is this email spam?&quot; Neural networks doing classification output a
            probability that caps at 1.
          </li>
          <li>
            <strong>Regression</strong> — the output is a continuous number. &quot;How much will
            this house cost?&quot; &quot;How many units will we sell next month?&quot; There is no
            upper bound and no squeezing into 0–1.
          </li>
        </ul>
        <p>
          The word &quot;linear&quot; in <em>linear</em> regression tells us the shape of our
          model: a straight line (or, with many features, a flat plane). It is the simplest
          possible model and a great place to start because every idea — error, gradients,
          overfitting — carries over directly to more complex models.
        </p>
      </ExplanationBox>
    </div>
  );
}
