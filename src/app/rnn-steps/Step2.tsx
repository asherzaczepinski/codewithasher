'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Context Is Everything">
        <p>
          Consider the sentence: <em>&quot;The clouds are in the ___.&quot;</em>
        </p>
        <p>
          If all you see is the last word &mdash; &quot;the&quot; &mdash; you have almost no idea
          what comes next. The blank could be filled with &quot;sky,&quot; &quot;forecast,&quot;
          &quot;distance,&quot; or a hundred other things. But once you carry the whole sentence
          forward — once you remember &quot;clouds&quot; — the answer becomes obvious: <em>sky</em>.
        </p>
        <p>
          This is the core problem of sequence modeling: <strong>earlier tokens provide essential
          context for later predictions</strong>. A model that processes words one at a time,
          forgetting each word as soon as it moves on, is useless.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Memory Problem With Plain Networks">
        <p>
          Imagine we try to use a standard feedforward network for next-word prediction. We feed it
          the current word and ask it to predict the next one. The network sees:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Step 1: &quot;The&quot; → predict next word</li>
          <li>Step 2: &quot;clouds&quot; → predict next word</li>
          <li>Step 3: &quot;are&quot; → predict next word</li>
          <li>Step 4: &quot;in&quot; → predict next word</li>
          <li>Step 5: &quot;the&quot; → predict next word ← <strong>only sees &quot;the&quot;!</strong></li>
        </ul>
        <p>
          At step 5, the network has completely forgotten &quot;clouds.&quot; It has no mechanism
          to carry information from an earlier step into a later one. Each forward pass starts
          from scratch.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Same Problem in Time Series">
        <p>
          Our temperature example shows the same issue. Suppose we record temperature every hour
          and want to predict the next reading. The table below shows six hours of data:
        </p>
        <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                <th style={{ border: '1px solid #d0d8f0', padding: '8px 14px' }}>Hour</th>
                <th style={{ border: '1px solid #d0d8f0', padding: '8px 14px' }}>Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {[['1', '12'], ['2', '11'], ['3', '10'], ['4', '9'], ['5', '8'], ['6', '?']].map(([h, t]) => (
                <tr key={h}>
                  <td style={{ border: '1px solid #d0d8f0', padding: '8px 14px', textAlign: 'center' }}>{h}</td>
                  <td style={{ border: '1px solid #d0d8f0', padding: '8px 14px', textAlign: 'center' }}>{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A model that only sees the hour-5 reading of 8°C might guess anything. But a model that
          remembers the <em>trend</em> — temperatures have been dropping by 1°C every hour — can
          confidently predict 7°C. The trend is the memory; without it, the model is blind.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We Need: A Carried State">
        <p>
          The solution is to give the network a <strong>state variable</strong> that it updates at
          every step and carries forward to the next. Think of it as a notepad: at each word (or
          each temperature reading), the model reads its notepad, updates it with new information,
          and passes the updated notepad to the next step.
        </p>
        <p>
          Formally, we call this the <strong>hidden state</strong>, written <em>h</em>. After
          processing step <em>t</em>, the network produces hidden state{' '}
          <em>h</em><sub>t</sub> which encodes everything it has chosen to remember about the
          sequence so far. That state then flows directly into step <em>t + 1</em>.
        </p>
      </ExplanationBox>

      <MathFormula label="The key idea">
        h_t depends on both x_t (current input) and h_(t-1) (past memory)
      </MathFormula>

      <ExplanationBox title="Why This Is Non-Trivial">
        <p>
          Carrying a state sounds simple, but it raises real questions:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>What should go into the state?</strong> The model must learn, from data, which
            parts of the past are worth remembering. &quot;clouds&quot; matters for predicting the
            next word; the word &quot;the&quot; is less specific.
          </li>
          <li>
            <strong>How long can memory last?</strong> In a short sentence, two or three steps is
            enough. In a novel, a pronoun on page 80 might refer to a character introduced on page
            1. Maintaining that memory is extremely hard — and we will see exactly why in the
            Vanishing Gradients module.
          </li>
          <li>
            <strong>How do we train this?</strong> When the network makes a mistake at step 10,
            we need to adjust weights that were used at step 1. Tracing that influence backward
            through time is the challenge of backpropagation through time (BPTT).
          </li>
        </ul>
        <p>
          In the next module, we will make the hidden state concrete by writing down the exact
          equation an RNN uses to update it.
        </p>
      </ExplanationBox>
    </div>
  );
}
