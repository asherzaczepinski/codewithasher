'use client';

import { useState } from 'react';

// Canonical likelihoods P(word | class)
const LIKELIHOODS = {
  free: { spam: 0.8, ham: 0.067 },
  winner: { spam: 0.7, ham: 0.017 },
  meeting: { spam: 0.05, ham: 0.7 },
} as const;

type Word = keyof typeof LIKELIHOODS;

export default function NBBeliefUpdate() {
  const [prior, setPrior] = useState(40); // P(spam) as a percent
  const [words, setWords] = useState<Record<Word, boolean>>({
    free: true,
    winner: false,
    meeting: false,
  });

  const toggle = (w: Word) => setWords((prev) => ({ ...prev, [w]: !prev[w] }));

  const pSpamPrior = prior / 100;
  const pHamPrior = 1 - pSpamPrior;

  let spamScore = pSpamPrior;
  let hamScore = pHamPrior;
  (Object.keys(words) as Word[]).forEach((w) => {
    if (words[w]) {
      spamScore *= LIKELIHOODS[w].spam;
      hamScore *= LIKELIHOODS[w].ham;
    }
  });

  const denom = spamScore + hamScore;
  const posterior = denom > 0 ? spamScore / denom : pSpamPrior;
  const pct = posterior * 100;
  const isSpam = posterior >= 0.5;

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
      {/* Prior slider */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: 6 }}>
          Prior P(spam): <strong style={{ color: '#2563eb' }}>{prior}%</strong>
        </label>
        <input
          type="range"
          min={1}
          max={99}
          value={prior}
          onChange={(e) => setPrior(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#2563eb' }}
        />
      </div>

      {/* Evidence toggles */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
          Add evidence words:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(Object.keys(LIKELIHOODS) as Word[]).map((w) => {
            const l = LIKELIHOODS[w];
            const ratio = l.spam / l.ham;
            const favorsSpam = ratio >= 1;
            return (
              <label
                key={w}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: '#1e293b',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={words[w]}
                  onChange={() => toggle(w)}
                  style={{ accentColor: favorsSpam ? '#dc2626' : '#2563eb', width: 16, height: 16 }}
                />
                <span style={{ fontWeight: 600, minWidth: 64 }}>{w}</span>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>
                  P(·|spam)={l.spam}, P(·|ham)={l.ham} —{' '}
                  <span style={{ color: favorsSpam ? '#dc2626' : '#2563eb', fontWeight: 600 }}>
                    {favorsSpam ? `${ratio.toFixed(0)}× toward spam` : `${(1 / ratio).toFixed(0)}× toward ham`}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Probability bar */}
      <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
        Posterior P(spam | words)
      </div>
      <div
        style={{
          position: 'relative',
          height: 36,
          borderRadius: 8,
          background: '#bfdbfe',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${pct}%`,
            background: '#dc2626',
            transition: 'width 0.4s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {pct.toFixed(1)}% spam
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
        <span>0% (all ham)</span>
        <span>100% (all spam)</span>
      </div>

      {/* Verdict */}
      <div
        style={{
          marginTop: 16,
          textAlign: 'center',
          padding: '10px',
          borderRadius: 8,
          background: isSpam ? '#fee2e2' : '#dbeafe',
          color: isSpam ? '#dc2626' : '#2563eb',
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {isSpam ? 'SPAM' : 'HAM'}
      </div>
    </div>
  );
}
