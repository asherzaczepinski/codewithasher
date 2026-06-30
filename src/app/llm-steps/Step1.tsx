'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Welcome — Let's Build an LLM From Scratch">
        <p>
          You&apos;ve probably typed something into a chatbot and watched it answer like it understood
          you. It feels like magic, but underneath a large language model (LLM) is doing one astonishingly
          simple thing billions of times: <strong>guessing the next word</strong>. It reads the text so far,
          predicts the next small piece, and repeats — and from enough of those guesses you get something
          that writes essays, answers questions, and explains code. This course takes that magic apart,
          piece by piece, until none of it is mysterious anymore.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Need to Know">
        <p>
          <strong>The neural network course</strong> — or at least its core loop:{' '}
          <strong>predict → measure error → adjust</strong>. An LLM is a very large, very cleverly
          wired neural network, and we will lean on ideas from that course: weighted sums,
          activation functions, loss, and backpropagation. If those ring a bell, you are ready.
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
          <li><strong>Training</strong> — how the same predict → measure → adjust loop you already know produces all of this — and how a raw model becomes a helpful assistant.</li>
        </ul>
      </ExplanationBox>
    </div>
  );
}
