'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Step 1: Tokenization">
        <p>
          A transformer cannot read characters or words directly — it needs integers it can look up
          in a table. <strong>Tokenization</strong> is the process of splitting raw text into small
          pieces called <em>tokens</em> and assigning each a unique integer ID.
        </p>
        <p>
          The naive approach — one word, one token — breaks on rare words, typos, and languages
          with rich morphology. A model trained on English never sees the German word
          &quot;Rindfleischetikettierungsgesetz&quot;, so it has no token for it.
        </p>
        <p>
          Modern transformers instead use <strong>subword tokenization</strong>. The most common
          algorithm is <strong>Byte-Pair Encoding (BPE)</strong>. The idea is simple:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Start with a vocabulary of individual characters (or bytes).</li>
          <li>Count every adjacent pair that appears in the training corpus.</li>
          <li>Merge the most frequent pair into a single new token.</li>
          <li>Repeat until the vocabulary reaches a target size (e.g. 50,000 tokens).</li>
        </ul>
        <p>
          Common words like &quot;the&quot; and &quot;cat&quot; survive as single tokens.
          Rare words get split into recognizable fragments: &quot;transformer&quot; might become
          [&quot;trans&quot;, &quot;form&quot;, &quot;er&quot;]. The model sees familiar
          sub-pieces even for words it has never encountered as a whole.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example: Tokenizing the Sentence">
        <p>
          For our sentence &quot;the cat sat on the mat&quot; with a simple word-level tokenizer,
          we get six tokens with IDs drawn from the vocabulary:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          &quot;the&quot; → 1 &nbsp;&nbsp; &quot;cat&quot; → 482 &nbsp;&nbsp; &quot;sat&quot; → 891<br />
          &quot;on&quot; → 17 &nbsp;&nbsp;&nbsp; &quot;the&quot; → 1 &nbsp;&nbsp;&nbsp;&nbsp; &quot;mat&quot; → 1043
        </p>
        <p>
          The result is the integer sequence [1, 482, 891, 17, 1, 1043]. Notice that &quot;the&quot;
          appears twice and maps to the same ID both times — position is not encoded yet.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Word Embeddings">
        <p>
          An integer ID is not a useful mathematical object — you cannot compute distance, similarity,
          or gradients on a bare number. We convert each token ID into a dense vector of real numbers
          called an <strong>embedding</strong>.
        </p>
        <p>
          Concretely, the model maintains an <em>embedding matrix</em> E of shape
          (vocabulary size) x (embedding dimension d). Row i of E is the embedding for token ID i.
          Looking up token 482 (&quot;cat&quot;) returns a vector of d numbers, e.g. d = 512.
        </p>
        <p>
          These vectors are learned during training. After training, semantically related words end
          up close in vector space: &quot;cat&quot; and &quot;kitten&quot; cluster together, far
          from &quot;volcano&quot;. The embedding is the model&apos;s compressed knowledge of what
          each token means.
        </p>
      </ExplanationBox>

      <MathFormula label="Embedding lookup">
        x&#7522; = E[token_id&#7522;] &nbsp;&nbsp;&nbsp; shape: (d,)
      </MathFormula>

      <ExplanationBox title="Step 3: Why We Need Positional Encoding">
        <p>
          Here is the problem: if we feed the six embedding vectors into the attention mechanism,
          attention treats the input as a <em>set</em>, not a <em>sequence</em>. Swapping
          &quot;cat sat&quot; to &quot;sat cat&quot; produces exactly the same attention weights,
          because attention only cares about the content of each vector, not its position.
        </p>
        <p>
          We must inject order information explicitly. We do this by adding a
          <strong> positional encoding</strong> vector PE(pos) to each token embedding before
          passing it into the transformer. The sum x&#7522; + PE(i) carries both the token&apos;s
          meaning and its position.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Sinusoidal Positional Encoding">
        <p>
          The original &quot;Attention Is All You Need&quot; paper used a fixed, deterministic
          formula based on sine and cosine waves of different frequencies:
        </p>
      </ExplanationBox>

      <MathFormula label="Sinusoidal PE (even dimensions)">
        PE(pos, 2k) = sin(pos / 10000^(2k/d))
      </MathFormula>
      <MathFormula label="Sinusoidal PE (odd dimensions)">
        PE(pos, 2k+1) = cos(pos / 10000^(2k/d))
      </MathFormula>

      <ExplanationBox title="Reading the Sinusoidal Formula">
        <p>
          Each dimension of the positional encoding oscillates at a different frequency.
          Dimension 0 (k=0) oscillates very fast — it completes a full sine cycle every 2*pi ≈ 6
          positions. Dimension 511 (k=255, for d=512) oscillates extremely slowly, barely moving
          across thousands of positions. Together, the d dimensions form a unique &quot;fingerprint&quot;
          for every position, much like binary bits encode a unique integer.
        </p>
        <p>
          A key property: PE(pos+offset) can be expressed as a linear function of PE(pos), so the
          model can learn to attend by relative distance, not just absolute position.
        </p>
        <p>
          Modern models (GPT-2 onwards) typically use <strong>learned positional embeddings</strong>
          instead — a separate trainable vector for each position, optimized end-to-end alongside
          everything else. Rotary Position Embedding (RoPE) and ALiBi are even newer variants used
          in models like LLaMA and GPT-NeoX, offering better length generalization.
        </p>
      </ExplanationBox>

      <WorkedExample title="Positional Encoding: Position 0 (&apos;the&apos;), d = 4">
        <p>
          Let&apos;s compute the four-dimensional sinusoidal PE for position 0 (the first
          &quot;the&quot;) with d = 4, so k ranges over 0 and 1:
        </p>
        <CalcStep number={1}>k = 0, even dim 0: PE(0, 0) = sin(0 / 10000^(0/4)) = sin(0) = 0.000</CalcStep>
        <CalcStep number={2}>k = 0, odd dim 1: PE(0, 1) = cos(0 / 10000^(0/4)) = cos(0) = 1.000</CalcStep>
        <CalcStep number={3}>k = 1, even dim 2: PE(0, 2) = sin(0 / 10000^(2/4)) = sin(0) = 0.000</CalcStep>
        <CalcStep number={4}>k = 1, odd dim 3: PE(0, 3) = cos(0 / 10000^(2/4)) = cos(0) = 1.000</CalcStep>
        <CalcStep number={5}>PE(pos=0) = [0.000, 1.000, 0.000, 1.000]</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Now position 1 (&quot;cat&quot;): the fast dimension (k=0) has already moved — sin(1) ≈ 0.841,
          cos(1) ≈ 0.540 — giving PE(1) = [0.841, 0.540, 0.010, 1.000]. Every position gets a
          distinct vector, and the model adds it directly to the token embedding before any attention
          is computed.
        </p>
      </WorkedExample>
    </div>
  );
}
