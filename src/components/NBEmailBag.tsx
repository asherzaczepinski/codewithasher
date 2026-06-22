'use client';

import { useState } from 'react';

const SPAM_WORDS = ['free', 'winner', 'click', 'cash', 'offer'];
const HAM_WORDS = ['meeting', 'agenda', 'attached', 'project', 'lunch'];

export default function NBEmailBag() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    free: true,
    winner: true,
  });

  const toggle = (word: string) =>
    setSelected((prev) => ({ ...prev, [word]: !prev[word] }));

  const present = Object.keys(selected).filter((w) => selected[w]);
  const spamCount = present.filter((w) => SPAM_WORDS.includes(w)).length;
  const hamCount = present.filter((w) => HAM_WORDS.includes(w)).length;

  let verdict = 'unclear';
  let verdictColor = '#64748b';
  if (present.length > 0) {
    if (spamCount > hamCount) {
      verdict = 'leans spam';
      verdictColor = '#dc2626';
    } else if (hamCount > spamCount) {
      verdict = 'leans ham';
      verdictColor = '#2563eb';
    }
  }

  const chip = (word: string, isSpam: boolean) => {
    const on = !!selected[word];
    const accent = isSpam ? '#ef4444' : '#2563eb';
    return (
      <button
        key={word}
        onClick={() => toggle(word)}
        style={{
          padding: '6px 14px',
          borderRadius: 999,
          border: `1.5px solid ${accent}`,
          background: on ? accent : '#fff',
          color: on ? '#fff' : accent,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        {word}
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
      {/* Email card */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: 16,
          marginBottom: 18,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
          From: unknown@example.com
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', marginBottom: 10 }}>
          Subject: {present.length > 0 ? present.join(' ') : '(empty)'}
        </div>
        <div style={{ fontSize: 14, color: '#64748b', minHeight: 40, lineHeight: 1.6 }}>
          {present.length === 0 ? (
            <em>No words added yet. Click chips below to drop words into this email.</em>
          ) : (
            <>
              The filter sees only this <strong>bag of words</strong>:{' '}
              {present.map((w, i) => (
                <span
                  key={w}
                  style={{
                    fontWeight: 600,
                    color: SPAM_WORDS.includes(w) ? '#dc2626' : '#2563eb',
                  }}
                >
                  {w}
                  {i < present.length - 1 ? ', ' : ''}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Palette */}
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
        Spammy words
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {SPAM_WORDS.map((w) => chip(w, true))}
      </div>
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
        Hammy words
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {HAM_WORDS.map((w) => chip(w, false))}
      </div>

      {/* Readout */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          paddingTop: 14,
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ fontSize: 14, color: '#1e293b' }}>
          <span style={{ color: '#dc2626', fontWeight: 700 }}>{spamCount}</span> spammy ·{' '}
          <span style={{ color: '#2563eb', fontWeight: 700 }}>{hamCount}</span> hammy
        </div>
        <div
          style={{
            marginLeft: 'auto',
            padding: '6px 16px',
            borderRadius: 999,
            background: verdictColor,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            textTransform: 'capitalize',
          }}
        >
          {verdict}
        </div>
      </div>
    </div>
  );
}
