'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          You&apos;ve probably used ChatGPT, Claude, or Gemini. But how does a model go from randomly
          initialized weights to a helpful, safe assistant that can write code, explain concepts,
          and decline harmful requests?
        </p>
        <p>
          That journey is what this course is about. We&apos;re not covering how transformers
          compute attention — that&apos;s a separate course. Here we focus on everything that
          happens <em>around</em> the model: how it&apos;s trained, shaped, aligned with human
          values, and ultimately deployed to serve millions of users.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Building an Assistant">
        <p>
          Throughout every module we&apos;ll track a single scenario: you have a raw base model
          freshly pretrained on internet text, and your goal is to turn it into a reliable,
          helpful, deployed assistant. Each module adds one piece to that pipeline.
        </p>
        <p>
          By the end you&apos;ll be able to reason about real engineering decisions — which
          fine-tuning method to use, how to write prompts that actually work, what to measure,
          and how to serve a model cheaply at scale.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The LLM Lifecycle at a Glance">
        <p>
          Every production LLM goes through roughly the same four-stage lifecycle:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Pretraining</strong> — The model reads enormous amounts of text and learns to
            predict the next token. This is self-supervised: no human labels, just raw data. The
            result is a &quot;base model&quot; that is remarkably knowledgeable but not yet
            helpful or safe.
          </li>
          <li>
            <strong>Post-training (Instruction Tuning / SFT)</strong> — The base model is
            fine-tuned on curated instruction-response pairs so it learns to follow instructions
            instead of just completing text. This is called Supervised Fine-Tuning (SFT).
          </li>
          <li>
            <strong>Alignment (RLHF / DPO)</strong> — Human preferences are used to steer the
            model toward helpful, harmless, and honest behavior. Techniques like Reinforcement
            Learning from Human Feedback (RLHF) and Direct Preference Optimization (DPO) live
            here.
          </li>
          <li>
            <strong>Deployment</strong> — The aligned model is compressed, optimized, and served
            behind an API. Engineers write prompts, build RAG pipelines, evaluate quality, and
            monitor production behavior.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Next-Token Prediction: The Core Idea">
        <p>
          Everything in an LLM starts with one deceptively simple objective: given the words
          seen so far, predict the most likely next word (technically, &quot;token&quot;).
        </p>
        <p>
          For example, given the input <em>&quot;The Eiffel Tower is located in&quot;</em>, a
          well-trained model assigns high probability to the token <em>&quot;Paris&quot;</em>.
          The model never receives explicit labels like &quot;this sentence is about geography&quot;
          — it learns everything from the statistical patterns in text alone. This is called
          <strong> self-supervised learning</strong>.
        </p>
        <p>
          The remarkable finding of the last decade is that doing this prediction task at
          enormous scale — on trillions of tokens and billions of parameters — causes the model
          to implicitly learn grammar, facts, reasoning, coding, and much more. All of the
          capability you see in a modern LLM is a byproduct of that one objective applied at scale.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          <strong>Part 1 — Training &amp; Alignment</strong> covers Pretraining, Instruction
          Tuning (SFT), RLHF and preference optimization, and parameter-efficient fine-tuning
          with LoRA.
        </p>
        <p>
          <strong>Part 2 — Prompting, Serving &amp; Eval</strong> covers prompt engineering,
          retrieval-augmented generation (RAG), safety and hallucination, and finally evaluation,
          model efficiency, and production serving.
        </p>
        <p>
          Let&apos;s start at the very beginning: how a model learns anything at all.
        </p>
      </ExplanationBox>
    </div>
  );
}
