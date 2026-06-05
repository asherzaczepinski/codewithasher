'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Problem with a Raw Base Model">
        <p>
          A pretrained base model is like a very well-read person who has never held a job.
          They know a vast amount, but they haven&apos;t learned the social contract of a workplace:
          how to respond when asked a question, how to structure an answer helpfully, or when
          to say &quot;I don&apos;t know.&quot;
        </p>
        <p>
          Give a base model the prompt <em>&quot;Explain gradient descent in simple terms&quot;</em>
          and it might just continue writing a textbook — it has no reason to adopt the role
          of a helpful teacher. Post-training changes that.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Supervised Fine-Tuning (SFT)">
        <p>
          Supervised Fine-Tuning (SFT) is the first post-training step. A team of human
          contractors — or increasingly, an existing strong model — produces a dataset of
          (instruction, ideal response) pairs. For example:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Instruction:</strong> &quot;Summarize this article in two sentences.&quot;</li>
          <li><strong>Response:</strong> A concise, accurate two-sentence summary.</li>
        </ul>
        <p>
          The model is then fine-tuned on this dataset using the same cross-entropy loss
          as pretraining — except now the loss is computed only on the response tokens,
          not the instruction tokens. The model learns to <em>generate the response given
          the instruction</em>.
        </p>
        <p>
          Critically, SFT does not teach the model new facts. It teaches the model
          a <strong>behavior pattern</strong>: when given an instruction, produce a
          well-structured, helpful response. The knowledge was already there from pretraining;
          SFT teaches the model to express it in the right format.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Instruction Tuning">
        <p>
          <strong>Instruction tuning</strong> is the specific variant of SFT where the
          training pairs follow an instruction-following format. The key insight, validated
          by the InstructGPT and FLAN papers, is that even a <em>small</em> SFT dataset
          of high-quality instruction-response pairs can dramatically shift model behavior.
        </p>
        <p>
          OpenAI&apos;s InstructGPT (2022) showed that fine-tuning GPT-3 on roughly
          13,000 human-written examples produced a model that human raters strongly preferred
          over the raw 175 billion parameter base model. Fewer examples, carefully curated,
          outperformed far more data of lower quality.
        </p>
        <p>
          This tells us something important: the capability is already in the base model.
          SFT is essentially unlocking it by showing the model which behavioral mode to adopt.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Changes vs. Pretraining">
        <p>
          Pretraining and SFT both update the same model weights using gradient descent, but
          they differ in three key ways:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Data volume:</strong> Pretraining uses trillions of tokens; SFT uses
            thousands to millions of carefully chosen instruction-response pairs.
          </li>
          <li>
            <strong>Data quality:</strong> Pretraining data is noisy and broad; SFT data is
            curated, often written or reviewed by humans or a strong teacher model.
          </li>
          <li>
            <strong>Learning rate:</strong> SFT uses a much smaller learning rate to avoid
            catastrophically overwriting the knowledge learned during pretraining.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Synthetic Data for Tuning">
        <p>
          Writing thousands of high-quality instruction-response pairs is expensive. A major
          trend since 2023 is using a strong existing model (like GPT-4 or Claude) to generate
          synthetic training data for a smaller model. This is sometimes called
          <strong> self-instruct</strong> or <strong>distillation-via-SFT</strong>.
        </p>
        <p>
          The approach works well but has limits. A student model fine-tuned purely on
          a teacher model&apos;s outputs tends to inherit the teacher&apos;s quirks and
          failure modes — and may not be able to exceed the teacher&apos;s quality ceiling.
          Mixing human-written and synthetic data often yields the best results in practice.
        </p>
        <p>
          After SFT, our base model has been transformed into something that reliably responds
          to instructions in a helpful format. But it still might give harmful, biased, or
          dishonest responses. That&apos;s where alignment comes in.
        </p>
      </ExplanationBox>
    </div>
  );
}
