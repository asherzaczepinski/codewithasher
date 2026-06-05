'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Prompting Is an Engineering Discipline">
        <p>
          After all the training and alignment work, you still need to tell the model
          what to do on each request. How you phrase that request — the <strong>prompt</strong>
          — has an enormous effect on response quality. Prompt engineering is the practice
          of crafting inputs that reliably elicit the behavior you want.
        </p>
        <p>
          It is not about magic words or tricks. It is about understanding what the model
          was trained on, what it expects to see, and how to give it enough context to
          succeed at your task.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Zero-Shot, Few-Shot, and Chain-of-Thought Prompting">
        <p>
          <strong>Zero-shot prompting</strong> gives the model a task description with no
          examples. It works well for common tasks that appeared frequently in training, and
          it is the simplest approach:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '8px 0' }}>
          Classify the sentiment of the following review as Positive, Neutral, or Negative.<br />
          Review: &quot;The battery life is excellent but the camera is mediocre.&quot;
        </p>
        <p>
          <strong>Few-shot prompting</strong> includes two to five examples of the task
          before asking the model to complete a new instance. This dramatically improves
          accuracy on tasks that are ambiguous or that require a specific format. The
          examples act as implicit instructions — they show the model exactly what you want
          without having to describe it exhaustively.
        </p>
        <p>
          <strong>Chain-of-thought (CoT) prompting</strong> instructs the model to reason
          step by step before answering. Adding &quot;Let&apos;s think step by step&quot; or
          providing examples that include reasoning steps dramatically improves performance
          on math, logic, and multi-step reasoning tasks. This works because each reasoning
          token the model generates becomes part of its context, allowing it to &quot;carry
          state&quot; across a long chain of inference.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Tool Use and Function Calling">
        <p>
          Modern LLMs can be trained or prompted to call external tools — web search, code
          executors, calculators, APIs. In practice, the model generates a structured function
          call (e.g., in JSON) rather than a plain text response. The application executes
          the function and feeds the result back into the model&apos;s context.
        </p>
        <p>
          This turns the model from a closed system into an agent that can take actions in
          the world. Tool use is how models browse the web, run Python code, query databases,
          and send emails — capabilities that no amount of pretraining can provide on their own
          because they require real-time external information.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Retrieval-Augmented Generation (RAG)">
        <p>
          A trained model&apos;s knowledge is frozen at its training cutoff. It cannot know
          about yesterday&apos;s news, your company&apos;s internal documents, or a specific
          customer&apos;s account history. <strong>Retrieval-Augmented Generation (RAG)</strong>
          solves this by fetching relevant documents at query time and inserting them into the
          prompt as context.
        </p>
        <p>
          A basic RAG pipeline works like this:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Offline:</strong> A corpus of documents is split into chunks, each chunk
            is embedded into a dense vector using an embedding model, and the vectors are
            stored in a vector database (e.g., Pinecone, Weaviate, pgvector).
          </li>
          <li>
            <strong>At query time:</strong> The user&apos;s question is embedded using the same
            model. The vector database finds the most similar document chunks via approximate
            nearest-neighbor search. Those chunks are inserted into the prompt as context.
          </li>
          <li>
            <strong>Generation:</strong> The LLM reads the retrieved context and the question,
            then generates a grounded answer. Because the relevant facts are in the context,
            the model is less likely to hallucinate.
          </li>
        </ul>
        <p>
          RAG is complementary to fine-tuning. Fine-tuning teaches the model new behaviors;
          RAG gives it access to current or proprietary information it was never trained on.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Context Windows and Long-Context Prompting">
        <p>
          Every LLM has a <strong>context window</strong> — the maximum number of tokens it
          can process in one forward pass. Modern models range from 8,000 to over 1 million
          tokens. Longer contexts allow you to include more retrieved documents, longer
          conversation history, or entire codebases.
        </p>
        <p>
          However, longer is not always better. Models show a &quot;lost in the middle&quot;
          phenomenon: information placed in the middle of a very long context is less reliably
          retrieved than information near the beginning or end. If critical facts must be
          attended to, put them near the start of the prompt (system prompt / retrieved context)
          or near the end (immediately before the question).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Agentic Workflows">
        <p>
          The frontier of prompting is <strong>agentic systems</strong> — architectures where
          an LLM iteratively plans, acts (via tools), observes results, and plans again in a loop.
          Patterns include:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>ReAct:</strong> The model alternates between Reasoning and Acting,
          producing a thought, then a tool call, then observing the result, in a loop.</li>
          <li><strong>Multi-agent systems:</strong> Multiple specialized LLM agents collaborate,
          each with its own tools and role — one researches, one writes, one critiques.</li>
          <li><strong>Self-reflection / self-critique:</strong> The model is prompted to review
          its own output and revise it before returning a final answer.</li>
        </ul>
        <p>
          Agentic workflows multiply model capability significantly, but they also multiply
          cost and latency — each tool call and LLM generation is billed separately.
          Good system design minimizes unnecessary round-trips.
        </p>
      </ExplanationBox>
    </div>
  );
}
