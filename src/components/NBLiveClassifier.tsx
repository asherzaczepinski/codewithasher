'use client';

import { useState } from 'react';

interface Vocab {
  label: string;
  pSpam: number;
  pHam: number;
}

const VOCAB: Vocab[] = [
  { label: 'free', pSpam: 0.8, pHam: 0.067 },
  { label: 'winner', pSpam: 0.7, pHam: 0.017 },
  { label: 'cash', pSpam: 0.65, pHam: 0.02 },
  { label: 'click', pSpam: 0.55, pHam: 0.05 },
  { label: 'offer', pSpam: 0.5, pHam: 0.08 },
  { label: 'meeting', pSpam: 0.05, pHam: 0.7 },
  { label: 'agenda', pSpam: 0.04, pHam: 0.55 },
  { label: 'project', pSpam: 0.06, pHam: 0.5 },
];

const PRIOR_SPAM = 0.4;
const PRIOR_HAM = 0.6;

export default function NBLiveClassifier() {
  const [selected, setSelected] = useState<Record<string, boolean>>({
    free: true,
    winner: true,
    meeting: true,
  });

  const toggle = (label: string) =>
    setSelected((prev) => ({ ...prev, [label]: !prev[label] }));

  const chosen = VOCAB.filter((v) => selected[v.label]);

  let spamScore = PRIOR_SPAM;
  let hamScore = PRIOR_HAM;
  for (const w of chosen) {
    spamScore *= w.pSpam;
    hamScore *= w.pHam;
  }

  const denom = spamScore + hamScore;
  const pSpam = denom > 0 ? spamScore / denom : 0.5;
  const pct = Math.round(pSpam * 1000) / 10;
  const isSpam = spamScore >= hamScore;

  const fmt = (n: number) => {
    if (n === 0) return '0';
    if (n >= 0.001 || n === 0) return n.toFixed(6);
    return n.toExponential(3);
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
      <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>
        Build an email — tick the words it contains
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {VOCAB.map((v) => {
          const on = !!selected[v.label];
          const accent = v.pSpam > v.pHam ? '#ef4444' : '#2563eb';
          return (
            <button
              key={v.label}
              onClick={() => toggle(v.label)}
              style={{
                padding: '8px 16px',
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
              {on ? '✓ ' : ''}
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Multiplication chain */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #fecaca',
            borderRadius: 10,
            padding: 14,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: 6 }}>Spam score</div>
          <div style={{ color: '#64748b' }}>prior = {PRIOR_SPAM.toFixed(3)}</div>
          {chosen.map((w) => (
            <div key={w.label} style={{ color: '#64748b' }}>
              × P({w.label}|spam) = {w.pSpam.toFixed(3)}
            </div>
          ))}
          <div style={{ fontWeight: 700, color: '#dc2626', marginTop: 6 }}>
            = {fmt(spamScore)}
          </div>
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #bfdbfe',
            borderRadius: 10,
            padding: 14,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>Ham score</div>
          <div style={{ color: '#64748b' }}>prior = {PRIOR_HAM.toFixed(3)}</div>
          {chosen.map((w) => (
            <div key={w.label} style={{ color: '#64748b' }}>
              × P({w.label}|ham) = {w.pHam.toFixed(3)}
            </div>
          ))}
          <div style={{ fontWeight: 700, color: '#2563eb', marginTop: 6 }}>
            = {fmt(hamScore)}
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          <span style={{ color: '#dc2626' }}>SPAM {pct.toFixed(1)}%</span>
          <span style={{ color: '#2563eb' }}>HAM {(100 - pct).toFixed(1)}%</span>
        </div>
        <div
          style={{
            height: 18,
            borderRadius: 999,
            overflow: 'hidden',
            display: 'flex',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ width: `${pct}%`, background: '#ef4444' }} />
          <div style={{ width: `${100 - pct}%`, background: '#2563eb' }} />
        </div>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '12px',
          borderRadius: 10,
          background: isSpam ? '#fef2f2' : '#eff6ff',
          border: `1.5px solid ${isSpam ? '#fecaca' : '#bfdbfe'}`,
          fontSize: 20,
          fontWeight: 800,
          color: isSpam ? '#dc2626' : '#2563eb',
          letterSpacing: '0.05em',
        }}
      >
        VERDICT: {chosen.length === 0 ? 'NO WORDS' : isSpam ? 'SPAM' : 'HAM'}
      </div>
    </div>
  );
}
