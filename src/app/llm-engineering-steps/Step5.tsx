'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Why Full Fine-Tuning Is Expensive">
        <p>
          Every parameter in a language model is a floating-point number stored in memory.
          A 7 billion parameter model in 32-bit precision occupies roughly 28 GB of memory
          just to store the weights — before you account for optimizer states (Adam stores
          two additional values per parameter) and activations needed for backpropagation.
          In practice, full fine-tuning a 7B model requires well over 100 GB of GPU memory,
          meaning multiple high-end GPUs and significant cloud compute costs.
        </p>
        <p>
          For most teams — and for most use cases — that&apos;s impractical. Parameter-Efficient
          Fine-Tuning (PEFT) methods solve this by updating only a small fraction of the
          parameters while keeping the rest frozen.
        </p>
      </ExplanationBox>

      <ExplanationBox title="LoRA: Low-Rank Adaptation">
        <p>
          <strong>LoRA</strong> (Hu et al., 2021) is the most widely adopted PEFT method.
          The core insight is that the update to a weight matrix during fine-tuning tends to
          have a low &quot;intrinsic rank&quot; — meaning it can be well-approximated by the
          product of two much smaller matrices.
        </p>
        <p>
          Instead of directly updating a weight matrix W (shape d &times; k), LoRA freezes W
          and introduces two small trainable matrices A (shape d &times; r) and B (shape
          r &times; k), where r is the rank and r &lt;&lt; min(d, k). The effective weight
          used at inference time is:
        </p>
      </ExplanationBox>

      <MathFormula label="LoRA Forward Pass">
        W_effective = W_frozen + (A &times; B) &times; (alpha / r)
      </MathFormula>

      <ExplanationBox title="What alpha / r Means">
        <p>
          The scaling factor alpha / r controls how strongly the adapter influences the output.
          Alpha is a hyperparameter (commonly set equal to r, so the scaling factor is 1).
          During training, only A and B are updated; W stays frozen. At inference time,
          A &times; B can be merged into W, so there is <strong>zero added latency</strong>
          compared to the original model.
        </p>
      </ExplanationBox>

      <WorkedExample title="LoRA Parameter Savings: A Concrete Example">
        <p>
          Let&apos;s calculate how many parameters LoRA trains vs. full fine-tuning for a
          single attention weight matrix in a typical 7B model. A common size for the query
          projection matrix is 4096 &times; 4096, and LoRA rank is typically set to 16 or 64.
          We&apos;ll use rank r = 16.
        </p>

        <CalcStep number={1}>
          Full matrix size: d = 4096, k = 4096. Total parameters = d &times; k = 4096 &times; 4096 = 16,777,216
        </CalcStep>
        <CalcStep number={2}>
          LoRA matrix A: shape d &times; r = 4096 &times; 16 = 65,536 parameters
        </CalcStep>
        <CalcStep number={3}>
          LoRA matrix B: shape r &times; k = 16 &times; 4096 = 65,536 parameters
        </CalcStep>
        <CalcStep number={4}>
          Total LoRA parameters for this matrix: 65,536 + 65,536 = 131,072
        </CalcStep>
        <CalcStep number={5}>
          Reduction factor: 16,777,216 / 131,072 = 128x fewer parameters trained per matrix
        </CalcStep>
        <CalcStep number={6}>
          Across a full 7B model with LoRA applied to all attention projections (Q, K, V, O
          in each of ~32 layers), total trainable parameters drop from ~7 billion to
          roughly 4 to 40 million — under 1% of the model.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          This means a 7B model can be fine-tuned on a <strong>single GPU with 24 GB of
          VRAM</strong> using LoRA, compared to multiple high-end GPUs for full fine-tuning.
          The quality is often competitive with full fine-tuning on narrow tasks.
        </p>
      </WorkedExample>

      <ExplanationBox title="Other PEFT Methods">
        <p>
          LoRA is the most popular PEFT technique, but others exist:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>QLoRA</strong> — LoRA applied on top of a 4-bit quantized base model.
            The base model is stored in NF4 format (a data type designed for normally
            distributed weights), further slashing memory. This makes fine-tuning 70B
            models feasible on consumer hardware.
          </li>
          <li>
            <strong>Prefix Tuning / Prompt Tuning</strong> — Instead of modifying weight
            matrices, a small set of trainable &quot;virtual tokens&quot; is prepended to
            every input. The model weights are entirely frozen; only these prefix vectors
            are trained. Works well for simple task adaptation but less effective than
            LoRA on complex tasks.
          </li>
          <li>
            <strong>Adapters</strong> — Small bottleneck layers inserted between transformer
            layers. These are slightly more parameter-heavy than LoRA but similarly
            freeze the base model.
          </li>
        </ul>
        <p>
          In practice, <strong>QLoRA</strong> has become the go-to choice for fine-tuning
          large models on limited hardware, while full LoRA (without quantization) is
          preferred when GPU memory is not the bottleneck and maximum quality matters.
        </p>
      </ExplanationBox>

      <ExplanationBox title="When to Fine-Tune vs. Prompt">
        <p>
          Fine-tuning is not always the right answer. Prompting is faster, cheaper, and
          reversible. Fine-tune when:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>The task requires a specific output format or style that prompting cannot reliably achieve</li>
          <li>You need the model to internalize domain-specific knowledge not in its pretraining data</li>
          <li>You are serving the model at high volume and want to reduce prompt length (token cost)</li>
          <li>Latency requirements prohibit long system prompts</li>
        </ul>
        <p>
          In most other cases, a well-crafted prompt — possibly with RAG — gets you very far
          without any fine-tuning. We&apos;ll cover prompting in depth next.
        </p>
      </ExplanationBox>
    </div>
  );
}
