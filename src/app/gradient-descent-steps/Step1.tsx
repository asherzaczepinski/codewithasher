'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Every time a machine learning model gets better at its job, something called
          <strong> gradient descent</strong> is doing the work behind the scenes. It&apos;s
          the engine that drives learning in virtually every neural network, linear regression,
          and classification algorithm you&apos;ll ever encounter.
        </p>
        <p>
          By the end of this course you&apos;ll know exactly how gradient descent works —
          the math, the intuition, and the practical details that make it fast and reliable
          in the real world.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Training = Minimizing a Cost Function">
        <p>
          When we train a model, we&apos;re trying to make its predictions as accurate as
          possible. We measure accuracy with a <strong>cost function</strong> — a single
          number that tells us how wrong the model currently is. A cost of 0 means perfect
          predictions; a large cost means the model is badly off.
        </p>
        <p>
          Training is therefore just one thing: <em>find the parameter values that make
          the cost function as small as possible</em>. Gradient descent is the algorithm
          that searches for those values.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Hiker in the Fog">
        <p>
          Imagine you&apos;re a hiker standing somewhere on a hilly landscape, completely
          surrounded by fog. You can&apos;t see the valley below — you can only feel the
          slope of the ground right under your feet. Your goal is to reach the lowest point.
        </p>
        <p>
          What&apos;s the sensible strategy? <strong>Take a small step in whichever direction
          feels downhill, then reassess.</strong> Repeat until the ground feels flat — you&apos;ve
          found the bottom.
        </p>
        <p>
          That is gradient descent. The landscape is the cost function. Your position on the
          landscape represents the model&apos;s current parameters. The slope under your feet
          is the gradient. And each careful step downhill is one parameter update.
        </p>
        <p>
          Throughout this course we&apos;ll use this hiker — and an equivalent image of a ball
          rolling into a bowl — to build intuition before we do the math.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need">
        <p>
          <strong>Basic algebra</strong> and a willingness to read an equation slowly.
          We&apos;ll introduce every piece of calculus we need from scratch, tied directly
          to the hiker analogy so it never feels abstract.
        </p>
      </ExplanationBox>
    </div>
  );
}
