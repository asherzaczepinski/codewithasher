'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Nobody Typed These Numbers In">
        <p>
          Last step we looked up three vectors — <code>The = [0.1, 0.0, 0.9]</code>,{' '}
          <code>sky = [1.0, 0.7, 0.0]</code>, <code>is = [0.1, 0.2, 0.8]</code> — and ended on a nagging
          question: where did the numbers come from? The answer is that{' '}
          <strong>the model invented every one of them</strong>. No engineer decided that{' '}
          <code>sky</code> deserves a <code>1.0</code> in the first slot. The embedding table is{' '}
          <em>learned</em>, the same way the weights in the neural-network course were learned: start from
          random noise, then nudge.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Meaning Is the Company a Word Keeps">
        <p>
          So if no one types the numbers in, what decides them? The whole foundation of embeddings is a
          single idea: <strong>a word&apos;s meaning is the company it keeps.</strong> You can work out what
          a word means purely from <em>which other words tend to show up around it</em> — no dictionary, no
          definitions, just counting neighbours across a mountain of text.
        </p>
        <p>
          Watch how far that one idea goes. <code>sky</code> and <code>ocean</code> are never the same word,
          but they keep the <em>same company</em> — both sit near &ldquo;blue,&rdquo; &ldquo;water&rdquo; or
          &ldquo;clouds,&rdquo; &ldquo;is,&rdquo; &ldquo;the.&rdquo; A model that only ever tracks{' '}
          <strong>how often each word appears next to each other word</strong> will, just from those counts,
          end up placing sky and ocean close together — and shove a word like <code>pizza</code>, which
          keeps totally different company, far away. Even function words fall out of it: <code>the</code> and
          <code> a</code> sit next to nearly everything, so they share company with each other and cluster
          on their own. Meaning, to a model, is nothing more than these co-occurrence patterns squeezed down
          into a few numbers.
        </p>
        <p>
          That leaves one real question, the one the last version of this course hand-waved: <em>how</em>{' '}
          does a network actually turn &ldquo;who sits near whom&rdquo; into those coordinates? It deserves
          its own tab. Next, we&apos;ll start a tiny embedding from random noise, train it on a small pile of
          sentences, and <strong>watch it sort itself into meaning in real time</strong> — then open up the
          actual network doing the work.
        </p>
      </ExplanationBox>
    </div>
  );
}
