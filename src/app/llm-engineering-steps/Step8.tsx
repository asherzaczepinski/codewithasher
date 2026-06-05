'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Evaluating LLMs: The Core Challenge">
        <p>
          How do you know if your model is getting better? Evaluation is harder for LLMs
          than for most ML systems because the outputs are open-ended text. There is rarely
          a single correct answer to compare against.
        </p>
        <p>
          Evaluation approaches fall into three categories:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Automated benchmarks</strong> — standardized tasks with known answers:
          MMLU (knowledge), HumanEval (coding), GSM8K (math reasoning), HellaSwag (commonsense).</li>
          <li><strong>Perplexity</strong> — an intrinsic measure of how well the model predicts
          held-out text. Lower is better.</li>
          <li><strong>LLM-as-judge</strong> — a strong model (e.g., GPT-4) rates or compares
          outputs, enabling scalable evaluation of open-ended quality without human annotators.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Perplexity">
        <p>
          <strong>Perplexity</strong> measures how &quot;surprised&quot; the model is by a
          test corpus. It is the exponentiated average cross-entropy loss over N tokens.
          Intuitively, a perplexity of 10 means the model behaves as if it is choosing
          uniformly among 10 options at every step — the lower, the more confident and
          accurate it is.
        </p>
      </ExplanationBox>

      <MathFormula label="Perplexity">
        PPL = exp(-(1/N) &times; sum of log P(token_i | context_i) for i = 1 to N)
      </MathFormula>

      <WorkedExample title="Computing Perplexity on a Short Sequence">
        <p>
          Suppose our model assigns the following log-probabilities to a 4-token test sequence:
        </p>
        <CalcStep number={1}>
          Token 1: log P = -1.2 &nbsp;&nbsp; Token 2: log P = -0.8 &nbsp;&nbsp; Token 3: log P = -2.1 &nbsp;&nbsp; Token 4: log P = -1.5
        </CalcStep>
        <CalcStep number={2}>
          Average log probability = -(1/4) &times; (-1.2 + -0.8 + -2.1 + -1.5) = -(1/4) &times; (-5.6) = 1.4
        </CalcStep>
        <CalcStep number={3}>
          But we need the negative average: -(average log P) = -(-1.4) = 1.4
        </CalcStep>
        <CalcStep number={4}>
          Perplexity = exp(1.4) ≈ 4.06
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A perplexity of 4.06 means the model is, on average, as uncertain as if it were
          choosing uniformly among about 4 equally likely tokens. Modern LLMs on clean English
          text typically achieve perplexity in the range of 5 to 20, depending on the corpus.
        </p>
      </WorkedExample>

      <ExplanationBox title="Making Models Smaller: Distillation, Quantization, and Pruning">
        <p>
          Frontier models are expensive to serve. Three techniques shrink them for deployment:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Knowledge Distillation:</strong> A large &quot;teacher&quot; model trains
            a smaller &quot;student&quot; model to mimic its output distributions — not just
            the hard labels, but the full probability distribution over tokens. The student
            learns to be approximately as capable as the teacher despite having far fewer
            parameters.
          </li>
          <li>
            <strong>Quantization:</strong> Model weights are stored in lower precision —
            INT8, INT4, or even INT2 — instead of the default FP16 or BF16. A 4-bit quantized
            model uses 4x less memory than a 16-bit model with modest quality degradation.
            Techniques like GPTQ and AWQ are commonly used for post-training quantization.
          </li>
          <li>
            <strong>Pruning:</strong> Weights or entire attention heads that contribute
            little to model output are set to zero or removed. Structured pruning removes
            whole neurons or layers, making the model genuinely smaller and faster.
            Unstructured pruning zeroes individual weights, which only helps if hardware
            can exploit sparsity.
          </li>
        </ul>
        <p>
          In practice, quantization (especially 4-bit with QLoRA) is the most accessible
          technique — it requires no retraining and delivers large memory savings.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Inference Optimization and the KV Cache">
        <p>
          Serving an LLM at scale requires careful attention to latency, throughput, and
          memory. The key data structure is the <strong>KV cache</strong>:
        </p>
        <p>
          During generation, every token the model produces becomes part of the context
          for the next token. The transformer&apos;s attention mechanism needs to compute
          keys and values for every past token. The KV cache stores these computed keys
          and values so they do not need to be recomputed on every generation step.
          Without the KV cache, inference cost would scale quadratically with sequence
          length; with it, each new token requires only one new computation step.
        </p>
        <p>
          Other inference optimization techniques include:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Batching:</strong> Processing multiple requests in parallel to maximize
          GPU utilization. Continuous batching (used in vLLM) keeps GPU utilization high
          even with variable-length requests.</li>
          <li><strong>Speculative decoding:</strong> A fast small model generates several
          candidate tokens; the large model verifies them in one forward pass. This can
          deliver 2-3x speedups when the small model is right most of the time.</li>
          <li><strong>Flash Attention:</strong> A memory-efficient attention implementation
          that avoids materializing the full attention matrix, reducing memory use and
          improving speed for long contexts.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Serving Models in Production">
        <p>
          Production LLM serving stacks (vLLM, TGI, TensorRT-LLM) handle routing, batching,
          KV cache management, and autoscaling. Key metrics to monitor:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Time to First Token (TTFT):</strong> Latency until the first response
          token is produced. Critical for perceived responsiveness.</li>
          <li><strong>Tokens per second (throughput):</strong> How many output tokens the
          system produces across all concurrent users.</li>
          <li><strong>GPU memory utilization:</strong> KV cache competes with model weights;
          full memory means requests queue up.</li>
        </ul>
        <p>
          Multimodal models (vision-language models like GPT-4V, Gemini) and code-specialized
          models (e.g., CodeLlama) follow the same lifecycle — pretraining on domain-specific
          data, SFT, alignment — but with modality-specific encoders and training data mixed in.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Wrap-Up">
        <p>
          You&apos;ve now traced the complete lifecycle of an LLM: from the raw self-supervised
          pretraining objective, through instruction tuning and RLHF alignment, parameter-efficient
          fine-tuning with LoRA, all the way to prompting, RAG, safety, evaluation, and
          production serving.
        </p>
        <p>
          The field moves fast. New alignment techniques, better PEFT methods, longer context
          windows, and more capable base models appear every few months. But the underlying
          engineering questions are stable: how do you make a model do what you want, safely,
          cheaply, and at scale? You now have the vocabulary and the conceptual grounding
          to engage with those questions at a professional level.
        </p>
        <p>
          Congratulations on completing the LLM Engineering course.
        </p>
      </ExplanationBox>
    </div>
  );
}
