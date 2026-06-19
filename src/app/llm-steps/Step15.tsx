'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

const STAGES = [
  {
    id: 'pretrain',
    label: '1 · Pretraining',
    emoji: '📚',
    tagline: 'Months. Trillions of tokens. The expensive part.',
    intro: 'Everything from the last step: next-word prediction over a huge slice of the internet. This builds all the raw capability — language, facts, reasoning patterns. The result is called a base model.',
    sections: [
      { title: 'The data', body: 'Trillions of tokens of web pages, books, articles, and code. No labels, no instructions — just raw text, because the data labels itself.' },
      { title: 'What it learns', body: 'Everything needed to continue any text plausibly: grammar, world knowledge, styles, code syntax, chains of reasoning. All of it condensed out of one objective — be less surprised by the next word.' },
      { title: 'The catch', body: 'A base model is a pure autocomplete engine. Ask it "What is the capital of France?" and it might answer "Paris" — or continue with "What is the capital of Spain?" because your question looked like a line from a list of exam questions. It completes text; it doesn\'t serve you.' },
    ],
  },
  {
    id: 'sft',
    label: '2 · Fine-Tuning',
    emoji: '🎯',
    tagline: 'Days. Thousands of examples. Teaching the format.',
    intro: 'Supervised fine-tuning (SFT): keep training the same network, with the same loss, but now on a small, curated dataset of conversations written by humans — question, then helpful answer.',
    sections: [
      { title: 'The data', body: 'Tens or hundreds of thousands of example dialogues, written or vetted by people: "user asks X → assistant answers Y, helpfully and clearly." Expensive per example, tiny in volume next to pretraining.' },
      { title: 'What it learns', body: 'The shape of being an assistant. Questions get answered (not continued). Instructions get followed. The mountain of pretraining knowledge doesn\'t change much — what changes is how the model deploys it.' },
      { title: 'The catch', body: 'Humans can\'t write examples covering everything, and for many prompts there are several decent answers of varying quality. SFT teaches the format, but "which answer is actually better" needs a different tool.' },
    ],
  },
  {
    id: 'rlhf',
    label: '3 · RLHF',
    emoji: '⚖️',
    tagline: 'Human preferences. The polish.',
    intro: 'Reinforcement learning from human feedback: instead of showing the model correct answers, let it generate several answers and have humans rank them. Then nudge the weights toward producing the kind of answer people prefer.',
    sections: [
      { title: 'The data', body: 'The model writes multiple answers to the same prompt; human reviewers rank them best to worst. Those rankings train a separate "reward model" that learns to predict which answers people will like.' },
      { title: 'What it learns', body: 'Judgment. Be helpful but admit uncertainty. Refuse harmful requests. Match the level of detail to the question. The reward model scores millions of generated answers, and the LLM\'s weights shift toward what scores well — the same nudge-the-weights loop, with "humans liked it" standing in for "the next word was correct."' },
      { title: 'The catch', body: 'The model learns to produce answers that people rate highly — which is mostly, but not exactly, the same as answers that are true and good. Confident-sounding prose rates well. This tension is an open research problem, and it\'s part of why models can sound surest exactly when they\'re wrong.' },
    ],
  },
];

function StagePicker() {
  const [selected, setSelected] = useState<string | null>('pretrain');
  const active = STAGES.find(s => s.id === selected) ?? null;
  const colors = [
    { bg: '#eff6ff', border: '#bfdbfe', label: '#1d4ed8' },
    { bg: '#faf5ff', border: '#d8b4fe', label: '#6d28d9' },
    { bg: '#fff7ed', border: '#fed7aa', label: '#c2410c' },
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', margin: '1.5rem 0 1.25rem' }}>
        {STAGES.map(s => (
          <button
            key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem',
              padding: '1rem', background: selected === s.id ? '#faf5ff' : 'white',
              border: `1.5px solid ${selected === s.id ? '#c4b5fd' : '#e2e8f0'}`,
              borderRadius: '10px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '22px' }}>{s.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: selected === s.id ? '#5b21b6' : '#1e293b' }}>{s.label}</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{s.tagline}</span>
          </button>
        ))}
      </div>

      {active && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: 'white' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '0.4rem' }}>Stage</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{active.emoji} {active.label}</div>
            <p style={{ margin: '0.6rem 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{active.intro}</p>
          </div>
          {active.sections.map((section, i) => {
            const col = colors[i];
            return (
              <div key={section.title} style={{ padding: '1.1rem 1.5rem', borderBottom: i < active.sections.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{
                  display: 'inline-block', padding: '0.2rem 0.6rem', background: col.bg,
                  border: `1px solid ${col.border}`, borderRadius: '999px',
                  fontSize: '11px', fontWeight: 700, color: col.label, marginBottom: '0.5rem',
                }}>{section.title}</div>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.7 }}>{section.body}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="A Freshly Trained LLM Is Not a Chatbot">
        <p>
          Surprise: if you took the model from the last step — fully pretrained, hundreds of billions of
          weights — and typed a question at it, the result would be alien. A <strong>base model</strong>{' '}
          doesn&apos;t answer questions; it <em>continues text</em>, because that&apos;s the entire game
          it was trained on. Ask &quot;How do I boil an egg?&quot; and it may produce a list of
          follow-up questions, a forum post where nobody answers, or an essay about chickens — whatever
          plausibly comes next on the internet.
        </p>
        <p>
          Turning that raw text-continuation engine into ChatGPT or Claude takes two more training
          stages — much shorter and cheaper than pretraining, and aimed at <em>behavior</em> rather than
          capability. Click through the three stages every modern assistant goes through:
        </p>
        <StagePicker />
      </ExplanationBox>

      <ExplanationBox title="Why Models Make Things Up">
        <p>
          With the full pipeline in view, you can now understand the most important LLM failure mode from
          first principles: <strong>hallucination</strong>. The model is a next-word guesser. When you
          ask about something it genuinely knows, the highest-probability continuation tends to be true —
          the facts were reinforced across thousands of training documents. When you ask about something
          obscure, the machinery <em>keeps running anyway</em> — softmax always produces a
          distribution, the sampler always picks a word, and out comes a fluent, confident,
          plausible-sounding answer assembled from patterns rather than knowledge.
        </p>
        <p>
          Nothing in next-word prediction rewards saying &quot;I don&apos;t know&quot; — silence was never
          the next word in the training data. RLHF helps (humans rank honest uncertainty above confident
          nonsense — when they catch it), but the tendency is baked into the objective itself. So treat
          an LLM the way the training process built it: a brilliant pattern-completer, not a database.
          Verify the facts that matter.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Two Courses, One Machine">
        <p>
          Step back and look at what you now understand, end to end:
        </p>
        <p style={{ padding: '0.7rem 0.9rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', fontSize: '14px', color: '#5b21b6', lineHeight: 1.7 }}>
          From the <strong>neural network course</strong>: neurons, weights, biases, activations, loss,
          backpropagation, gradient descent. From <strong>this course</strong>: tokens, embeddings,
          attention, transformer blocks, sampling, pretraining, fine-tuning, RLHF. Stack the first list
          to build the second. That&apos;s the entire technology.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          When ChatGPT answers you, here&apos;s everything that happens: your words are chopped into
          tokens, swapped for embedding vectors, tagged with positions, and sent up a tall stack of
          blocks where attention heads compute dot products to decide which words inform which, and
          feed-forward networks — your rain network, scaled up — transform each token&apos;s vector.
          A final layer of dot products scores the whole vocabulary, softmax makes it a distribution,
          temperature-controlled sampling picks a token, and the loop repeats until the model predicts
          its own stop token. Every weight in that machine was set by nothing more than predict →
          measure surprise → adjust, a few trillion times, with a layer of human feedback on top.
        </p>
        <p>
          No magic. No understanding hidden in the silicon that you don&apos;t have access to — just
          arithmetic you have personally done by hand, repeated at a scale that turns arithmetic into
          something that can write poetry. Congratulations: you know how large language models work.
        </p>
      </ExplanationBox>
    </div>
  );
}
