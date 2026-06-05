'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Transformers Beyond Language">
        <p>
          The transformer was invented for text, but the architecture is indifferent to modality.
          It needs a sequence of vectors — what those vectors represent is up to the designer.
          This insight has produced transformers that process images, audio, video, protein sequences,
          and arbitrary combinations of modalities. We cover the two most important extensions:
          vision and multimodal, then close with the empirical laws that govern how transformers
          scale.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Vision Transformer (ViT): Images as Patches">
        <p>
          A standard image of 224 x 224 pixels contains 50,176 pixels. Treating each pixel as a
          token would produce a sequence of 50,176 — far too long for a standard transformer.
          The <strong>Vision Transformer (ViT, Dosovitskiy et al. 2020)</strong> solves this by
          splitting the image into non-overlapping <em>patches</em>.
        </p>
        <p>
          For patch size 16 x 16, a 224 x 224 image yields 196 patches (14 x 14 grid). Each patch
          is flattened into a vector of length 16 x 16 x 3 = 768 (for RGB images) and linearly
          projected to the model&apos;s embedding dimension d. A learnable [CLS] token is prepended,
          and learnable positional embeddings are added — the same architecture we covered in Module 2,
          applied to image patches instead of text tokens.
        </p>
        <p>
          The full transformer then runs self-attention across the 197 tokens (196 patches + [CLS]).
          At the end, the [CLS] token&apos;s output is used for classification. ViT matches and
          exceeds convolutional networks on large-scale image recognition when trained on enough data.
        </p>
      </ExplanationBox>

      <MathFormula label="ViT patch embedding">
        x&#7522; = Flatten(patch&#7522;) W_proj + b_proj &nbsp;&nbsp; shape: (d,)
      </MathFormula>

      <ExplanationBox title="Multimodal Transformers">
        <p>
          Once images and text are both sequences of vectors in the same embedding dimension d,
          combining them is conceptually straightforward: <strong>concatenate the token sequences
          and run a joint transformer</strong>.
        </p>
        <p>
          Consider processing &quot;the cat sat on the mat&quot; alongside an image of a cat on a mat.
          The text tokens and image patch embeddings are projected into a shared d-dimensional space,
          concatenated into one long sequence, and fed to the transformer. Self-attention can then
          route information freely between text and image — a text token about &quot;cat&quot; can
          directly attend to the image patch containing the cat.
        </p>
        <p>
          Modern multimodal models (Flamingo, LLaVA, GPT-4o) use variants of this approach:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Early fusion:</strong> raw tokens from all modalities mixed from the first block.</li>
          <li><strong>Cross-modal attention:</strong> separate encoders per modality, then cross-attention between them (similar to encoder-decoder cross-attention).</li>
          <li><strong>Adapter tokens:</strong> a small set of learned query tokens (Perceiver Resampler) compress a large visual token sequence into a fixed-size set before fusing with text.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Neural Scaling Laws">
        <p>
          One of the most surprising findings of the transformer era is that model quality obeys
          smooth, predictable power laws as a function of scale. <strong>Kaplan et al. (2020)</strong>
          at OpenAI established the foundational scaling laws for language models, later refined
          by DeepMind&apos;s <strong>Chinchilla paper (Hoffmann et al. 2022)</strong>.
        </p>
        <p>
          The loss L on a language modeling task follows:
        </p>
      </ExplanationBox>

      <MathFormula label="Empirical scaling law (simplified Kaplan form)">
        L(N, D) ≈ A / N^alpha + B / D^beta + L_irreducible
      </MathFormula>

      <ExplanationBox title="Reading the Scaling Law">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>N</strong> is the number of model parameters. More parameters reduce loss
            at a rate governed by alpha (empirically ≈ 0.076 for language).
          </li>
          <li>
            <strong>D</strong> is the number of training tokens. More data reduces loss at a
            rate governed by beta (empirically ≈ 0.095).
          </li>
          <li>
            <strong>L_irreducible</strong> is the irreducible entropy of the data — even a
            perfect model cannot predict truly random text. This floor bounds how low loss can go.
          </li>
        </ul>
        <p>
          The Chinchilla result refined this: for a given compute budget C ≈ 6ND (each token
          forward-and-backward costs roughly 6 FLOPs per parameter), the optimal allocation is
          to scale N and D equally. This overturned the earlier practice of training very large
          models on too little data — a 70B model trained on 1.4T tokens (Chinchilla) outperforms
          a 280B model trained on 300B tokens (Gopher) at the same compute cost.
        </p>
      </ExplanationBox>

      <WorkedExample title="Scaling Law Trade-off: 10^23 FLOPs Budget">
        <p>
          Suppose you have a compute budget of 10^23 FLOPs. Using C ≈ 6ND, we explore two
          allocations and estimate their loss (using illustrative numbers):
        </p>
        <CalcStep number={1}>Option A: N = 70B params, D = 10^23 / (6 x 70x10^9) ≈ 238B tokens. Balanced allocation.</CalcStep>
        <CalcStep number={2}>Option B: N = 280B params, D = 10^23 / (6 x 280x10^9) ≈ 60B tokens. Large model, data-starved.</CalcStep>
        <CalcStep number={3}>Apply Chinchilla formula: L(70B, 238B) ≈ 2.10. L(280B, 60B) ≈ 2.25. Option A wins by ~0.15 nats.</CalcStep>
        <CalcStep number={4}>Practical conclusion: for a fixed budget, train a smaller model on more data rather than a larger model on less data.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          This principle has shaped every major model family released since 2022. LLaMA, Mistral,
          and Gemma all use smaller parameter counts with far more training tokens than prior
          models of similar quality.
        </p>
      </WorkedExample>

      <ExplanationBox title="Course Wrap-Up: The Full Picture">
        <p>
          You have now traced &quot;the cat sat on the mat&quot; through the complete transformer
          pipeline:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Text tokenized into integer IDs, embedded into vectors, position-encoded.</li>
          <li>Each token computing Q, K, V projections and attending to all others via scaled dot-product attention.</li>
          <li>Multiple heads running in parallel, each specializing in different relationship types.</li>
          <li>Attention wrapped in residual connections and layer norm; followed by a feedforward sublayer.</li>
          <li>Blocks stacked N deep; encoder/decoder/both depending on the task.</li>
          <li>Autoregressive generation producing one token at a time, accelerated by a KV cache.</li>
          <li>The same architecture applied to image patches, audio, and mixed modalities.</li>
          <li>Scaling laws predicting that more data and parameters reliably yield lower loss.</li>
        </ul>
        <p>
          Every modern LLM — GPT, Claude, Gemini, LLaMA, Mistral, Falcon — is a transformer.
          You now understand why.
        </p>
      </ExplanationBox>
    </div>
  );
}
