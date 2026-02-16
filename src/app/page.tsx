import Image from 'next/image';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: '#222' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px 80px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 56, paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src="/logo.png" alt="codewithasher logo" width={180} height={98} style={{ objectFit: 'contain', marginBottom: 20 }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, margin: 0, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1 }}>
            codewithasher
          </h1>
        </div>

        {/* Courses */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 14 }}>Courses</h2>

          {/* Neural Networks - featured */}
          <a
            href="/neural-networks"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: 24,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>Neural Networks</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>24 modules</span>
            </div>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>
              Build a neural network from scratch — no libraries, just pure math and deep understanding.
            </p>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>Start learning →</span>
          </a>

          {/* LLMs */}
          <div
            style={{
              padding: 24,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              opacity: 0.45,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>Large Language Models</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#888', background: '#eee', padding: '3px 10px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Coming Soon</span>
            </div>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: 0 }}>
              Understand how LLMs work by building one from the ground up — tokenization, attention, and generation.
            </p>
          </div>
        </div>

        {/* About */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', marginBottom: 14 }}>About</h2>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            Hey, I'm Asher — a 10th grader who got frustrated. I wanted to understand how things
            <em> actually</em> work — not just use them and hope for the best.
          </p>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            I tried everything. YouTube tutorials. The fancy 3Blue1Brown series (which is beautiful,
            but still didn't make it click for me). Stanford lectures. Blog posts. Nothing worked.
            Every explanation either hand-waved the hard parts or drowned me in notation I didn't know.
          </p>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            So I built this. Every concept is broken down with real math, interactive code, and
            step-by-step explanations so you can build genuine intuition. Whether you're a student,
            a developer, or just curious — if you want to truly understand what's happening under
            the hood, you're in the right place.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <a
              href="https://www.linkedin.com/in/asher-zaczepinski-755651373/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}
            >
              LinkedIn →
            </a>
            <a
              href="https://github.com/asherzaczepinski"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 14, fontWeight: 500, color: '#2563eb', textDecoration: 'none' }}
            >
              GitHub →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
