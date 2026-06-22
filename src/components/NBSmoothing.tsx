'use client';

import { useState } from 'react';

const VOCAB_SIZE = 1000;
const SPAM_OCCURRENCES = 8000;

export default function NBSmoothing() {
  const [alpha, setAlpha] = useState(0);

  const pUnseen = (0 + alpha) / (SPAM_OCCURRENCES + alpha * VOCAB_SIZE);
  const collapses = alpha === 0;

  // A class score with several "good" likelihoods, then multiplied by the unseen word.
  const baseScore = 0.4 * 0.8 * 0.7; // 0.224
  const finalScore = baseScore * pUnseen;

  const fmt = (n: number) => {
    if (n === 0) return '0';
    if (n >= 0.0001) return n.toFixed(6);
    return n.toExponential(3);
  };

  // Visual bar: width relative to the surviving score at alpha=1 as a reference.
  const refScore = baseScore * (1 / (SPAM_OCCURRENCES + VOCAB_SIZE));
  const barPct = refScore > 0 ? Math.min(100, (finalScore / refScore) * 50) : 0;

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
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 14,
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: 6,
          }}
        >
          <span>Smoothing strength α</span>
          <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{alpha.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#2563eb' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          fontSize: 13,
          color: '#64748b',
          marginBottom: 16,
        }}
      >
        <span>
          Vocabulary <strong style={{ color: '#1e293b' }}>|V| = {VOCAB_SIZE.toLocaleString()}</strong>
        </span>
        <span>
          Spam word occurrences{' '}
          <strong style={{ color: '#1e293b' }}>{SPAM_OCCURRENCES.toLocaleString()}</strong>
        </span>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: 16,
          fontFamily: 'monospace',
          fontSize: 14,
          marginBottom: 16,
        }}
      >
        <div style={{ color: '#64748b', marginBottom: 8 }}>
          P(unseen word | spam) = (0 + α) / (8000 + α·|V|)
        </div>
        <div style={{ color: '#1e293b' }}>
          = ({alpha.toFixed(1)}) / ({SPAM_OCCURRENCES} + {alpha.toFixed(1)}·{VOCAB_SIZE}) ={' '}
          <strong style={{ color: collapses ? '#dc2626' : '#2563eb' }}>{fmt(pUnseen)}</strong>
        </div>
      </div>

      {collapses ? (
        <div
          style={{
            background: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: 10,
            padding: 14,
            color: '#dc2626',
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          ⚠ α = 0 → P(unseen) = 0 → the whole spam score collapses to zero! One unseen word
          erases all other evidence.
        </div>
      ) : (
        <div
          style={{
            background: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            borderRadius: 10,
            padding: 14,
            color: '#2563eb',
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          ✓ Tiny but positive — the score survives. The unseen word nudges, but no longer
          annihilates, the spam score.
        </div>
      )}

      {/* Score survival visual */}
      <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
        Resulting spam score (0.224 × P(unseen)):
      </div>
      <div
        style={{
          height: 26,
          borderRadius: 8,
          background: '#e2e8f0',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${barPct}%`,
            background: collapses ? '#ef4444' : '#2563eb',
            transition: 'width 0.2s ease',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: 'monospace',
            color: collapses || barPct < 30 ? '#1e293b' : '#fff',
          }}
        >
          score = {fmt(finalScore)}
        </div>
      </div>
    </div>
  );
}
