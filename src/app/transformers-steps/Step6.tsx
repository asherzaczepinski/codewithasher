'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Three Architectural Flavors">
        <p>
          The transformer block from the previous module is a building block. How you assemble these
          blocks — and what task you train on — determines whether you get an encoder, a decoder,
          or an encoder-decoder model. Each design has a different strength, and real-world models
          are almost universally one of these three types.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Encoder-Only: BERT and Masked Language Modeling">
        <p>
          An encoder processes the entire input sequence with <strong>full bidirectional attention</strong>:
          every token can attend to every other token in both directions. There is no causal mask.
          This makes encoders excellent at understanding text — they produce rich contextual
          representations of an input.
        </p>
        <p>
          BERT (Bidirectional Encoder Representations from Transformers) is trained with
          <strong> Masked Language Modeling (MLM)</strong>: roughly 15% of tokens are randomly
          replaced with a [MASK] token, and the model must predict the original token from context
          on both sides. Because predicting a masked word requires reading the surrounding words
          in both directions, the model is forced to learn deep bidirectional representations.
        </p>
        <p>
          Encoders are ideal for: sentence classification, named entity recognition, question
          answering (extractive), and embedding generation. They are not naturally suited to
          open-ended text generation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Decoder-Only: GPT and Autoregressive Generation">
        <p>
          A decoder uses <strong>causal (unidirectional) attention</strong>: each token can only
          attend to itself and earlier tokens. This makes decoders ideal for generation — they
          produce one token at a time, conditioning each new token on all previously generated tokens.
        </p>
        <p>
          GPT models are trained with <strong>next-token prediction</strong> (also called causal
          language modeling): given tokens 1 through t, predict token t+1. This objective applies
          simultaneously to every position in the sequence during training, which is efficient —
          a single forward pass provides n training signals for a sequence of length n.
        </p>
        <p>
          Decoders are ideal for: open-ended text generation, code generation, dialogue, and any
          task framed as completing or continuing a prompt. With instruction fine-tuning, they
          also excel at following instructions and answering questions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Encoder-Decoder: T5 and Sequence-to-Sequence Tasks">
        <p>
          An encoder-decoder model uses a full encoder to process the input and a causal decoder
          to generate the output, connected by cross-attention (covered in the previous module).
          The encoder builds a rich bidirectional representation of the source; the decoder
          generates the target token by token, attending to the source representation via
          cross-attention.
        </p>
        <p>
          T5 (Text-to-Text Transfer Transformer) frames every NLP task as a text-to-text problem:
          &quot;translate English to French: the cat sat on the mat&quot; as input, output is
          the French translation. This architecture is natural for machine translation, summarization,
          and any task with a distinct input and output sequence.
        </p>
      </ExplanationBox>

      <MathFormula label="Autoregressive generation (probability decomposition)">
        P(w&#8321;, w&#8322;, ..., w&#x1D40F;) = product over t of P(w&#x1D40F; | w&#8321;, ..., w&#x1D40F;&#8331;&#8321;)
      </MathFormula>

      <ExplanationBox title="How Autoregressive Generation Works Step by Step">
        <p>
          Generation from a decoder is a loop. At each step t, the model:
        </p>
        <ol style={{ lineHeight: '1.9' }}>
          <li>Takes the current sequence of tokens (prompt + already-generated tokens) as input.</li>
          <li>Runs the full forward pass (embeddings + positional encoding + N transformer blocks).</li>
          <li>At the final block, reads the output vector at position t.</li>
          <li>Multiplies by the unembedding matrix (shape d x vocabulary size) to get logits — one score per vocabulary item.</li>
          <li>Applies softmax to get a probability distribution over the next token.</li>
          <li>Samples (or takes the argmax) to select the next token.</li>
          <li>Appends that token to the sequence and repeats from step 1.</li>
        </ol>
        <p>
          The model stops when it generates a special [EOS] (end-of-sequence) token or hits a
          maximum length limit.
        </p>
      </ExplanationBox>

      <WorkedExample title="Generating the Next Token After &apos;the cat sat&apos;">
        <p>
          The decoder has already generated [&quot;the&quot;, &quot;cat&quot;, &quot;sat&quot;].
          Now it generates position 3.
        </p>
        <CalcStep number={1}>Input sequence so far: [1, 482, 891] (token IDs for &quot;the&quot;, &quot;cat&quot;, &quot;sat&quot;).</CalcStep>
        <CalcStep number={2}>Embed each token and add positional encodings: three vectors of dimension d.</CalcStep>
        <CalcStep number={3}>Pass through N transformer blocks with causal masking. Position 2 (&quot;sat&quot;) can attend to positions 0 and 1, but not future positions.</CalcStep>
        <CalcStep number={4}>Take the output vector at position 2 (the last position). Multiply by the unembedding matrix to get logits over ~50,000 vocabulary items.</CalcStep>
        <CalcStep number={5}>Top logits (after softmax): P(&quot;on&quot;) = 0.38, P(&quot;down&quot;) = 0.12, P(&quot;by&quot;) = 0.09, ... The model strongly prefers &quot;on&quot; given the context.</CalcStep>
        <CalcStep number={6}>Sample or argmax: select &quot;on&quot; (ID = 17). Append to sequence: [1, 482, 891, 17].</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The process repeats to generate &quot;the&quot;, then &quot;mat&quot;, then [EOS].
          The full generated sentence &quot;the cat sat on the mat&quot; emerges one token at a time.
        </p>
      </WorkedExample>

    </div>
  );
}
