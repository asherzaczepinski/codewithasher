'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Central Question Attention Answers">
        <p>
          When the transformer processes the word &quot;sat&quot; in &quot;the cat sat on the mat&quot;,
          it needs to decide: which other words should &quot;sat&quot; look at to build its contextual
          representation? &quot;cat&quot; is important (the subject), &quot;mat&quot; is important
          (the location), but &quot;the&quot; and &quot;on&quot; matter less.
        </p>
        <p>
          <strong>Self-attention</strong> answers this question by letting every token broadcast a
          query (&quot;what am I looking for?&quot;), and every token advertise a key
          (&quot;what do I contain?&quot;). Query-key similarity determines how much attention
          each token pays to each other token. The actual information transferred is called
          the <strong>value</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Projecting Into Q, K, V Space">
        <p>
          For each token embedding x&#7522; (a vector of dimension d), the model learns three separate
          weight matrices W&#x1D410;, W&#x1D40A;, W&#x1D415; (each of shape d x d&#7424;, where d&#7424; is
          the head dimension). Multiplying:
        </p>
      </ExplanationBox>

      <MathFormula label="Query, Key, Value projections">
        Q&#7522; = x&#7522; W&#x1D410; &nbsp;&nbsp;&nbsp; K&#7522; = x&#7522; W&#x1D40A; &nbsp;&nbsp;&nbsp; V&#7522; = x&#7522; W&#x1D415;
      </MathFormula>

      <ExplanationBox title="Why Three Separate Matrices?">
        <p>
          Each matrix plays a different role. W&#x1D410; transforms x&#7522; into a &quot;what am I
          searching for&quot; representation. W&#x1D40A; transforms it into a &quot;what can I offer&quot;
          representation. W&#x1D415; transforms it into &quot;the information I will actually hand over
          if selected.&quot;
        </p>
        <p>
          Using separate matrices gives the model the freedom to represent these three roles
          completely differently. A token&apos;s query might encode syntactic role (verb, noun),
          its key might encode semantic category (action, object), and its value might encode
          the detailed contextual information other tokens actually want to aggregate.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Scaled Dot-Product Attention">
        <p>
          Once we have the Q, K, V matrices for all n tokens (stacked as rows), the full
          attention computation is:
        </p>
      </ExplanationBox>

      <MathFormula label="Scaled dot-product attention">
        Attention(Q, K, V) = softmax(Q K&#7488; / sqrt(d&#7424;)) V
      </MathFormula>

      <ExplanationBox title="Breaking Down the Formula Term by Term">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Q K&#7488;</strong> — matrix multiply Q (shape n x d&#7424;) by K transposed (shape d&#7424; x n).
            The result is an n x n matrix of raw dot-product scores. Entry (i, j) measures how
            well token i&apos;s query aligns with token j&apos;s key — a large positive score means
            &quot;token i should attend strongly to token j.&quot;
          </li>
          <li>
            <strong>/ sqrt(d&#7424;)</strong> — we divide every score by the square root of the head
            dimension. Without this, when d&#7424; is large (e.g. 64), dot products grow proportionally
            to d&#7424; in magnitude, pushing the softmax into regions where gradients vanish.
            Dividing by sqrt(d&#7424;) keeps the variance of the dot products roughly constant at 1,
            regardless of d&#7424;.
          </li>
          <li>
            <strong>softmax(...)</strong> — applied row-wise, this converts each row of raw scores
            into a probability distribution summing to 1. Row i now says: &quot;token i distributes
            its attention across all tokens in these proportions.&quot;
          </li>
          <li>
            <strong>V</strong> — finally, multiply the attention weights (n x n) by V (n x d&#7424;).
            Each output row is a weighted average of all value vectors. Tokens the query scored
            highly contribute more to the output.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Worked Attention: 3 Tokens, d&#7424; = 2">
        <p>
          Let&apos;s trace attention for three tokens from our sentence:
          token 0 = &quot;cat&quot;, token 1 = &quot;sat&quot;, token 2 = &quot;mat&quot;.
          We use a tiny head dimension d&#7424; = 2 so the numbers stay readable.
          Assume (after projection) we have:
        </p>
        <CalcStep number={1}>
          Q = [[1, 0], [0, 1], [1, 1]] &nbsp; (rows: cat, sat, mat queries)
        </CalcStep>
        <CalcStep number={2}>
          K = [[1, 0], [0, 1], [1, 1]] &nbsp; (rows: cat, sat, mat keys)
        </CalcStep>
        <CalcStep number={3}>
          V = [[2, 0], [0, 2], [1, 1]] &nbsp; (rows: cat, sat, mat values)
        </CalcStep>
        <CalcStep number={4}>
          Compute Q K&#7488; (raw scores). Row 1 (&quot;sat&quot; query [0,1]):
          dot with cat key [1,0] = 0, dot with sat key [0,1] = 1, dot with mat key [1,1] = 1.
          Raw scores for sat: [0, 1, 1].
        </CalcStep>
        <CalcStep number={5}>
          Scale by 1/sqrt(2) = 0.707: scaled scores for sat = [0, 0.707, 0.707].
        </CalcStep>
        <CalcStep number={6}>
          softmax([0, 0.707, 0.707]): exp values = [1.000, 2.028, 2.028], sum = 5.056.
          Weights = [0.198, 0.401, 0.401].
        </CalcStep>
        <CalcStep number={7}>
          Weighted sum of V rows: 0.198*[2,0] + 0.401*[0,2] + 0.401*[1,1]
          = [0.396, 0] + [0, 0.802] + [0.401, 0.401] = [0.797, 1.203].
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The output vector [0.797, 1.203] for &quot;sat&quot; blends mostly information from
          &quot;sat&quot; itself and &quot;mat&quot; equally, with a small contribution from
          &quot;cat.&quot; &quot;Cat&quot; scored zero because its key [1,0] is orthogonal to
          &quot;sat&apos;s&quot; query [0,1] — a clear illustration of how query-key alignment
          controls information flow.
        </p>
      </WorkedExample>
    </div>
  );
}
