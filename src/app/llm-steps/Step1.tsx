'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Welcome — Let's Build an LLM From Scratch">
        <p>
          You&apos;ve probably typed something into a chatbot and watched it answer like it understood
          you. It feels like magic. It isn&apos;t. Underneath, a large language model (LLM) is doing
          one astonishingly simple thing, billions of times: <strong>guessing the next word</strong>.
        </p>
        <p>
          That is the whole secret. An LLM reads the text so far and predicts what should come next —
          one small piece at a time. Stack enough of those guesses together, train them on enough text,
          and you get something that can write essays, answer questions, and explain code. This course
          takes that magic apart, piece by piece, until none of it is mysterious anymore.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Course Promises">
        <p>
          Most explanations of LLMs stop at the diagram: boxes labeled &ldquo;attention&rdquo; and
          &ldquo;embeddings&rdquo; with arrows between them. We are not going to stop there. By the end
          of this course you will <strong>compute a real next-word prediction entirely by hand</strong> —
          every multiplication, every sum, every step — and get the same answer the real machinery
          would. When this course says &ldquo;the model computes X,&rdquo; you will have computed X
          yourself.
        </p>
        <p>
          To make that possible, the whole course follows <strong>one running example</strong> from the
          first calculation to the last. We will carry a single short phrase all the way through the
          machine and watch, stage by stage, how it turns into a prediction. Keeping one example means
          every number you meet later connects back to one you have already seen.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need to Know">
        <p>
          <strong>The neural network course</strong> — or at least its core loop:{' '}
          <strong>predict → measure error → adjust</strong>. An LLM is a very large, very cleverly
          wired neural network, and we will lean on ideas from that course constantly: weighted sums,
          activation functions, loss, and backpropagation. If those ring a bell, you are ready.
        </p>
        <p>
          Beyond that: a little algebra. Every calculation in this course is multiplication and
          addition you can check by hand. No calculus required, and nothing you cannot follow on paper.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You'll Build Your Intuition For">
        <p>By the end, you will understand every stage of how text becomes a prediction:</p>
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
          We will start from the simplest possible description of what a language model even is — and
          then spend the rest of the course earning every word of it. Let&apos;s go.
        </p>
      </ExplanationBox>
    </div>
  );
}
