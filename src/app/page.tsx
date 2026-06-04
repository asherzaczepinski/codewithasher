'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TOTAL_STEPS } from '@/lib/store';
import { getCompletedSteps } from '@/lib/progress';
import { LLM_TOTAL_STEPS } from '@/lib/llmStore';
import { getCompletedSteps as getLlmCompletedSteps } from '@/lib/llmProgress';

export default function HomePage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [llmCompletedCount, setLlmCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(getCompletedSteps().size);
    setLlmCompletedCount(getLlmCompletedSteps().size);
  }, []);

  const progressPercent = Math.round((completedCount / TOTAL_STEPS) * 100);
  const llmProgressPercent = Math.round((llmCompletedCount / LLM_TOTAL_STEPS) * 100);

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
              <span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>{TOTAL_STEPS} modules</span>
            </div>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>
              Build a neural network from scratch — no libraries, just pure math and real understanding.
            </p>

            {/* Progress */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{completedCount}/{TOTAL_STEPS} completed</span>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{progressPercent}%</span>
              </div>
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercent}%`, background: '#2563eb', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>

            <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>
              {completedCount > 0 ? 'Continue learning →' : 'Start learning →'}
            </span>
          </a>

          {/* LLMs */}
          <a
            href="/llms"
            style={{
              display: 'block',
              padding: 24,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: '#222' }}>Large Language Models</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#888' }}>{LLM_TOTAL_STEPS} modules</span>
            </div>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6, margin: '0 0 14px' }}>
              Understand how LLMs work by building one from the ground up — tokenization, embeddings, attention, and generation.
            </p>

            {/* Progress */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{llmCompletedCount}/{LLM_TOTAL_STEPS} completed</span>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>{llmProgressPercent}%</span>
              </div>
              <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${llmProgressPercent}%`, background: '#2563eb', borderRadius: 3, transition: 'width 0.3s' }} />
              </div>
            </div>

            <span style={{ fontSize: 14, fontWeight: 500, color: '#2563eb' }}>
              {llmCompletedCount > 0 ? 'Continue learning →' : 'Start learning →'}
            </span>
          </a>
        </div>

        {/* About */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              <Image
                src="/asher.png"
                alt="Asher Zaczepinski"
                width={80}
                height={80}
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#222', margin: 0 }}>About</h2>
          </div>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            Hey, I&apos;m Asher Zaczepinski — a 10th grader who got frustrated with traditional coding tutorials.
            I tried everything. YouTube tutorials. The fancy 3Blue1Brown series. Stanford lectures. Blog posts. Nothing worked.
            Every explanation either hand-waved the hard parts or drowned me in notation I didn&apos;t know.
          </p>
          <p style={{ color: '#444', fontSize: 18, lineHeight: 1.7 }}>
            So I built this platform where each coding concept is broken down with real math and
            step-by-step explanations so you can build genuine intuition. Whether you&apos;re a student,
            a developer, or just curious, if you want to truly understand what&apos;s happening under
            the hood, you&apos;re in the right place.
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
