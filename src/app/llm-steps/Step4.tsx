'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="A Token ID Means Nothing as a Number">
        <p>
          Tokenization turned <strong>&ldquo;The sky is&rdquo;</strong> into a list of token IDs:
          something like <code>464, 6766, 318</code>. But those numbers are just <em>name tags</em>.
          Token 6766 is not &ldquo;bigger&rdquo; or &ldquo;more&rdquo; than token 464 in any meaningful
          way — the IDs are arbitrary positions in a dictionary. If you fed them straight into a network
          that multiplies and adds, it would conclude that <code>is</code> (318) is roughly half of{' '}
          <code>The</code> (464), which is nonsense.
        </p>
        <p>
          So the very first thing a model does is throw the ID away and replace it with something that{' '}
          <em>does</em> carry meaning: a <strong>vector</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What a Vector Is">
        <p>
          A <strong>vector</strong> is just a list of numbers — that is the whole definition.{' '}
          <code>[0.1, 0.2, 0.8]</code> is a 3-dimensional vector. You can picture it as an arrow from the
          origin to a point in space, or simply as a row of coordinates.
        </p>
        <p>
          The jump from &ldquo;a word&rdquo; to &ldquo;a point in space&rdquo; is the single most
          important idea in Part 2. Once words are points, <em>similar words sit close together</em>, and
          closeness is something a computer can measure with arithmetic.
        </p>
      </ExplanationBox>

      <ExplanationBox title="But Where Do the Numbers Come From?">
        <p>
          A fair objection: those numbers look made up. Who decided <code>sky</code> gets a{' '}
          <code>1.0</code> in the first slot? The honest answer is that <strong>nobody did</strong> — the
          model invents every one of them during training, from nothing but raw text. Exactly how it pulls
          those numbers out of thin air is the whole of the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
