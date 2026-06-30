'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// "bank" gets exactly ONE embedding, no matter which sentence it lands in.
function BankDemo() {
  const sentences = [
    { text: 'I sat on the river bank.', sense: 'a muddy slope by the water', color: '#0369a1', fill: '#f0f9ff' },
    { text: 'I deposited cash at the bank.', sense: 'a place that holds money', color: '#15803d', fill: '#f0fdf4' },
  ];
  const [pick, setPick] = useState(0);
  const s = sentences[pick];
  return (
    <div className="bk-box">
      <div className="bk-tabs">
        {sentences.map((x, i) => (
          <button
            key={i}
            className={`bk-tab ${pick === i ? 'on' : ''}`}
            onClick={() => setPick(i)}
          >
            {x.text}
          </button>
        ))}
      </div>
      <div className="bk-row">
        <span className="bk-meaning" style={{ color: s.color, background: s.fill, borderColor: s.color }}>
          here &ldquo;bank&rdquo; means: {s.sense}
        </span>
      </div>
      <div className="bk-lookup">
        <span className="bk-word">bank</span>
        <span className="bk-arrow">→ same row in the table →</span>
        <span className="bk-vec">[0.4, 0.1, 0.3]</span>
      </div>
      <p className="bk-cap">
        Switch the sentence all you like. The embedding lookup from Step 5 is blind to the sentence — it
        only sees the token, so it hands back the <strong>exact same vector</strong> either way. One word,
        two meanings, one vector. Something has to give.
      </p>
      <style jsx>{`
        .bk-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .bk-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .bk-tab { padding: 0.5rem 0.8rem; border: 1.5px solid #e2e8f0; background: #fff; border-radius: 8px; font-size: 13px; color: #475569; cursor: pointer; }
        .bk-tab.on { border-color: #7c3aed; color: #5b21b6; background: #ede9fe; font-weight: 600; }
        .bk-row { margin-bottom: 1rem; }
        .bk-meaning { display: inline-block; padding: 0.3rem 0.7rem; border: 1px solid; border-radius: 8px; font-size: 13px; font-weight: 600; }
        .bk-lookup { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; justify-content: center; padding: 0.8rem; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px; }
        .bk-word { font-weight: 700; color: #1e293b; font-size: 15px; }
        .bk-arrow { font-size: 12px; color: #94a3b8; }
        .bk-vec { font-family: monospace; font-weight: 700; color: #4c1d95; font-size: 14px; }
        .bk-cap { margin: 1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step10() {
  return (
    <div>
      <ExplanationBox title="A Word Has One Vector — But Many Meanings">
        <p>
          Part 2 left us with a tidy picture: every token is a point in space, and similar tokens sit
          close together. But there is a crack in that picture, and the rest of the course is built on
          fixing it.
        </p>
        <p>
          The embedding table stores <strong>one vector per token</strong>. The word{' '}
          <strong>&ldquo;bank&rdquo;</strong> gets a single row of numbers — and it has to serve every
          sentence &ldquo;bank&rdquo; ever appears in, whether you are talking about a river or your
          savings. The lookup never sees the surrounding words, so it cannot possibly tell the two apart.
        </p>
        <BankDemo />
        <p>
          A <em>fixed</em> embedding captures what a word means <em>on average, in isolation</em>. But
          meaning is not fixed — it is shaped by neighbors. To understand &ldquo;bank&rdquo; you have to
          look at the words around it. The model needs a way to let context reshape a word&apos;s vector.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Own Sentence Has the Same Disease">
        <p>
          This is not just a problem for trick words like &ldquo;bank.&rdquo; It is already biting us in{' '}
          <strong>&ldquo;The sky is&rdquo;</strong>. Remember what the dot product and cosine told us back
          in Part 2: the two function words, <strong>The</strong> and <strong>is</strong>, came out almost
          identical.
        </p>
        <WorkedExample title="What the Raw Vectors Said">
          <CalcStep number={1}>The &middot; is = 0.73&nbsp;&nbsp;&rarr;&nbsp;&nbsp;cosine = <strong>0.97</strong> (nearly the same direction)</CalcStep>
          <CalcStep number={2}>sky &middot; is = 0.24&nbsp;&nbsp;&rarr;&nbsp;&nbsp;cosine = <strong>0.24</strong> (only loosely related)</CalcStep>
          <p style={{ marginTop: '1rem' }}>
            So by raw similarity, the word <strong>&ldquo;is&rdquo;</strong> is practically a twin of{' '}
            <strong>&ldquo;The&rdquo;</strong> and barely connected to <strong>&ldquo;sky.&rdquo;</strong>{' '}
            Both function words point the same way in space, because they play the same grammatical role.
          </p>
        </WorkedExample>
        <p>
          Now ask the only question that matters: to guess the word after <strong>&ldquo;The sky is
          ___,&rdquo;</strong> which earlier word should &ldquo;is&rdquo; pay attention to? Obviously{' '}
          <strong>sky</strong> — that is what the sentence is <em>about</em>. But the raw vectors say the
          opposite: they tell &ldquo;is&rdquo; to cozy up to &ldquo;The,&rdquo; the one word that carries
          no topic at all. Raw similarity is pointing us at exactly the wrong neighbor.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We Actually Need">
        <p>
          So a high similarity score between two words is <em>not</em> the same as &ldquo;these words help
          predict each other.&rdquo; &ldquo;The&rdquo; and &ldquo;is&rdquo; look alike, but knowing about
          &ldquo;The&rdquo; tells you nothing about what comes next. We need a mechanism that lets{' '}
          <strong>&ldquo;is&rdquo; reach back and pull in meaning from &ldquo;sky&rdquo;</strong> — even
          though, as plain embeddings, they don&apos;t look much alike.
        </p>
        <p>
          In other words, we want each word to walk out of this stage with a <strong>new</strong> vector:
          not its lonely dictionary entry, but a version that has absorbed the relevant parts of its
          neighbors. &ldquo;is&rdquo; should leave knowing it sits in a sentence about the <em>sky</em>.
        </p>
        <p>
          That mechanism is <strong>attention</strong>, and it is the heart of every modern language model.
          The next step lays out the idea; the steps after that compute it, by hand, on these exact three
          words.
        </p>
      </ExplanationBox>
    </div>
  );
}
