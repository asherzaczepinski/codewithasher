'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="You Already Know the Basics — Now Let&apos;s Make Them Work">
        <p>
          You&apos;ve seen how a neural network is structured: neurons organized into layers,
          each computing a weighted sum of its inputs and passing the result through an activation
          function. You&apos;ve seen forward propagation carry data from input to output, and
          backpropagation carry error signals back through the network to update weights.
        </p>
        <p>
          That&apos;s the theory. But here&apos;s the uncomfortable truth: knowing the theory
          is not enough to actually train a deep network successfully. If you take a 10-layer
          network, initialize the weights randomly, and start training, there&apos;s a good
          chance it will <em>fail to learn anything at all</em>.
        </p>
        <p>
          This course is about understanding exactly why that happens — and how to fix it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example: The Stubborn MLP">
        <p>
          Throughout this course we&apos;ll work with a concrete multilayer perceptron (MLP)
          that we&apos;re trying to train to classify images. It has four hidden layers, uses
          mean squared error as its loss, and keeps failing in instructive ways:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Training loss barely moves</strong> — the network isn&apos;t learning.</li>
          <li><strong>Loss explodes to NaN</strong> — gradients have gone out of control.</li>
          <li><strong>Test accuracy is far below training accuracy</strong> — it&apos;s overfitting.</li>
        </ul>
        <p>
          Each module will diagnose one class of failure, explain the math behind it,
          and introduce the fix. By the end the same network will train reliably.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Quick Recap of the Perceptron and MLP">
        <p>
          A single <strong>perceptron</strong> computes:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', margin: '8px 0' }}>
          output = activation( w&middot;x + b )
        </p>
        <p>
          where <em>w</em> is a weight vector, <em>x</em> is an input vector, <em>b</em> is a
          bias scalar, and <em>activation</em> squashes the result into a useful range.
        </p>
        <p>
          A <strong>multilayer perceptron</strong> stacks many such layers. The output of layer
          L becomes the input to layer L+1. With enough layers and neurons, an MLP can
          approximate virtually any function — but only if training actually works.
        </p>
      </ExplanationBox>

      <MathFormula label="Layer output (vector form)">
        h(L) = activation( W(L) &middot; h(L-1) + b(L) )
      </MathFormula>

      <ExplanationBox title="Why Deep Networks Are Hard to Train">
        <p>
          Adding more layers multiplies expressive power, but it also multiplies the number
          of things that can go wrong. Gradients travel backward through every layer; if they
          shrink at each step they vanish before reaching the first layers. If they grow at
          each step they explode. The choice of activation function, weight initialization,
          and network architecture all interact to make this better or worse.
        </p>
        <p>
          On top of that, a network with millions of parameters can perfectly memorize a
          small training set while learning nothing that generalizes — overfitting. And even
          a network that generalizes can train slowly or erratically if activations shift
          wildly across mini-batches.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Roadmap">
        <p>Here is what we will cover, in order:</p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Activation Functions</strong> — sigmoid, tanh, ReLU, and when to use each.</li>
          <li><strong>Backpropagation, Deeper</strong> — gradient flow layer by layer with the chain rule.</li>
          <li><strong>Weight Initialization</strong> — why zero-init fails and how Xavier/He init fixes it.</li>
          <li><strong>Vanishing &amp; Exploding Gradients</strong> — the core instability of deep nets.</li>
          <li><strong>Residual Connections</strong> — skip connections that let gradients bypass layers.</li>
          <li><strong>Dropout &amp; Regularization</strong> — preventing overfitting by dropping neurons during training.</li>
          <li><strong>Batch &amp; Layer Normalization</strong> — stabilizing activations so training stays smooth.</li>
        </ul>
      </ExplanationBox>
    </div>
  );
}
