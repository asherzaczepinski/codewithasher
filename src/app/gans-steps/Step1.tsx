'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What Is a Generative Model?">
        <p>
          Most neural networks you&apos;ve heard of are <strong>discriminative</strong>: they
          take data that already exists and classify it. &quot;Is this email spam?&quot;
          &quot;Is this X-ray showing a tumor?&quot; &quot;Which digit is in this image?&quot;
          The input is real; the network just draws a boundary between categories.
        </p>
        <p>
          A <strong>generative model</strong> does something far more ambitious: it learns the
          underlying structure of the data well enough to <em>create brand-new examples</em> that
          could plausibly have come from the same source. Instead of asking &quot;which
          category does this belong to?&quot; it asks &quot;what does something from this
          category look like?&quot;
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Fake Human Faces">
        <p>
          Throughout this course we use one concrete goal: teaching a machine to generate
          realistic photographs of human faces that do not belong to any real person. The network
          has never seen the person it draws — it synthesizes them entirely from scratch.
        </p>
        <p>
          This is not a toy task. The same mathematical framework that produces convincing faces
          also powers image super-resolution, drug molecule design, voice synthesis, and much more.
          Faces just make the results instantly legible: you can tell at a glance whether the
          output looks real.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Counterfeiter vs. the Detective">
        <p>
          GANs achieve generation through an elegant adversarial setup. Imagine two people:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>The Counterfeiter</strong> starts with nothing but a bag of random noise
            and tries to paint portraits convincing enough to pass off as real photographs.
          </li>
          <li>
            <strong>The Detective</strong> examines every portrait and tries to decide: is this
            a genuine photograph or a fake?
          </li>
        </ul>
        <p>
          The two are locked in a game. Every time the detective catches a fake, the counterfeiter
          studies what gave it away and improves. Every time a fake slips through, the detective
          reviews its mistakes and sharpens its eye. Over thousands of rounds both players get
          better — and the counterfeiter&apos;s fakes get frighteningly good.
        </p>
        <p>
          In a GAN, the <strong>Generator</strong> is the counterfeiter and the{' '}
          <strong>Discriminator</strong> is the detective. Neither network is told what a face
          &quot;should&quot; look like in explicit rules — they figure it out through competition.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why GANs Matter">
        <p>
          Before GANs (introduced by Ian Goodfellow in 2014), generating sharp, high-resolution
          images with neural networks was essentially unsolved. GANs changed that overnight.
          They sparked an entire research field, introduced a new training paradigm —
          adversarial training — and demonstrated that neural networks could be creative, not
          just analytical. Understanding GANs is foundational to understanding modern generative AI.
        </p>
      </ExplanationBox>
    </div>
  );
}
