'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Pretraining Is">
        <p>
          Pretraining is the first and most expensive phase of building an LLM. The model is
          shown an astronomically large amount of text — web pages, books, code, scientific
          papers, forums — and trained to predict the next token at every position in every
          document.
        </p>
        <p>
          No human ever labels this data. The supervision signal comes entirely from the text
          itself: the ground-truth &quot;answer&quot; at position <em>t</em> is just the token
          that actually appears at position <em>t+1</em> in the document. This is why it&apos;s
          called <strong>self-supervised learning</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Training Objective: Cross-Entropy Loss">
        <p>
          At each step the model outputs a probability distribution over its vocabulary
          (typically 32,000 to 128,000 tokens). The loss measures how surprised the model is
          by the true next token. Formally this is the <strong>cross-entropy loss</strong>:
        </p>
      </ExplanationBox>

      <MathFormula label="Cross-Entropy Loss (single token)">
        L = -log P(token_true | context)
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          If the model assigns probability 0.9 to the correct token, the loss is
          -log(0.9) ≈ 0.105 — small, good. If it assigns only 0.01, the loss is
          -log(0.01) ≈ 4.6 — large, bad. Gradient descent nudges the model&apos;s
          weights to push probability mass toward the correct token.
        </p>
        <p>
          Over trillions of such steps, the model&apos;s weights encode an enormous compressed
          model of language and the world — because accurately predicting the next word about
          physics requires knowing some physics, predicting code requires knowing syntax, and
          so on.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Here is what the pretraining cross-entropy objective looks like in actual PyTorch code.
          Notice how the labels are simply the input tokens shifted left by one position —
          that&apos;s the &quot;self-supervised&quot; signal.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="pretrain_loss.py"
        caption="Next-token cross-entropy loss: labels are the input sequence shifted left by one."
        code={`import torch
import torch.nn.functional as F

# input_ids shape: (batch_size, sequence_length)
# Each row is a tokenised document from the pretraining corpus.
input_ids = batch["input_ids"]   # e.g. shape (8, 2048)

# Run the model forward pass to get raw logits over the vocabulary.
# logits shape: (batch_size, sequence_length, vocab_size)
logits = model(input_ids).logits

# SHIFT: the model predicts token at position t+1 from position t.
# So we drop the last logit and the first label token.
shift_logits = logits[:, :-1, :]    # predict positions 1 .. T
shift_labels = input_ids[:, 1:]     # ground truth:  positions 1 .. T

# cross_entropy expects (N, C) logits and (N,) integer labels.
# .reshape(-1, vocab_size) flattens batch and time into one dimension.
vocab_size = shift_logits.size(-1)
loss = F.cross_entropy(
    shift_logits.reshape(-1, vocab_size),   # shape: (batch * (T-1), vocab)
    shift_labels.reshape(-1),               # shape: (batch * (T-1),)
)

# loss is a scalar: the mean negative log-likelihood across every token.
# Gradient descent minimises this, nudging the model toward higher
# probability on the true next token at every position.
loss.backward()
optimizer.step()
optimizer.zero_grad()`}
      />

      <ExplanationBox title="Data Scale">
        <p>
          Modern base models train on roughly <strong>1–15 trillion tokens</strong>. To put
          that in perspective, a single token is roughly 3/4 of an English word. The full
          text of Wikipedia in English is about 4 billion tokens — a rounding error on a
          modern pretraining corpus.
        </p>
        <p>
          The corpus is typically assembled from:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Web crawls</strong> (Common Crawl, C4, FineWeb) — the bulk of the data</li>
          <li><strong>Books</strong> — long-form reasoning and narrative</li>
          <li><strong>Code repositories</strong> (GitHub) — crucial for coding ability</li>
          <li><strong>Scientific papers and curated high-quality text</strong></li>
        </ul>
        <p>
          Data quality matters enormously. Deduplication, filtering out low-quality pages, and
          carefully mixing different domains all have measurable effects on the resulting
          model&apos;s capabilities.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Compute Scale">
        <p>
          Training a frontier model requires hundreds to thousands of GPUs or TPUs running
          continuously for weeks or months. The training compute for models like GPT-4 or
          Llama 3 is estimated in the <strong>10²³ to 10²⁵ floating-point operations (FLOPs)</strong>
          range — far beyond what a single machine could ever do.
        </p>
        <p>
          A useful rule of thumb from the <em>Chinchilla</em> scaling paper (Hoffmann et al., 2022)
          is that a model with <em>N</em> parameters should train on roughly <strong>20 &times; N tokens</strong>
          to be compute-optimal. A 7 billion parameter model, for example, benefits from around
          140 billion tokens of training data at minimum — though in practice many models train
          on far more.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What the Base Model Knows (and Doesn&apos;t)">
        <p>
          After pretraining, the model is impressive but raw. It can:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Complete text in the style of any genre it saw during training</li>
          <li>Answer factual questions if the answer pattern appears in training text</li>
          <li>Write and explain code</li>
          <li>Reason through problems — to a surprising degree, just from next-token prediction</li>
        </ul>
        <p>
          But it <strong>cannot</strong> reliably follow instructions, maintain a helpful
          conversational persona, or refuse harmful requests. If you prompt a raw base model
          with &quot;Tell me how to do X,&quot; it will continue the text in whatever direction
          looks most likely — it might answer, ignore you, or roleplay a character. It has no
          concept of being an &quot;assistant.&quot;
        </p>
        <p>
          That&apos;s what the post-training stages are for.
        </p>
      </ExplanationBox>
    </div>
  );
}
