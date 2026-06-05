'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is">
        <p>
          Transformers power almost every large language model in existence today — GPT, Claude,
          Gemini, BERT, and hundreds more. This course dismantles the transformer from the ground up,
          explaining every mechanism with real math and a single running example you can hold in your head.
        </p>
        <p>
          By the end you will understand exactly why transformers work, not just that they do.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Transformers Replaced RNNs">
        <p>
          Before transformers, the dominant architecture for language was the <strong>Recurrent Neural Network (RNN)</strong>.
          An RNN processes a sentence one word at a time, left to right, carrying a hidden state forward
          like a running summary. This caused two crippling problems:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Sequential bottleneck.</strong> Each word had to wait for all previous words to finish.
            You could not parallelize training across the tokens of a single sequence. On modern GPUs,
            which thrive on doing thousands of operations simultaneously, this was a massive waste.
          </li>
          <li>
            <strong>Vanishing memory.</strong> The hidden state can only carry so much signal. A word
            near the start of a long sentence gets diluted by dozens of updates before the model
            sees the end. Long-range dependencies — like the pronoun &quot;it&quot; referring back to
            a noun twenty words earlier — were notoriously hard to learn.
          </li>
        </ul>
        <p>
          Transformers fix both problems at once. Every token attends directly to every other token
          in a single parallel operation. There is no hidden state that erodes over distance. A word
          at position 1 and a word at position 50 connect with exactly the same ease.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example">
        <p>
          Throughout this course we process one short sentence through every part of the transformer:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0', fontSize: '1.05rem' }}>
          &quot;the cat sat on the mat&quot;
        </p>
        <p>
          Six words. Simple enough to trace by hand, rich enough to illustrate every concept —
          tokenization, positional encoding, attention between &quot;cat&quot; and &quot;mat&quot;,
          masking, residual connections, and autoregressive generation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          Here is what we cover, in order:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Tokens, Embeddings &amp; Positional Encoding</strong> — how raw text becomes vectors the model can work with, and how word order gets injected.</li>
          <li><strong>Self-Attention: Q, K, V</strong> — the core mathematical operation; every token asking &quot;which other tokens should I look at?&quot;</li>
          <li><strong>Multi-Head &amp; Masked Attention</strong> — running many attention patterns in parallel; causal masking for generation; cross-attention between encoder and decoder.</li>
          <li><strong>The Transformer Block</strong> — wrapping attention in residual connections and layer normalization; stacking blocks to build depth.</li>
          <li><strong>Encoder, Decoder &amp; Generation</strong> — BERT vs GPT vs T5; how autoregressive next-token prediction works step by step.</li>
          <li><strong>Efficient Attention &amp; Long Context</strong> — the O(n&#178;) bottleneck; KV cache, FlashAttention, multi-query attention, sparse patterns.</li>
          <li><strong>Vision, Multimodal &amp; Scaling Laws</strong> — image patches as tokens; combining modalities; why more compute reliably yields better models.</li>
        </ul>
        <p>
          No step hand-waves. Every formula is derived and every number is computed.
        </p>
      </ExplanationBox>
    </div>
  );
}
