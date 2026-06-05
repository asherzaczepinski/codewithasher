'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="What RNNs and LSTMs Power in Practice">
        <p>
          With the core mechanics in hand, let&apos;s look at the real-world problems that drove
          RNN and LSTM research — and where these models still excel today.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Language Modeling">
        <p>
          The task of predicting the next word given all previous words is called
          <strong> language modeling</strong>. It is both a useful end-task and the pre-training
          objective behind many larger systems. LSTMs dominated this problem from roughly 2014 to
          2017. A well-trained LSTM language model can:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Complete sentences in a grammatically consistent way.</li>
          <li>Track the subject of a sentence across many words (&quot;The doctor said she would...&quot;).</li>
          <li>Generate plausible paragraphs of text in the style of its training data.</li>
        </ul>
        <p>
          The probability of a sentence is computed by multiplying next-word probabilities at each
          step — a direct product of the sequential LSTM computation.
        </p>
      </ExplanationBox>

      <MathFormula label="Language model probability (chain rule)">
        P(w₁, w₂, ..., w_T) = ∏ P(w_t | w₁, ..., w_(t-1))
      </MathFormula>

      <ExplanationBox title="Sequence-to-Sequence & Machine Translation">
        <p>
          Many tasks require mapping one sequence to a <em>different-length</em> sequence —
          translating &quot;The clouds are in the sky&quot; (5 English words) to
          &quot;Les nuages sont dans le ciel&quot; (6 French words). The architecture for this
          is called <strong>seq2seq</strong>, introduced by Google in 2014:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            An <strong>encoder LSTM</strong> reads the source sentence one word at a time,
            producing a final hidden state that summarises the whole input — a fixed-size
            &quot;thought vector.&quot;
          </li>
          <li>
            A <strong>decoder LSTM</strong> takes that thought vector as its initial hidden state
            and generates the target sentence one word at a time, each step conditioning on the
            word it just produced.
          </li>
        </ul>
        <p>
          Seq2seq with LSTMs powered the first generation of production neural machine translation
          at Google, Microsoft, and others. It replaced decades of hand-engineered phrase-based
          systems almost overnight.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Time-Series Forecasting">
        <p>
          Our running temperature example is a miniature version of a massive real-world problem.
          LSTMs are applied to:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Weather forecasting</strong> — predicting temperature, precipitation, and wind
            speed from historical sensor readings across many stations.
          </li>
          <li>
            <strong>Financial time series</strong> — modelling volatility or price movements from
            historical market data (though predicting prices is notoriously hard; the LSTM does
            not have a crystal ball, only a long memory).
          </li>
          <li>
            <strong>Anomaly detection</strong> — an LSTM trained on normal patterns flags readings
            that deviate significantly from its predictions, useful for detecting equipment failures
            or network intrusions.
          </li>
          <li>
            <strong>Healthcare</strong> — predicting patient deterioration from sequences of
            vital signs and lab results recorded in electronic health records.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The GRU: A Leaner Alternative">
        <p>
          In 2014, Cho et al. proposed the <strong>Gated Recurrent Unit (GRU)</strong>, which
          achieves similar performance to the LSTM with fewer parameters. The GRU merges the
          forget and input gates into a single <strong>update gate</strong> and eliminates the
          separate cell state, using only the hidden state h<sub>t</sub>:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Update gate z<sub>t</sub>:</strong> how much of the old hidden state to keep vs. replace.</li>
          <li><strong>Reset gate r<sub>t</sub>:</strong> how much of the old hidden state to expose when computing the candidate new state.</li>
        </ul>
        <p>
          The GRU is faster to train and often performs on par with the LSTM for shorter sequences.
          For very long sequences the LSTM&apos;s separate cell state tends to win. In practice,
          try both and let your validation set decide.
        </p>
      </ExplanationBox>

      <MathFormula label="GRU update (simplified)">
        z_t = sigmoid(W_z · [h_(t-1), x_t])
        h_t = (1 − z_t) ⊙ h_(t-1) + z_t ⊙ tanh(W · [r_t ⊙ h_(t-1), x_t])
      </MathFormula>

      <ExplanationBox title="Why Transformers Took Over — and Why RNNs Still Matter">
        <p>
          By 2017, <strong>Transformers</strong> (introduced in the paper &quot;Attention Is All
          You Need&quot;) had begun replacing LSTMs as the dominant architecture for language
          tasks, and by 2020 the shift was nearly complete for NLP. The reasons are fundamental:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Parallelism:</strong> the RNN&apos;s sequential computation is its biggest
            weakness for training. Because step <em>t</em> depends on step <em>t&minus;1</em>,
            you cannot parallelise across time. A Transformer processes all positions simultaneously
            via attention, making it vastly faster to train on modern GPU/TPU hardware.
          </li>
          <li>
            <strong>Direct long-range connections:</strong> in a Transformer, token 1 and token
            500 are directly connected via attention — no gradient has to travel through 499
            multiplicative steps. Long-range dependencies become easy.
          </li>
          <li>
            <strong>Scale:</strong> because Transformers train faster, they can be scaled to
            billions of parameters on billions of tokens, which is where the large language
            models (GPT, Claude, Gemini) live.
          </li>
        </ul>
        <p>
          That said, RNNs and LSTMs are <em>not</em> obsolete. They remain the right tool when:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Compute is constrained</strong> — a small LSTM running on a microcontroller
            can do real-time anomaly detection with a few KB of memory; a Transformer cannot.
          </li>
          <li>
            <strong>Sequences are very long and streaming</strong> — an LSTM processes each new
            token in O(1) time and O(1) memory at inference; a Transformer&apos;s attention
            grows quadratically with sequence length.
          </li>
          <li>
            <strong>Time-series tasks</strong> — for many forecasting benchmarks, LSTMs still
            match or beat Transformers, especially on small datasets where the Transformer&apos;s
            large parameter count is a liability.
          </li>
        </ul>
        <p>
          Understanding RNNs and LSTMs is not just historical. It gives you the conceptual tools
          to understand <em>why</em> Transformers were designed the way they were — attention
          is essentially a learned solution to the same problem the LSTM solved with gates.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You Did It">
        <p>
          You have now traced the complete arc of recurrent sequence modeling:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Why ordered data requires a different approach than feedforward networks.</li>
          <li>How the RNN hidden state carries memory forward one step at a time.</li>
          <li>How to unroll a recurrent loop and compute step-by-step outputs by hand.</li>
          <li>Why vanishing gradients make long-range memory hard for plain RNNs.</li>
          <li>How the LSTM&apos;s cell state and three gates solve the vanishing gradient problem.</li>
          <li>Where these architectures are used, how the GRU simplifies the LSTM, and why Transformers have largely taken over for NLP.</li>
        </ul>
        <p>
          The mental model you have built here — sequence, hidden state, gate, gradient flow — will
          serve you well whether you are reading a paper about state-space models, debugging a
          time-series forecaster, or understanding the attention mechanism in the next course.
          Well done.
        </p>
      </ExplanationBox>
    </div>
  );
}
