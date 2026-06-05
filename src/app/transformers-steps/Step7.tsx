'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The O(n&#178;) Problem">
        <p>
          Scaled dot-product attention computes a score between every pair of tokens. For a sequence
          of n tokens, that is n x n = n&#178; scores, both in time and in memory. For our sentence
          &quot;the cat sat on the mat&quot; (n = 6), n&#178; = 36 — trivial. But for a document with
          n = 4,096 tokens, n&#178; = 16,777,216. For n = 100,000, n&#178; approaches 10 billion —
          far beyond the memory of any single GPU.
        </p>
        <p>
          This quadratic bottleneck is the central obstacle to long-context transformers. The
          research community has attacked it from several angles, each making a different trade-off
          between exactness, speed, and memory.
        </p>
      </ExplanationBox>

      <MathFormula label="Standard attention complexity">
        Time: O(n&#178; d) &nbsp;&nbsp;&nbsp; Memory: O(n&#178;)
      </MathFormula>

      <ExplanationBox title="The KV Cache: Speeding Up Generation">
        <p>
          Autoregressive generation runs the full transformer N times to generate N tokens —
          once per token. Without optimization, each forward pass recomputes the keys and values
          for all previous tokens from scratch. This is wasteful because those keys and values
          do not change once a token has been processed.
        </p>
        <p>
          The <strong>KV cache</strong> solves this by storing the key and value tensors from
          every previous step in memory. On step t, the model only computes K&#x1D40F; and V&#x1D40F; for
          the new token, appends them to the cached K and V tensors, and runs attention. This
          reduces per-step computation from O(t) to O(1) for the new token&apos;s projections,
          with only the attention itself scaling as O(t) (attending to the cached history).
        </p>
        <p>
          The trade-off: the KV cache consumes GPU memory proportional to n x d x 2 x N (two
          tensors per layer, N layers). For long contexts, KV cache memory can exceed model
          parameter memory. This is why memory-efficient KV variants matter.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Multi-Query Attention (MQA) and Grouped-Query Attention (GQA)">
        <p>
          In standard multi-head attention, each of the h heads has its own K and V projections —
          so the KV cache grows by a factor of h. <strong>Multi-Query Attention (MQA)</strong>
          uses a single shared K and V across all heads while keeping separate Q projections.
          This shrinks the KV cache by a factor of h, enabling much longer contexts or larger
          batch sizes at inference time.
        </p>
        <p>
          <strong>Grouped-Query Attention (GQA)</strong> is a middle ground: g groups of heads
          share a K and V (g divides h). GQA retains most of MQA&apos;s memory savings while
          recovering some of multi-head attention&apos;s expressiveness. LLaMA 2 and Mistral use GQA.
        </p>
      </ExplanationBox>

      <MathFormula label="KV cache memory (standard MHA)">
        Memory = 2 x h x d&#7424; x n x N x bytes_per_float
      </MathFormula>
      <MathFormula label="KV cache memory (MQA, 1 KV head)">
        Memory = 2 x 1 x d&#7424; x n x N x bytes_per_float
      </MathFormula>

      <ExplanationBox title="FlashAttention: IO-Aware Exact Attention">
        <p>
          FlashAttention (Dao et al., 2022) does not approximate attention — it computes the
          exact same result as standard attention, but dramatically faster and with less memory.
          The key insight is that the bottleneck is not arithmetic but <strong>memory bandwidth</strong>:
          moving the n x n attention matrix between GPU HBM (main memory) and the fast SRAM cache
          is the expensive step.
        </p>
        <p>
          FlashAttention tiles the Q, K, V matrices into small blocks that fit in SRAM, computes
          attention block by block using the online softmax algorithm (which never materializes the
          full n x n matrix), and accumulates the result directly. This reduces HBM reads/writes
          from O(n&#178;) to O(n), giving 2-4x wall-clock speedups on realistic sequences and reducing
          memory from O(n&#178;) to O(n).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Sparse and Linear Attention Patterns">
        <p>
          For truly massive contexts, some architectures further restrict which pairs of tokens
          can attend to each other:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Sparse attention (Longformer, BigBird).</strong> Each token attends only to a
            local window of nearby tokens plus a small set of global tokens (like [CLS]). This
            brings complexity down to O(n) while preserving local context and a few global summary
            signals.
          </li>
          <li>
            <strong>Linear attention.</strong> By replacing softmax with a kernel approximation
            (e.g. feature maps phi such that softmax(QK&#7488;) ≈ phi(Q) phi(K)&#7488;), the computation
            can be restructured to O(n) using matrix associativity. Quality degrades somewhat
            compared to exact attention.
          </li>
          <li>
            <strong>Sliding window attention (Mistral).</strong> Each token attends only to a fixed
            window of the last w tokens. Combined with GQA and other tricks, Mistral achieves
            excellent quality at very low inference cost.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="KV Cache in Action: Generating &apos;the cat sat on the mat&apos;">
        <p>
          We trace KV cache usage as the decoder generates our six tokens, one at a time:
        </p>
        <CalcStep number={1}>Generate &quot;the&quot; (step 1): compute K&#8321;, V&#8321; for position 0. Cache = [(K&#8321;, V&#8321;)]. Run attention over 1 token.</CalcStep>
        <CalcStep number={2}>Generate &quot;cat&quot; (step 2): compute K&#8322;, V&#8322; for position 1 only. Append to cache = [(K&#8321;,V&#8321;),(K&#8322;,V&#8322;)]. Attention over 2 tokens.</CalcStep>
        <CalcStep number={3}>Generate &quot;sat&quot; (step 3): cache grows to 3 entries. Only K&#8323;, V&#8323; for &quot;cat&quot; is new. All Q, K, V for past tokens reused from cache.</CalcStep>
        <CalcStep number={4}>By step 6 (&quot;mat&quot;): cache holds 5 (K, V) pairs. Only new projections computed: K&#8326;, V&#8326;. Total new projection work: O(1) per step instead of O(t).</CalcStep>
        <CalcStep number={5}>Memory used by cache: 2 x N_layers x 5 x d_head x h vectors — e.g. for N=12, h=8, d_head=64: 2 x 12 x 5 x 64 x 8 = 61,440 floats ≈ 240 KB at fp32. For n=100,000 that scales to ~4.8 GB per layer.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The KV cache makes generation fast; KV memory is the price. MQA and GQA reduce that
          price without sacrificing generation speed.
        </p>
      </WorkedExample>
    </div>
  );
}
