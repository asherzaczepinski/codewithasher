'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

const CASES = [
  {
    id: 'images',
    label: 'Color Images',
    emoji: '🖼',
    tagline: 'Classifying what\'s in a photo',
    intro: 'Every pixel in a color image is three numbers — one for red, one for green, one for blue. A network sees nothing but those numbers, and from them it learns to recognize cats, tumors, stop signs, whatever it\'s trained on.',
    inputs: {
      title: 'Inputs',
      body: 'A 64×64 color image = 64 × 64 × 3 = 12,288 inputs. Each channel value is divided by 255 to land in the 0–1 range, the same normalization used for temperature and humidity. A larger image — say 224×224 — gives 150,528 inputs. Every single one gets its own weight into the first hidden layer.',
    },
    layers: {
      title: 'Typical layers',
      body: 'Small classifiers: 3–5 layers. Production models like ResNet-50 have 50 layers; ResNet-152 has 152. Most image networks use convolutional layers (specialized for detecting local patterns like edges and textures) before the fully-connected layers you built, but every layer still runs weighted sums and activation functions.',
    },
    outputs: {
      title: 'Outputs',
      body: 'One output neuron per class. A dog vs. cat classifier has 2 outputs. ImageNet classifiers have 1,000 outputs — one per category. Each output fires a confidence between 0 and 1 via sigmoid (or softmax for multi-class), and the highest one is the prediction.',
    },
  },
  {
    id: 'text',
    label: 'Language Models',
    emoji: '💬',
    tagline: 'Predicting and generating text',
    intro: 'Text can\'t go straight into a network — letters have no natural scale. So words (or sub-word pieces called tokens) get converted into lists of numbers called embeddings. Those numbers capture meaning: "happy" and "joyful" end up with similar values because they appear in similar contexts during training.',
    inputs: {
      title: 'Inputs',
      body: 'Each token becomes a vector of 512–4096 numbers depending on the model size. GPT-3 uses 12,288 numbers per token. A context window of 2,048 tokens gives roughly 25 million input values at once — all fed through the network simultaneously. The embedding values are themselves learned weights, updated by backpropagation just like everything else.',
    },
    layers: {
      title: 'Typical layers',
      body: 'GPT-2 (small): 12 layers. GPT-3: 96 layers. Most use transformer attention layers instead of simple fully-connected ones, but every attention layer still boils down to weighted sums over inputs. The same chain rule you learned computes gradients through all 96 of them.',
    },
    outputs: {
      title: 'Outputs',
      body: 'One output per token in the vocabulary — GPT models typically have 50,000+ output neurons. Each fires a probability for "how likely is this word next?" The network picks the highest (or samples from the distribution) to generate the next token, then feeds it back in and repeats.',
    },
  },
  {
    id: 'audio',
    label: 'Audio',
    emoji: '🎙',
    tagline: 'Speech recognition and sound classification',
    intro: 'Sound is a wave — air pressure changing thousands of times per second. A microphone samples that wave at regular intervals and produces a stream of numbers. Those numbers are the raw material a network can learn from.',
    inputs: {
      title: 'Inputs',
      body: 'Raw audio at 16,000 samples/sec means 16,000 numbers per second of sound. In practice, most models first convert to a spectrogram — a 2D grid showing frequency content over time. A one-second clip might become an 80×100 grid (8,000 values), each normalized to a consistent range. That spectrogram then feeds the network exactly like a grayscale image.',
    },
    layers: {
      title: 'Typical layers',
      body: 'Small keyword detectors (like "Hey Siri"): 5–10 lightweight layers optimized to run on-device. Full speech-to-text models like Whisper use 32 transformer layers. Whisper processes audio in 30-second chunks, running the same weighted-sum math you know across millions of weights.',
    },
    outputs: {
      title: 'Outputs',
      body: 'For speech recognition: one output per character or word-piece in the vocabulary, predicting what was said. For sound classification (dog bark, glass break, music genre): one output per category, same as image classifiers. The loss is computed the same way — compare output to the correct label, trace blame backward.',
    },
  },
  {
    id: 'sensors',
    label: 'Sensor Data',
    emoji: '📡',
    tagline: 'Health monitors, weather stations, fraud detection',
    intro: 'Not everything is images or language. A lot of real-world AI runs on simple tables of numbers — heart rate over time, transaction amounts, temperature readings from a factory floor. This is where the rain predictor you built is closest to production.',
    inputs: {
      title: 'Inputs',
      body: 'Whatever the sensors measure, normalized to 0–1. A health monitor might use heart rate, blood oxygen, step count, sleep stage — maybe 10–50 inputs. A fraud detection system might use transaction amount, time of day, location distance from last purchase, merchant category — each one a number, each normalized, each feeding into the first layer with its own weight.',
    },
    layers: {
      title: 'Typical layers',
      body: 'Surprisingly shallow — often just 2–4 fully-connected layers. The rain predictor architecture you built is genuinely representative. When inputs are already clean numbers (not raw pixels or raw audio), deep networks aren\'t always needed. The tricky part is feature engineering — deciding which measurements to include and how to normalize them.',
    },
    outputs: {
      title: 'Outputs',
      body: 'Binary classifiers (fraud / not fraud, rain / no rain, healthy / anomaly): one output neuron with sigmoid, exactly like the rain predictor. Multi-class outputs (which of 5 disease stages, which of 10 activity types): one output per class. Regression outputs (predict exact temperature, predict exact price): one output neuron with no sigmoid at the end — just the raw weighted sum.',
    },
  },
];

export default function Step19() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = CASES.find(c => c.id === selected) ?? null;

  return (
    <div>
      <ExplanationBox title="Everything You Learned Still Applies — The Inputs Just Change">
        <p>
          Every concept from this course — weights, weighted sums, sigmoid, loss, gradients,
          backpropagation — works exactly the same way no matter what the network is looking at.
          The only thing that changes between a rain predictor and an image classifier or a
          language model is what gets fed in as inputs. Pick a use case to see how.
        </p>
      </ExplanationBox>

      {/* Case picker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        margin: '1.5rem 0 1.25rem',
      }}>
        {CASES.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0.25rem',
              padding: '1rem',
              background: selected === c.id ? '#f0fdf4' : 'white',
              border: `1.5px solid ${selected === c.id ? '#86efac' : '#e2e8f0'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '22px' }}>{c.emoji}</span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: selected === c.id ? '#166534' : '#1e293b' }}>{c.label}</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{c.tagline}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {active && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}>
          {/* Header */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            background: 'white',
          }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '0.4rem' }}>Use case</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{active.emoji} {active.label}</div>
            <p style={{ margin: '0.6rem 0 0', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{active.intro}</p>
          </div>

          {/* Three sections */}
          {[active.inputs, active.layers, active.outputs].map((section, i) => {
            const colors = [
              { bg: '#eff6ff', border: '#bfdbfe', label: '#1d4ed8', dot: '#2563eb' },
              { bg: '#faf5ff', border: '#d8b4fe', label: '#6d28d9', dot: '#7c3aed' },
              { bg: '#f0fdf4', border: '#bbf7d0', label: '#166534', dot: '#16a34a' },
            ];
            const col = colors[i];
            return (
              <div key={section.title} style={{
                padding: '1.1rem 1.5rem',
                borderBottom: i < 2 ? '1px solid #e2e8f0' : 'none',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: col.bg,
                  border: `1px solid ${col.border}`,
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: col.label,
                  marginBottom: '0.5rem',
                }}>{section.title}</div>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#374151', lineHeight: 1.7 }}>{section.body}</p>
              </div>
            );
          })}
        </div>
      )}

      <ExplanationBox title="The Pattern Is Always the Same">
        <ol style={{ marginTop: '0.5rem', lineHeight: 2.2 }}>
          <li><strong>Turn the raw data into numbers</strong> — pixels, embeddings, sample amplitudes, sensor readings.</li>
          <li><strong>Normalize them</strong> to a consistent range so no single input dominates.</li>
          <li><strong>Feed them into the network</strong> — each number is one input, each gets its own weight.</li>
          <li><strong>Train with backpropagation</strong> — loss, gradients, weight updates work exactly as you learned.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          The networks get bigger and the architectures get specialized, but every weight in every
          layer still gets its gradient from the exact same three-step chain: loss → output → weighted
          sum → weight. That&apos;s the engine underneath all of it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You Now Understand How Modern AI Works">
        <p>
          The rain predictor you built from scratch — normalizing inputs, computing weighted sums,
          applying sigmoid, measuring loss, tracing gradients backward, nudging weights — is the
          same process running inside every image classifier, every voice assistant, every language
          model. The scale is different. The data is different. The core idea is exactly what
          you just learned.
        </p>
      </ExplanationBox>
    </div>
  );
}
