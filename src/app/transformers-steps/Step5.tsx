'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Transformer Block">
        <p>
          Attention is powerful, but attention alone is not a transformer. A transformer is built
          from <strong>blocks</strong>, each containing two sublayers stacked in sequence:
        </p>
        <ol style={{ lineHeight: '1.9' }}>
          <li><strong>Multi-head self-attention sublayer</strong> — every token gathers context from all others.</li>
          <li><strong>Position-wise feedforward sublayer</strong> — each token representation is independently processed through a small two-layer MLP.</li>
        </ol>
        <p>
          Each sublayer is wrapped in two additional operations: a <strong>residual connection</strong>
          and <strong>layer normalization</strong>. These are not cosmetic — they are what makes
          training transformers with many layers practically possible.
        </p>
      </ExplanationBox>

      <MathFormula label="One transformer block (Pre-LN variant)">
        x&apos; = x + MultiHeadAttn(LayerNorm(x))
      </MathFormula>
      <MathFormula label="">
        x&apos;&apos; = x&apos; + FFN(LayerNorm(x&apos;))
      </MathFormula>

      <ExplanationBox title="Residual Connections: Gradient Highways">
        <p>
          A residual connection adds the block&apos;s input directly to its output: output = F(x) + x.
          The shortcut path ensures that gradients can flow backward through the network without
          passing through every nonlinear transformation. Deep networks without residuals suffer from
          vanishing gradients — the training signal shrinks to near-zero before it reaches the early
          layers. With residuals, the gradient highway carries a strong signal all the way back.
        </p>
        <p>
          There is a beautiful intuition here: if a layer learns nothing useful, it can set its
          weights so F(x) ≈ 0, and the block simply passes x unchanged. This means adding more
          blocks can never hurt in principle — a block can always choose to be an identity function.
          In practice, blocks do learn useful transformations, but this &quot;graceful fallback&quot;
          makes training more stable.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Layer Normalization">
        <p>
          <strong>Layer normalization</strong> standardizes each token&apos;s representation to have
          zero mean and unit variance across its d dimensions, then applies learned scale (gamma) and
          shift (beta) parameters:
        </p>
      </ExplanationBox>

      <MathFormula label="Layer normalization">
        LayerNorm(x) = gamma * (x - mean(x)) / sqrt(var(x) + epsilon) + beta
      </MathFormula>

      <ExplanationBox title="Why Layer Norm, Not Batch Norm?">
        <p>
          Batch normalization normalizes across the batch dimension — it needs many samples to
          estimate stable statistics. For sequences this is awkward: batch sizes are often small,
          and sequences have different lengths. Layer normalization normalizes across the feature
          dimension for a single token at a time, so it works perfectly regardless of batch size
          or sequence length. It is also trivially applied at inference when you process one
          example at a time.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Feedforward Sublayer">
        <p>
          After attention, each token&apos;s vector passes through a <strong>position-wise feedforward
          network (FFN)</strong> independently — the same MLP is applied to every position, with no
          cross-token communication at this stage. A typical FFN expands the dimension by a factor of
          4, applies a nonlinearity, then projects back:
        </p>
      </ExplanationBox>

      <MathFormula label="Feedforward sublayer">
        FFN(x) = max(0, x W&#8321; + b&#8321;) W&#8322; + b&#8322;
      </MathFormula>

      <ExplanationBox title="Role of the FFN">
        <p>
          While attention decides <em>which tokens</em> to combine, the FFN decides <em>how</em> to
          transform the combined representation. Researchers have shown that FFN layers act as
          &quot;key-value memories&quot; — they store factual associations (e.g., &quot;Paris is the
          capital of France&quot;) in their weight matrices. The expansion to 4d (then back to d)
          gives the network a large internal scratchpad to do this computation.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Block Applied to &apos;cat&apos; in Our Sentence">
        <p>
          Let x = embedding of &quot;cat&quot; + positional encoding, with d = 4 for illustration.
          Suppose x = [0.6, -0.2, 0.8, 0.1].
        </p>
        <CalcStep number={1}>LayerNorm(x): mean = (0.6-0.2+0.8+0.1)/4 = 0.325; var ≈ 0.136; normalized ≈ [0.745, -1.424, 1.286, -0.608].</CalcStep>
        <CalcStep number={2}>MultiHeadAttn(normalized): attention gathers context from &quot;the&quot;, &quot;sat&quot; etc. Suppose output = [0.3, 0.5, -0.1, 0.4].</CalcStep>
        <CalcStep number={3}>Residual add: x&apos; = x + attn_output = [0.6+0.3, -0.2+0.5, 0.8-0.1, 0.1+0.4] = [0.9, 0.3, 0.7, 0.5].</CalcStep>
        <CalcStep number={4}>LayerNorm(x&apos;): mean = 0.6; normalized ≈ [0.894, -0.894, 0.298, -0.298].</CalcStep>
        <CalcStep number={5}>FFN(normalized): expand to 16 dims via W&#8321;, apply ReLU, project back to 4 dims. Suppose output = [0.2, -0.1, 0.3, 0.0].</CalcStep>
        <CalcStep number={6}>Residual add: x&apos;&apos; = x&apos; + ffn_output = [0.9+0.2, 0.3-0.1, 0.7+0.3, 0.5+0.0] = [1.1, 0.2, 1.0, 0.5].</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          After one block, &quot;cat&quot; now carries contextual information from its neighbors
          while its original signal is preserved via residuals. Stack 12, 24, or 96 such blocks
          and each layer refines the representation further.
        </p>
      </WorkedExample>

      <ExplanationBox title="Stacking Blocks Into Depth">
        <p>
          A transformer model is simply N identical blocks stacked sequentially. The same token
          sequence flows through block 1, then block 2, ..., then block N. With each block, each
          token&apos;s representation becomes richer and more abstract:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Early blocks tend to capture local syntax (part of speech, phrase boundaries).</li>
          <li>Middle blocks tend to capture relational structure (subject-verb agreement, coreference).</li>
          <li>Late blocks tend to capture high-level semantics (sentiment, topic, factual associations).</li>
        </ul>
        <p>
          GPT-2 Small uses 12 blocks, GPT-3 uses 96 blocks, and some frontier models use hundreds.
          More depth consistently improves quality — but there are diminishing returns, which is why
          width (d) and data also matter alongside depth.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          A single transformer block assembles everything built so far: layer norm, multi-head
          attention, a residual add, then the same pattern again with the feedforward network.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="transformer.py"
        caption="transformer_block is the single repeating unit of every transformer; stacking N of them gives the full model depth."
        code={`import numpy as np

# ── Layer normalisation ─────────────────────────────────────────────────────
# Normalises each token vector independently across its D_MODEL dimensions.
# gamma and beta are learned scale/shift parameters (initialised to 1 and 0).
def layer_norm(X, gamma, beta, eps=1e-6):
    mean = X.mean(axis=-1, keepdims=True)          # (T, 1) — per-token mean
    var  = X.var(axis=-1, keepdims=True)           # (T, 1) — per-token variance
    X_hat = (X - mean) / np.sqrt(var + eps)        # zero mean, unit variance
    return gamma * X_hat + beta                    # learned rescale and shift


# ── Feedforward network (position-wise MLP) ─────────────────────────────────
# The SAME two-layer MLP is applied independently to every token position.
# Typical expansion factor is 4: inner dimension = 4 * D_MODEL.
D_FF = 4 * 8   # = 32 for our tiny D_MODEL = 8

np.random.seed(2)
W1 = np.random.randn(8, D_FF) * 0.02   # first layer expands d -> 4d
b1 = np.zeros(D_FF)
W2 = np.random.randn(D_FF, 8) * 0.02   # second layer projects 4d -> d
b2 = np.zeros(8)

def feedforward(X):
    # Expand: linear then ReLU nonlinearity.
    # ReLU introduces the non-linearity that lets the FFN store facts.
    hidden = np.maximum(0, X @ W1 + b1)   # ReLU: max(0, x), shape (T, D_FF)
    return hidden @ W2 + b2               # project back, shape (T, D_MODEL)


# ── Learned layer-norm parameters (one set per sublayer) ────────────────────
gamma1 = np.ones(8);  beta1 = np.zeros(8)   # for pre-attention layer norm
gamma2 = np.ones(8);  beta2 = np.zeros(8)   # for pre-FFN layer norm


# ── One complete transformer block (Pre-LN style) ───────────────────────────
# Pre-LN applies layer norm BEFORE the sublayer (more training-stable than post-LN).
def transformer_block(X, mask=None):
    # ---- Sublayer 1: multi-head self-attention ----
    # Apply layer norm first, then attention, then add residual.
    normed = layer_norm(X, gamma1, beta1)           # stabilise before attention
    attn_out = multihead_attention(normed, mask)    # gather context across tokens
    X = X + attn_out                               # residual: preserve the original signal

    # ---- Sublayer 2: position-wise feedforward ----
    # Same pattern: norm -> transform -> residual add.
    normed2  = layer_norm(X, gamma2, beta2)
    ffn_out  = feedforward(normed2)                # transform each token independently
    X = X + ffn_out                               # residual again

    return X   # shape unchanged: (T, D_MODEL)


# Run our sentence through one block (with causal mask from Step 4).
mask  = causal_mask(len(token_ids))
X_out = transformer_block(X, mask=mask)   # (T, D_MODEL)
# Stack N such calls to build a full N-layer transformer.
`}
      />
    </div>
  );
}
