'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Central Question Attention Answers">
        <p>
          When the transformer processes the word &quot;sat&quot; in &quot;the cat sat on the mat&quot;,
          it needs to decide: which other words should &quot;sat&quot; look at to build its contextual
          representation? &quot;cat&quot; is important (the subject), &quot;mat&quot; is important
          (the location), but &quot;the&quot; and &quot;on&quot; matter less.
        </p>
        <p>
          <strong>Self-attention</strong> answers this question by letting every token broadcast a
          query (&quot;what am I looking for?&quot;), and every token advertise a key
          (&quot;what do I contain?&quot;). Query-key similarity determines how much attention
          each token pays to each other token. The actual information transferred is called
          the <strong>value</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Projecting Into Q, K, V Space">
        <p>
          For each token embedding x&#7522; (a vector of dimension d), the model learns three separate
          weight matrices W&#x1D410;, W&#x1D40A;, W&#x1D415; (each of shape d x d&#7424;, where d&#7424; is
          the head dimension). Multiplying:
        </p>
      </ExplanationBox>

      <MathFormula label="Query, Key, Value projections">
        Q&#7522; = x&#7522; W&#x1D410; &nbsp;&nbsp;&nbsp; K&#7522; = x&#7522; W&#x1D40A; &nbsp;&nbsp;&nbsp; V&#7522; = x&#7522; W&#x1D415;
      </MathFormula>

      <ExplanationBox title="Why Three Separate Matrices?">
        <p>
          Each matrix plays a different role. W&#x1D410; transforms x&#7522; into a &quot;what am I
          searching for&quot; representation. W&#x1D40A; transforms it into a &quot;what can I offer&quot;
          representation. W&#x1D415; transforms it into &quot;the information I will actually hand over
          if selected.&quot;
        </p>
        <p>
          Using separate matrices gives the model the freedom to represent these three roles
          completely differently. A token&apos;s query might encode syntactic role (verb, noun),
          its key might encode semantic category (action, object), and its value might encode
          the detailed contextual information other tokens actually want to aggregate.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Scaled Dot-Product Attention">
        <p>
          Once we have the Q, K, V matrices for all n tokens (stacked as rows), the full
          attention computation is:
        </p>
      </ExplanationBox>

      <MathFormula label="Scaled dot-product attention">
        Attention(Q, K, V) = softmax(Q K&#7488; / sqrt(d&#7424;)) V
      </MathFormula>

      <ExplanationBox title="Breaking Down the Formula Term by Term">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Q K&#7488;</strong> — matrix multiply Q (shape n x d&#7424;) by K transposed (shape d&#7424; x n).
            The result is an n x n matrix of raw dot-product scores. Entry (i, j) measures how
            well token i&apos;s query aligns with token j&apos;s key — a large positive score means
            &quot;token i should attend strongly to token j.&quot;
          </li>
          <li>
            <strong>/ sqrt(d&#7424;)</strong> — we divide every score by the square root of the head
            dimension. Without this, when d&#7424; is large (e.g. 64), dot products grow proportionally
            to d&#7424; in magnitude, pushing the softmax into regions where gradients vanish.
            Dividing by sqrt(d&#7424;) keeps the variance of the dot products roughly constant at 1,
            regardless of d&#7424;.
          </li>
          <li>
            <strong>softmax(...)</strong> — applied row-wise, this converts each row of raw scores
            into a probability distribution summing to 1. Row i now says: &quot;token i distributes
            its attention across all tokens in these proportions.&quot;
          </li>
          <li>
            <strong>V</strong> — finally, multiply the attention weights (n x n) by V (n x d&#7424;).
            Each output row is a weighted average of all value vectors. Tokens the query scored
            highly contribute more to the output.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Worked Attention: 3 Tokens, d&#7424; = 2">
        <p>
          Let&apos;s trace attention for three tokens from our sentence:
          token 0 = &quot;cat&quot;, token 1 = &quot;sat&quot;, token 2 = &quot;mat&quot;.
          We use a tiny head dimension d&#7424; = 2 so the numbers stay readable.
          Assume (after projection) we have:
        </p>
        <CalcStep number={1}>
          Q = [[1, 0], [0, 1], [1, 1]] &nbsp; (rows: cat, sat, mat queries)
        </CalcStep>
        <CalcStep number={2}>
          K = [[1, 0], [0, 1], [1, 1]] &nbsp; (rows: cat, sat, mat keys)
        </CalcStep>
        <CalcStep number={3}>
          V = [[2, 0], [0, 2], [1, 1]] &nbsp; (rows: cat, sat, mat values)
        </CalcStep>
        <CalcStep number={4}>
          Compute Q K&#7488; (raw scores). Row 1 (&quot;sat&quot; query [0,1]):
          dot with cat key [1,0] = 0, dot with sat key [0,1] = 1, dot with mat key [1,1] = 1.
          Raw scores for sat: [0, 1, 1].
        </CalcStep>
        <CalcStep number={5}>
          Scale by 1/sqrt(2) = 0.707: scaled scores for sat = [0, 0.707, 0.707].
        </CalcStep>
        <CalcStep number={6}>
          softmax([0, 0.707, 0.707]): exp values = [1.000, 2.028, 2.028], sum = 5.056.
          Weights = [0.198, 0.401, 0.401].
        </CalcStep>
        <CalcStep number={7}>
          Weighted sum of V rows: 0.198*[2,0] + 0.401*[0,2] + 0.401*[1,1]
          = [0.396, 0] + [0, 0.802] + [0.401, 0.401] = [0.797, 1.203].
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The output vector [0.797, 1.203] for &quot;sat&quot; blends mostly information from
          &quot;sat&quot; itself and &quot;mat&quot; equally, with a small contribution from
          &quot;cat.&quot; &quot;Cat&quot; scored zero because its key [1,0] is orthogonal to
          &quot;sat&apos;s&quot; query [0,1] — a clear illustration of how query-key alignment
          controls information flow.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Below is <code>scaled_dot_product_attention</code> in numpy, run on the exact
          three-token example traced above.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="transformer.py"
        caption="scaled_dot_product_attention encodes the full Attention(Q,K,V) formula in four readable lines; the worked example verifies the numbers match the manual calculation."
        code={`import numpy as np

# ── continuing from Step 2: X is shape (T, D_MODEL) ────────────────────────

# ── Weight matrices for one attention head ──────────────────────────────────
# In a real model these are learned.  We fix them here so the numbers match
# the worked example (d_k = 2, 3 tokens).
D_K = 2   # head dimension — tiny so we can read the numbers

# Each W matrix projects a d_model-dim token vector into a d_k-dim space.
# Shape of each W: (D_MODEL, D_K)
np.random.seed(0)
W_Q = np.random.randn(8, D_K)
W_K = np.random.randn(8, D_K)
W_V = np.random.randn(8, D_K)

# Use only the first 3 tokens ("cat", "sat", "mat") for the worked example.
X3 = X[:3]   # shape (3, 8)

# Project every token into query / key / value spaces simultaneously.
# Matrix multiply broadcasts over the token dimension automatically.
Q = X3 @ W_Q   # shape (3, D_K) — one query vector per token
K = X3 @ W_K   # shape (3, D_K) — one key   vector per token
V = X3 @ W_V   # shape (3, D_K) — one value  vector per token


# ── Core attention function ─────────────────────────────────────────────────
def scaled_dot_product_attention(Q, K, V):
    d_k = Q.shape[-1]   # head dimension; used for the scaling factor

    # Step 1: raw scores — how well does each query align with each key?
    # Q @ K.T gives an (n, n) matrix; entry [i, j] = dot(query_i, key_j).
    scores = Q @ K.T   # shape (n, n)

    # Step 2: scale to prevent softmax saturation in high dimensions.
    # Without this, large d_k pushes scores into regions where gradients vanish.
    scores = scores / np.sqrt(d_k)

    # Step 3: softmax row-wise — each row becomes a probability distribution.
    # Subtract the row max first (numerically equivalent, avoids overflow).
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)   # shape (n, n)

    # Step 4: weighted sum of value vectors.
    # Each output row is a blend of all value rows, weighted by attention.
    return weights @ V   # shape (n, D_K)


output = scaled_dot_product_attention(Q, K, V)
# output[1] is the new representation of "sat" after attending to all tokens.
`}
      />
    </div>
  );
}
