'use client';

import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

// A simple stacked-block diagram of a transformer.
function BlockStack() {
  const blocks = [
    { label: 'Multi-Head Attention', sub: 'tokens look at each other', fill: '#ede9fe', stroke: '#7c3aed' },
    { label: 'Add & Normalize', sub: 'keep signals stable', fill: '#f1f5f9', stroke: '#94a3b8' },
    { label: 'Feed-Forward Network', sub: 'a small neural net per token', fill: '#dbeafe', stroke: '#2563eb' },
    { label: 'Add & Normalize', sub: 'keep signals stable', fill: '#f1f5f9', stroke: '#94a3b8' },
  ];
  return (
    <div className="bs-box">
      <div className="bs-stack">
        <div className="bs-flow">output to next block ↑</div>
        {blocks.map((b, i) => (
          <div key={i} className="bs-block" style={{ background: b.fill, borderColor: b.stroke }}>
            <span className="bs-label" style={{ color: b.stroke }}>{b.label}</span>
            <span className="bs-sub">{b.sub}</span>
          </div>
        ))}
        <div className="bs-flow">input tokens (with positions) ↑</div>
      </div>
      <p className="bs-cap">One <strong>transformer block</strong>. Real models stack dozens of these.</p>
      <style jsx>{`
        .bs-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .bs-stack { display: flex; flex-direction: column-reverse; gap: 0.5rem; max-width: 360px; margin: 0 auto; }
        .bs-block { padding: 0.7rem 1rem; border: 1.5px solid; border-radius: 10px; display: flex; flex-direction: column; }
        .bs-label { font-weight: 700; font-size: 14px; }
        .bs-sub { font-size: 12px; color: #64748b; }
        .bs-flow { text-align: center; font-size: 11px; color: #94a3b8; }
        .bs-cap { margin: 1rem 0 0; text-align: center; font-size: 13px; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="One Block: Attention + a Little Neural Network">
        <p>
          Attention lets tokens share information. But sharing alone isn&apos;t enough — the model also needs
          to <em>think</em> about what it gathered. So a <strong>transformer block</strong> pairs attention
          with a small neural network, the same kind you built in the last course:
        </p>
        <BlockStack />
        <p>
          The <strong>attention</strong> sublayer mixes information across tokens. The{' '}
          <strong>feed-forward network</strong> then processes each token on its own — a couple of dense
          layers with an activation, applied identically to every position. Attention decides{' '}
          <em>what to look at</em>; the feed-forward net decides <em>what to make of it</em>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Two Helpers: Residuals and LayerNorm">
        <p>
          Notice the &quot;Add &amp; Normalize&quot; strips. They&apos;re what make deep stacks trainable:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>Add (residual connection):</strong> each sublayer adds its result <em>on top of</em> its
            input instead of replacing it. So information never gets lost, and gradients flow cleanly back
            through many layers — the antidote to the vanishing-gradient problem from the neural network course.
          </li>
          <li>
            <strong>Normalize (LayerNorm):</strong> rescales each token&apos;s vector to a steady range so the
            numbers don&apos;t explode or collapse as they pass through dozens of blocks.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Don't Forget Position">
        <p>
          Attention has a quirk: by itself it treats the input as an unordered <em>bag</em> of tokens — it has
          no built-in sense of which word came first. But &quot;dog bites man&quot; and &quot;man bites dog&quot;
          mean very different things! So before the first block, the model adds a{' '}
          <strong>positional encoding</strong> to each embedding — a signal that says &quot;this is token 1,
          this is token 2,&quot; and so on. Now order is part of the representation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Stack It Deep">
        <p>
          Here&apos;s the whole trick: take that one block and <strong>stack it</strong>. The output of block 1
          becomes the input to block 2, and so on — small models use a handful, large ones use dozens or more.
          Early blocks pick up surface patterns (grammar, nearby words); deeper blocks build abstract meaning
          (who did what to whom, tone, intent).
        </p>
        <p>
          That tall stack of identical blocks — embeddings in at the bottom, refined representations out the
          top — <strong>is</strong> the transformer, the architecture behind essentially every modern LLM.
          All that&apos;s left is to turn the top of the stack back into a word. That&apos;s the final step.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="llm.py"
        caption="One transformer block: self-attention + feed-forward network, each wrapped in a residual connection and LayerNorm."
        code={`import numpy as np

# ---------------------------------------------------------------------------
# STEP 4 — TRANSFORMER BLOCK
# One block = attention sublayer + feed-forward sublayer.
# Both sublayers are wrapped with the same two helpers:
#   Residual ("Add"): output = sublayer(x) + x
#   LayerNorm:        rescale each token's vector to mean=0, std=1 then
#                     apply learned scale (gamma) and shift (beta).
# ---------------------------------------------------------------------------

def layer_norm(x, gamma, beta, eps=1e-6):
    # Normalise across the feature dimension (axis=-1, i.e. per token).
    # eps prevents division by zero when the variance is nearly zero.
    mean = x.mean(axis=-1, keepdims=True)
    var  = x.var(axis=-1,  keepdims=True)
    x_hat = (x - mean) / np.sqrt(var + eps)
    # gamma and beta are learned scalars that let the model undo
    # the normalisation if the raw values were actually useful.
    return gamma * x_hat + beta

def relu(x):
    # Rectified Linear Unit: zero-out anything negative.
    # This is the nonlinearity that lets the network model complex patterns.
    return np.maximum(0, x)

def feed_forward(x, W1, b1, W2, b2):
    # A two-layer "MLP" applied independently to every token position.
    # The inner dimension is typically 4x d_model (e.g. 2048 when d_model=512).
    hidden = relu(x @ W1 + b1)   # expand to a wider representation
    return hidden @ W2 + b2       # project back to d_model

def transformer_block(x, Wq, Wk, Wv, W1, b1, W2, b2,
                       gamma1, beta1, gamma2, beta2):
    # ---- sublayer 1: multi-head self-attention (single head here) ----

    # Project to Q, K, V.
    Q = x @ Wq
    K = x @ Wk
    V = x @ Wv

    # Scaled dot-product attention (from Step 3).
    d_k     = Q.shape[-1]
    scores  = (Q @ K.T) / np.sqrt(d_k)
    weights = np.exp(scores - scores.max(axis=-1, keepdims=True))
    weights = weights / weights.sum(axis=-1, keepdims=True)
    attn_out = weights @ V          # shape: (seq_len, d_model)

    # Residual connection: add the original input back in.
    # This lets gradients skip directly through the block during training,
    # solving the vanishing-gradient problem for deep stacks.
    x = layer_norm(x + attn_out, gamma1, beta1)

    # ---- sublayer 2: position-wise feed-forward network ----

    ff_out = feed_forward(x, W1, b1, W2, b2)

    # Another residual + LayerNorm — same logic, applied after the FFN.
    x = layer_norm(x + ff_out, gamma2, beta2)

    return x   # same shape as input: (seq_len, d_model)

# --- tiny worked example ---
np.random.seed(1)
seq_len = 3
d_model = 4
d_ff    = 8   # feed-forward hidden size (normally 4 * d_model)

X = np.random.randn(seq_len, d_model)   # token embeddings in

# Randomly initialised weight matrices (learned during training).
Wq = np.random.randn(d_model, d_model) * 0.1
Wk = np.random.randn(d_model, d_model) * 0.1
Wv = np.random.randn(d_model, d_model) * 0.1
W1 = np.random.randn(d_model, d_ff)    * 0.1
b1 = np.zeros(d_ff)
W2 = np.random.randn(d_ff, d_model)    * 0.1
b2 = np.zeros(d_model)

# LayerNorm parameters: start at gamma=1, beta=0 (identity transform).
gamma1 = np.ones(d_model);  beta1 = np.zeros(d_model)
gamma2 = np.ones(d_model);  beta2 = np.zeros(d_model)

out = transformer_block(X, Wq, Wk, Wv, W1, b1, W2, b2,
                         gamma1, beta1, gamma2, beta2)

print("input  shape:", X.shape)    # (3, 4)
print("output shape:", out.shape)  # (3, 4)  -- same! ready for the next block`}
      />
    </div>
  );
}
