'use client';

import { useState } from 'react';

interface WordRow {
  word: string;
  spam: number;
  ham: number;
}

const INITIAL_ROWS: WordRow[] = [
  { word: 'free', spam: 32, ham: 4 },
  { word: 'winner', spam: 28, ham: 1 },
  { word: 'meeting', spam: 2, ham: 42 },
];

const SPAM_TOTAL = 40;
const HAM_TOTAL = 60;

export default function NBLikelihoodTable() {
  const [rows, setRows] = useState<WordRow[]>(INITIAL_ROWS);
  const [showProbs, setShowProbs] = useState(false);

  const nudge = (index: number, cls: 'spam' | 'ham', delta: number) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const cap = cls === 'spam' ? SPAM_TOTAL : HAM_TOTAL;
        const next = Math.max(0, Math.min(cap, r[cls] + delta));
        return { ...r, [cls]: next };
      })
    );
  };

  const fmt = (count: number, total: number) =>
    showProbs ? (count / total).toFixed(3) : String(count);

  const cellStyle: React.CSSProperties = {
    padding: '10px 12px',
    textAlign: 'center',
    borderBottom: '1px solid #e2e8f0',
  };

  const stepBtn = (onClick: () => void, label: string, color: string) => (
    <button
      onClick={onClick}
      style={{
        width: 22,
        height: 22,
        lineHeight: '20px',
        borderRadius: 6,
        border: `1px solid ${color}`,
        background: '#fff',
        color,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {label}
    </button>
  );

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
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
          Showing:
        </div>
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid #e2e8f0',
            borderRadius: 999,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {[
            { key: false, label: 'Counts' },
            { key: true, label: 'P(word | class)' },
          ].map((opt) => {
            const active = showProbs === opt.key;
            return (
              <button
                key={opt.label}
                onClick={() => setShowProbs(opt.key)}
                style={{
                  padding: '6px 16px',
                  border: 'none',
                  background: active ? '#2563eb' : '#fff',
                  color: active ? '#fff' : '#64748b',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fff',
            borderRadius: 10,
            overflow: 'hidden',
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ ...cellStyle, textAlign: 'left', fontWeight: 700, color: '#1e293b' }}>
                Word
              </th>
              <th style={{ ...cellStyle, color: '#dc2626', fontWeight: 700 }}>
                {showProbs ? 'P(word | spam)' : 'count in spam'}
              </th>
              <th style={{ ...cellStyle, color: '#2563eb', fontWeight: 700 }}>
                {showProbs ? 'P(word | ham)' : 'count in ham'}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.word}>
                <td style={{ ...cellStyle, textAlign: 'left', fontWeight: 600, color: '#1e293b' }}>
                  {r.word}
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {stepBtn(() => nudge(i, 'spam', -1), '−', '#ef4444')}
                    <span style={{ minWidth: 56, fontWeight: 700, color: '#dc2626' }}>
                      {fmt(r.spam, SPAM_TOTAL)}
                    </span>
                    {stepBtn(() => nudge(i, 'spam', 1), '+', '#ef4444')}
                  </div>
                </td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {stepBtn(() => nudge(i, 'ham', -1), '−', '#2563eb')}
                    <span style={{ minWidth: 56, fontWeight: 700, color: '#2563eb' }}>
                      {fmt(r.ham, HAM_TOTAL)}
                    </span>
                    {stepBtn(() => nudge(i, 'ham', 1), '+', '#2563eb')}
                  </div>
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f8fafc' }}>
              <td style={{ ...cellStyle, textAlign: 'left', fontWeight: 700, color: '#64748b' }}>
                Total emails
              </td>
              <td style={{ ...cellStyle, fontWeight: 700, color: '#dc2626' }}>
                {SPAM_TOTAL} spam
              </td>
              <td style={{ ...cellStyle, fontWeight: 700, color: '#2563eb' }}>
                {HAM_TOTAL} ham
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', marginTop: 12, marginBottom: 0 }}>
        {showProbs ? (
          <>
            Each probability is just the count divided by the class total — e.g.
            P(free | spam) = 32 / 40 = 0.800. Nudge a count and watch the probability move.
          </>
        ) : (
          <>
            These are raw frequencies from training. Toggle to <strong>P(word | class)</strong>{' '}
            to see them divided by the class totals.
          </>
        )}
      </p>
    </div>
  );
}
