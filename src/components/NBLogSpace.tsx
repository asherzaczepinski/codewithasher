'use client';

import { useState } from 'react';

const P = 0.05;
const LOG_P = Math.log(P); // ≈ -2.996

export default function NBLogSpace() {
  const [n, setN] = useState(40);
  const [logMode, setLogMode] = useState(false);

  const product = Math.pow(P, n);
  const logSum = LOG_P * n;
  const underflows = product === 0;

  const fmtProduct = (val: number) => {
    if (val === 0) return '0 (underflow!)';
    return val.toExponential(3);
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
          <span>Number of words n</span>
          <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={200}
          step={1}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: '#2563eb' }}
        />
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
          Each word contributes a likelihood of about{' '}
          <strong style={{ color: '#1e293b' }}>{P}</strong> (log {P} ≈ {LOG_P.toFixed(3)}).
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setLogMode((m) => !m)}
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            border: '1.5px solid #2563eb',
            background: logMode ? '#2563eb' : '#fff',
            color: logMode ? '#fff' : '#2563eb',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {logMode ? '✓ Log space (sum of logs)' : 'Switch to log space'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Naive product */}
        <div
          style={{
            background: '#fff',
            border: `1.5px solid ${underflows ? '#fecaca' : '#e5e7eb'}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', marginBottom: 8 }}>
            Naive product
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#64748b', marginBottom: 8 }}>
            {P}
            <sup>{n}</sup>
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 16,
              fontWeight: 700,
              color: underflows ? '#dc2626' : '#1e293b',
            }}
          >
            {fmtProduct(product)}
          </div>
          {underflows && (
            <div style={{ fontSize: 12, color: '#dc2626', marginTop: 8, fontWeight: 600 }}>
              Rounded to exactly 0 — the two class scores can no longer be compared.
            </div>
          )}
        </div>

        {/* Log sum */}
        <div
          style={{
            background: '#fff',
            border: `1.5px solid ${logMode ? '#bfdbfe' : '#e5e7eb'}`,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb', marginBottom: 8 }}>
            Log sum
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#64748b', marginBottom: 8 }}>
            {n} × log({P})
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 16,
              fontWeight: 700,
              color: '#1e293b',
            }}
          >
            {logSum.toFixed(3)}
          </div>
          <div style={{ fontSize: 12, color: '#2563eb', marginTop: 8, fontWeight: 600 }}>
            A stable, comparable number — never underflows no matter how large n grows.
          </div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#64748b', marginTop: 14, marginBottom: 0 }}>
        Slide n up toward 200 and beyond: the raw product disappears into zero around n ≈ 250,
        while the log sum just keeps growing more negative in a perfectly manageable way.
      </p>
    </div>
  );
}
