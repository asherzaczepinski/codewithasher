'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Step 4 introduces the running specimen "The sky is" and the core obstacle:
// a computer can only multiply and add — it cannot do arithmetic on letters.
function MultiplyDemo() {
  const items = [
    { label: '6', kind: 'num' as const },
    { label: '×', kind: 'op' as const },
    { label: '7', kind: 'num' as const },
    { label: '=', kind: 'op' as const },
    { label: '42', kind: 'res' as const },
  ];
  const wordItems = [
    { label: 'sky', kind: 'word' as const },
    { label: '×', kind: 'op' as const },
    { label: '3', kind: 'num' as const },
    { label: '=', kind: 'op' as const },
    { label: '???', kind: 'err' as const },
  ];
  const [show, setShow] = useState(false);
  return (
    <div className="mx-box">
      <p className="mx-label">A processor is happy to do this:</p>
      <div className="mx-row">
        {items.map((it, i) => (
          <span key={i} className={`mx-chip ${it.kind}`}>{it.label}</span>
        ))}
      </div>
      <p className="mx-label" style={{ marginTop: '1.1rem' }}>But it has no idea what to do with this:</p>
      <div className="mx-row">
        {wordItems.map((it, i) => (
          <span key={i} className={`mx-chip ${it.kind}`}>{it.label}</span>
        ))}
      </div>
      <button className="mx-btn" onClick={() => setShow(s => !s)}>
        {show ? 'Hide' : 'Why not?'}
      </button>
      {show && (
        <p className="mx-note">
          There is no rule for multiplying the <em>letters</em> s-k-y by a number. The word is a shape on
          a screen, not a quantity. Before any math can happen at all, &ldquo;sky&rdquo; has to be turned
          into something a multiplication can actually grab onto — a number.
        </p>
      )}
      <style jsx>{`
        .mx-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .mx-label { font-size: 13px; color: #64748b; margin: 0 0 0.7rem; }
        .mx-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .mx-chip { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px; padding: 0 0.6rem; border-radius: 8px; font-size: 18px; font-weight: 600; font-family: var(--font-mono), monospace; }
        .mx-chip.num { background: #dbeafe; color: #1d4ed8; }
        .mx-chip.res { background: #dcfce7; color: #15803d; }
        .mx-chip.word { background: #ede9fe; color: #5b21b6; }
        .mx-chip.op { background: transparent; color: #94a3b8; font-size: 20px; }
        .mx-chip.err { background: #fee2e2; color: #b91c1c; }
        .mx-btn { margin-top: 1.1rem; padding: 0.5rem 1rem; font-size: 14px; font-weight: 600; color: #7c3aed; background: white; border: 1px solid #c4b5fd; border-radius: 8px; cursor: pointer; }
        .mx-btn:hover { background: #faf5ff; }
        .mx-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

function Specimen() {
  return (
    <div style={{ margin: '1.5rem 0', padding: '1.75rem 1.5rem', background: 'linear-gradient(180deg,#faf5ff,#f8fafc)', border: '1px solid #e2e8f0', borderRadius: 12, textAlign: 'center' }}>
      <p style={{ margin: '0 0 0.6rem', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>
        Our specimen for the whole course
      </p>
      <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: '#5b21b6' }}>
        The sky is <span style={{ color: '#c4b5fd', borderBottom: '3px dashed #c4b5fd', padding: '0 0.3rem' }}>____</span>
      </p>
      <p style={{ margin: '0.9rem 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
        Three little words. We are going to feed them into the machine and follow every number until it
        produces a guess for the blank — by hand.
      </p>
    </div>
  );
}

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Computers Read Numbers, Not Words">
        <p>
          We just said a language model is a function that takes text and scores the next word. But a
          processor cannot literally take <em>text</em>. At the lowest level it does exactly two things:
          it <strong>multiplies</strong> and it <strong>adds</strong>. Every layer of a neural network,
          every part of the giant machine we are building, is ultimately stacks of multiply-and-add.
        </p>
        <p>
          That is a problem, because you cannot multiply a word. There is no answer to &ldquo;the word{' '}
          <em>sky</em> times three.&rdquo; So before the model can do anything at all, the text has to be
          converted into numbers — and not arbitrary numbers, but numbers arranged so that arithmetic on
          them actually means something. That conversion is the entire job of Part 1.
        </p>
        <MultiplyDemo />
      </ExplanationBox>

      <ExplanationBox title="Meet the Specimen: &ldquo;The sky is ____&rdquo;">
        <p>
          To keep every later calculation concrete, we will carry one short phrase through the whole
          course. Here it is — say hello, because you will see these three words in nearly every step from
          now on:
        </p>
        <Specimen />
        <p>
          Why this phrase? Because it is short enough to write every number by hand, yet it has real
          structure: a little grammar word, a topic word, and another grammar word, leading to a blank a
          human could fill in without thinking. Watching the machine arrive at the <em>same</em> instinct
          you have — purely through arithmetic — is the payoff this course is building toward.
        </p>
        <p>
          We will not reveal what the model predicts for that blank yet. Earning that answer, number by
          number, is the point. For now, just hold the phrase in mind.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Plan for Turning Words Into Numbers">
        <p>
          Getting from &ldquo;The sky is&rdquo; to numbers the model can compute with happens in two
          distinct stages, and it is worth separating them now so they do not blur together later:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>Tokenization</strong> (next step) — chop the text into standard pieces and give each
            piece an ID number. This is just a lookup; the IDs are name tags, not meaningful quantities.
          </li>
          <li>
            <strong>Embedding</strong> (the step after) — replace each ID with a list of numbers that
            actually <em>encodes meaning</em>, so that similar words end up with similar numbers. This is
            where arithmetic starts to mean something.
          </li>
        </ul>
        <p>
          One word of caution about that first stage: turning a word into an ID throws away the letters
          inside it. That throwaway is convenient, but it has strange consequences — and it explains one
          of the most famous things LLMs get wrong. That is exactly where we go next.
        </p>
      </ExplanationBox>
    </div>
  );
}
