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

      <ExplanationBox title="What You'll Build Your Intuition For">
        <p>By the end, you&apos;ll understand every stage of how text becomes a prediction:</p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Tokenization</strong> — how text is chopped into pieces and turned into numbers.</li>
          <li><strong>Embeddings</strong> — how those numbers become vectors that carry <em>meaning</em>.</li>
          <li><strong>Attention</strong> — how the model lets every word look at every other word.</li>
          <li><strong>The Transformer</strong> — how those pieces stack into the engine behind every modern LLM.</li>
          <li><strong>Generation</strong> — how a string of next-word guesses becomes a full answer.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="One Promise">
        <p>
          Same as the neural network course: no hand-waving. Every idea is built up from something you
          already understand, with real numbers you can follow and interactive pieces you can poke at.
          If you finished Neural Networks, you already have the foundation — an LLM is just a very large,
          very cleverly wired neural network. Let&apos;s go.
        </p>
      </ExplanationBox>
    </div>
  );
}
