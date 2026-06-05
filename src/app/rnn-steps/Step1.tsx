'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Most data in the real world is not a single snapshot — it is a sequence that unfolds over
          time. A sentence, a recording of speech, a week of daily temperatures, a melody — all of
          these are sequences where <strong>order carries meaning</strong>. Change the order and you
          change everything: &quot;The dog bit the man&quot; and &quot;The man bit the dog&quot; use
          exactly the same words but say completely different things.
        </p>
        <p>
          This course builds up, step by step, the family of neural networks designed specifically
          for sequences: <strong>Recurrent Neural Networks (RNNs)</strong> and their more powerful
          descendant, the <strong>Long Short-Term Memory network (LSTM)</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Examples of Sequence Data">
        <p>
          Sequence data shows up in nearly every domain:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Text</strong> — each word depends on the words before it. Predicting the next
            word in &quot;the clouds are in the ___&quot; requires remembering the whole sentence,
            not just the last word.
          </li>
          <li>
            <strong>Audio &amp; Speech</strong> — a spoken phoneme only makes sense in the context
            of adjacent sounds. The letter &apos;p&apos; in &quot;spin&quot; sounds different from
            the &apos;p&apos; in &quot;pin&quot; because of what precedes it.
          </li>
          <li>
            <strong>Time series</strong> — a sensor reading at 3 PM is meaningless without knowing
            the readings at 1 PM and 2 PM. Tomorrow&apos;s temperature depends on a trend, not
            just today&apos;s value.
          </li>
          <li>
            <strong>Video</strong> — a single frame rarely tells you what is happening; you need
            consecutive frames to detect motion and action.
          </li>
        </ul>
        <p>
          Throughout this course we will use two concrete running examples:
          <strong> predicting the next word</strong> in a sentence, and
          <strong> predicting the next temperature reading</strong> in a time series. Both are
          simple enough to reason about completely, yet rich enough to expose every concept we need.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Plain Networks and CNNs Fall Short">
        <p>
          A standard feedforward neural network expects a <strong>fixed-size input</strong>. To
          process a sentence, you would need to decide up front: &quot;my input is always exactly
          10 words.&quot; Shorter sentences get padded with meaningless tokens; longer sentences
          get truncated. More importantly, a plain network has no sense of which position came
          first — it treats input slot 1 and input slot 7 as independent features with no
          relationship to each other.
        </p>
        <p>
          Convolutional networks (CNNs) do a bit better: they apply a sliding window that captures
          local patterns like bigrams or trigrams. But a CNN&apos;s window is fixed. It cannot
          easily connect a word at position 1 to a word at position 50. It also processes every
          position <em>independently in parallel</em>, with no state that carries from one end of
          the sequence to the other.
        </p>
        <p>
          What we really need is a network that can <strong>read a sequence one step at a
          time</strong>, updating an internal memory as it goes — so that by the time it reaches
          the last word, it still &quot;knows&quot; what the first word was. That is exactly what
          an RNN does.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Will Build Up">
        <p>
          By the end of this course you will understand:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>How the RNN hidden state stores and updates a memory of the past.</li>
          <li>How to unroll a recurrent loop through time and compute outputs step by step.</li>
          <li>Why training deep time sequences is hard (vanishing gradients) and what goes wrong.</li>
          <li>How the LSTM solves that problem with three clever gates.</li>
          <li>Where these models are used in practice — and where Transformers took over.</li>
        </ul>
        <p>
          No new libraries required. The math is algebra and a little calculus intuition — everything
          will be explained as we need it.
        </p>
      </ExplanationBox>
    </div>
  );
}
