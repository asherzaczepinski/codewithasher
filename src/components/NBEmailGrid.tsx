'use client';

import { useState } from 'react';

// Canonical counts: appears-in-spam / appears-in-ham (of 40 spam, 60 ham)
const WORDS = {
  free: { spam: 32, ham: 4 },
  winner: { spam: 28, ham: 1 },
  meeting: { spam: 2, ham: 42 },
} as const;

type Word = keyof typeof WORDS;

const SPAM_TOTAL = 40;
const HAM_TOTAL = 60;

export default function NBEmailGrid() {
  const [word, setWord] = useState<Word | null>('free');

  // 100 squares in row-major order. First 40 are spam, next 60 are ham.
  const isSpam = (i: number) => i < SPAM_TOTAL;

  // Deterministic highlight: first N spam squares, first M ham squares.
  const highlighted = (i: number): boolean => {
    if (!word) return false;
    const counts = WORDS[word];
    if (isSpam(i)) {
      return i < counts.spam; // spam squares are indices 0..39
    }
    const hamIndex = i - SPAM_TOTAL; // 0..59
    return hamIndex < counts.ham;
  };

  const counts = word ? WORDS[word] : null;
  const pSpam = counts ? counts.spam / SPAM_TOTAL : 0;
  const pHam = counts ? counts.ham / HAM_TOTAL : 0;

  const wordButton = (w: Word) => {
    const active = word === w;
    return (
      <button
        key={w}
        onClick={() => setWord(active ? null : w)}
        style={{
          padding: '6px 16px',
          borderRadius: 8,
          border: `1.5px solid ${active ? '#2563eb' : '#e2e8f0'}`,
          background: active ? '#2563eb' : '#fff',
          color: active ? '#fff' : '#1e293b',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {w}
      </button>
    );
  };

  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 20,
        background: '#f8fafc',
        margin: '1.5rem 0',
      }}
    >
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#64748b', alignSelf: 'center' }}>
          Highlight emails containing:
        </span>
        {(Object.keys(WORDS) as Word[]).map(wordButton)}
      </div>

      {/* Grid */}
      <svg
        viewBox="0 0 220 220"
        style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '0 auto' }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const x = 10 + col * 21;
          const y = 10 + row * 21;
          const spam = isSpam(i);
          const on = highlighted(i);
          const base = spam ? '#fca5a5' : '#93c5fd';
          const bright = spam ? '#dc2626' : '#2563eb';
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={18}
              height={18}
              rx={3}
              fill={on ? bright : base}
              opacity={word && !on ? 0.35 : 1}
              stroke={on ? '#1e293b' : 'none'}
              strokeWidth={on ? 1.5 : 0}
            />
          );
        })}
      </svg>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 10, fontSize: 13 }}>
        <span>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#fca5a5', borderRadius: 2, marginRight: 5, verticalAlign: 'middle' }} />
          40 spam
        </span>
        <span>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#93c5fd', borderRadius: 2, marginRight: 5, verticalAlign: 'middle' }} />
          60 ham
        </span>
      </div>

      {/* Readout */}
      {counts && word && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: '1px solid #e2e8f0',
            fontSize: 15,
            color: '#1e293b',
            lineHeight: 1.8,
          }}
        >
          <div>
            <strong style={{ color: '#dc2626' }}>P({word} | spam)</strong> = {counts.spam}/{SPAM_TOTAL} ={' '}
            <strong>{pSpam.toFixed(pSpam < 0.1 ? 3 : 2)}</strong>
          </div>
          <div>
            <strong style={{ color: '#2563eb' }}>P({word} | ham)</strong> = {counts.ham}/{HAM_TOTAL} ={' '}
            <strong>{pHam.toFixed(pHam < 0.1 ? 3 : 2)}</strong>
          </div>
        </div>
      )}
      {!word && (
        <div style={{ marginTop: 16, fontSize: 14, color: '#94a3b8', textAlign: 'center' }}>
          Pick a word above to light up the emails that contain it.
        </div>
      )}
    </div>
  );
}
