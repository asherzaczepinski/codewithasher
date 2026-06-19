'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Welcome — Let's Build an LLM From Scratch">
        <p>
          You&apos;ve probably typed something into ChatGPT and watched it answer like it understood you.
          It feels like magic. It isn&apos;t. Underneath, a large language model (LLM) is doing one
          astonishingly simple thing, billions of times: <strong>guessing the next word</strong>.
        </p>
        <p>
          That&apos;s the whole secret. An LLM reads the text so far and predicts what comes next — one
          small piece at a time. Stack enough of those guesses together, train them on enough text, and
          you get something that can write essays, answer questions, and explain code. This course takes
          that magic apart, piece by piece, until none of it is mysterious anymore.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need to Know">
        <p>
          <strong>The neural network course</strong> — or at least its core loop:{' '}
          <strong>predict → measure error → adjust</strong>. An LLM is a very large, very cleverly
          wired neural network, and we&apos;ll lean on ideas from that course constantly: weighted sums,
          activation functions, loss, backpropagation. If those ring a bell, you&apos;re ready.
        </p>
        <p>
          Beyond that: algebra. Every calculation in this course is multiplication and addition you can
          check by hand. No calculus required.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Project: A Tiny Language Model">
        <p>
          The neural network course had one running example — the rain predictor — and we&apos;re doing
          the same thing here. Our example is a <strong>tiny language model</strong> living in a
          miniature world of a few words: cats, dogs, mats, parks. Small enough that we can write out
          every vector and follow every multiplication, but built from the exact same parts as GPT-4.
        </p>
        <p>
          You&apos;ll meet three little vectors for <strong>cat</strong>, <strong>sat</strong>, and{' '}
          <strong>mat</strong> early on, compute attention over them by hand, and at the end watch the
          tiny model write &quot;the cat sat on the mat.&quot; — including the moment it decides to stop.
          Along the way, real interactive demos (like a real GPT tokenizer) connect the toy numbers to
          the full-scale thing.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You'll Build Your Intuition For">
        <p>By the end, you&apos;ll understand every stage of how text becomes a prediction:</p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Tokenization</strong> — how text is chopped into pieces and turned into numbers.</li>
          <li><strong>Embeddings</strong> — how those numbers become vectors that carry <em>meaning</em>.</li>
          <li><strong>Attention</strong> — how the model lets every word look at every other word, computed by hand.</li>
          <li><strong>The Transformer</strong> — how those pieces stack into the engine behind every modern LLM.</li>
          <li><strong>Generation</strong> — how a string of next-word guesses becomes a full answer.</li>
          <li><strong>Training</strong> — how the same predict → measure → adjust loop you already know, run on the internet, produces all of this — and how a raw model becomes a helpful assistant.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="One Promise">
        <p>
          Same as the neural network course: no hand-waving. Every idea is built up from something you
          already understand, with real numbers you can follow and interactive pieces you can poke at.
          When this course says &quot;the model computes attention,&quot; you will have computed
          attention yourself, by hand, and gotten the same answer. Let&apos;s go.
        </p>
      </ExplanationBox>
    </div>
  );
}
