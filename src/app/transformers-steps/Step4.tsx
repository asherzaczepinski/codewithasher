'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Problem with a Single Attention Head">
        <p>
          Single-head attention learns one way of routing information: one set of Q, K, V weight
          matrices producing one pattern of attention weights. But language is layered. In the sentence
          &quot;the cat sat on the mat,&quot; the word &quot;sat&quot; might simultaneously need to
          track its syntactic subject (&quot;cat&quot;), its location (&quot;mat&quot;), and the
          article that preceded it (&quot;the&quot;). A single attention head must compress all of
          that into one pattern, which limits its expressiveness.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Multi-Head Attention">
        <p>
          The solution is to run <strong>h independent attention heads in parallel</strong>, each
          with its own W&#x1D410;, W&#x1D40A;, W&#x1D415; matrices. Each head is given a smaller
          dimension d&#7424; = d / h, so the total computation stays roughly the same as a single
          full-dimension head.
        </p>
        <p>
          Each head can specialize in a different type of relationship: one head may learn syntactic
          dependencies, another semantic similarity, another coreference. After running all heads,
          we concatenate their outputs (restoring the original dimension d) and project with a
          final weight matrix W&#x1D4C6;:
        </p>
      </ExplanationBox>

      <MathFormula label="Multi-head attention">
        MultiHead(Q, K, V) = Concat(head&#8321;, ..., head&#8341;) W&#x1D4C6;
      </MathFormula>
      <MathFormula label="Each individual head">
        head&#7522; = Attention(Q W&#x1D410;&#7522;, K W&#x1D40A;&#7522;, V W&#x1D415;&#7522;)
      </MathFormula>

      <ExplanationBox title="Parameter Count">
        <p>
          For a model with d = 512 and h = 8 heads, each head operates in a d&#7424; = 64 dimensional
          space. The eight W&#x1D410;&#7522; matrices total 8 x (512 x 64) = 262,144 parameters — the same
          as a single 512 x 512 matrix. The concatenation output has dimension 8 x 64 = 512, and W&#x1D4C6;
          projects it back to 512. So multi-head attention uses roughly 4x d&#178; parameters in total
          (for Q, K, V projections and the output projection).
        </p>
      </ExplanationBox>

      <WorkedExample title="Multi-Head Intuition: 2 Heads on &apos;sat&apos;">
        <p>
          Suppose head 1 learns to attend to the grammatical subject and head 2 learns to attend
          to the location:
        </p>
        <CalcStep number={1}>Head 1 output for &quot;sat&quot;: strongly attends to &quot;cat&quot; (subject). Output captures &quot;cat&quot;-like features.</CalcStep>
        <CalcStep number={2}>Head 2 output for &quot;sat&quot;: strongly attends to &quot;mat&quot; (location). Output captures &quot;mat&quot;-like features.</CalcStep>
        <CalcStep number={3}>Concatenate: [head1_out | head2_out] — a vector twice as wide, carrying both relationships.</CalcStep>
        <CalcStep number={4}>Multiply by W&#x1D4C6;: project back to d dimensions. The model can mix and weight the two heads&apos; signals however is most useful.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The final representation of &quot;sat&quot; now knows who performed the action and where
          it happened — two distinct contextual facts encoded in a single vector.
        </p>
      </WorkedExample>

      <ExplanationBox title="Attention Masks">
        <p>
          Attention is unrestricted by default: every token can attend to every other token. But there
          are two situations where we need to block certain attention paths:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Padding mask.</strong> When training on batches of variable-length sequences, we
            pad shorter sequences with a special [PAD] token. We mask out those positions so they
            contribute zero to attention, preventing the model from treating padding as real content.
          </li>
          <li>
            <strong>Causal mask (look-ahead mask).</strong> When generating text autoregressively,
            position i must not see positions i+1, i+2, ... (the future). We enforce this by setting
            the corresponding attention scores to negative infinity before the softmax, making their
            weights exactly zero after softmax.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Causal masking (applied before softmax)">
        score(i, j) = -infinity &nbsp; if j greater than i &nbsp; (future token)
      </MathFormula>

      <ExplanationBox title="Causal Masking on Our Sentence">
        <p>
          When generating &quot;sat&quot; (position 2) autoregressively, the model has already
          produced &quot;the&quot; (0) and &quot;cat&quot; (1). The attention matrix row for
          position 2 can look at positions 0 and 1, but positions 3, 4, 5 (&quot;on&quot;,
          &quot;the&quot;, &quot;mat&quot;) are masked to negative infinity — they don&apos;t
          exist yet. This ensures the model cannot cheat by peeking at future tokens during training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Cross-Attention in the Encoder-Decoder">
        <p>
          In encoder-decoder transformers (used for translation and summarization), the decoder
          contains a special <strong>cross-attention</strong> layer. Here, the queries come from
          the decoder&apos;s own token representations, but the keys and values come from the
          encoder&apos;s output.
        </p>
        <p>
          For translating &quot;the cat sat on the mat&quot; into French, each French decoder
          token asks (via its query): &quot;which English encoder states are most relevant for
          generating me?&quot; The encoder key-value pairs provide the English context; the
          decoder queries pull out what they need. This is the same scaled dot-product attention
          formula as before — only the source of Q versus K and V differs.
        </p>
      </ExplanationBox>
    </div>
  );
}
