'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Why SFT Is Not Enough">
        <p>
          After SFT our model follows instructions — but &quot;following instructions&quot; is
          not the same as being <em>aligned with human values</em>. A model could follow the
          instruction &quot;write a persuasive essay arguing that vaccines cause autism&quot;
          perfectly and still be producing harm.
        </p>
        <p>
          More subtly, two responses to the same question might both be technically correct,
          but one might be more helpful, clearer, or safer. SFT cannot easily distinguish
          between them because it trains the model to imitate a single &quot;gold&quot; response.
          Human preference, by contrast, is comparative — raters can reliably say &quot;response
          A is better than response B&quot; even when it&apos;s hard to write the perfect response
          from scratch.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reinforcement Learning from Human Feedback (RLHF)">
        <p>
          RLHF, introduced to LLMs by InstructGPT (Ouyang et al., 2022), solves this with a
          two-stage process:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Stage 1 — Train a Reward Model:</strong> Human raters compare pairs of
            model responses to the same prompt and indicate which they prefer. A separate
            neural network (the reward model) is trained to predict these preferences. It
            learns to assign a scalar &quot;reward&quot; score to any (prompt, response) pair.
          </li>
          <li>
            <strong>Stage 2 — Policy Optimization:</strong> The SFT model (now called the
            &quot;policy&quot;) is further trained using reinforcement learning — typically
            Proximal Policy Optimization (PPO) — to generate responses that maximize the
            reward model&apos;s score. A KL-divergence penalty keeps the policy from drifting
            too far from the SFT model, preventing reward hacking.
          </li>
        </ul>
        <p>
          The result is a model whose outputs human raters consistently prefer — one that is
          more helpful, more honest, and less likely to produce harmful content.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Direct Preference Optimization (DPO)">
        <p>
          RLHF is powerful but complex: it requires training and maintaining a reward model
          separately, and running RL in a large language model is notoriously unstable.
          <strong> Direct Preference Optimization (DPO)</strong>, introduced in 2023 by Rafailov
          et al., is a mathematically equivalent alternative that skips the reward model entirely.
        </p>
        <p>
          DPO works directly on the preference dataset — pairs of (prompt, chosen response,
          rejected response). It directly increases the relative probability of the chosen
          response over the rejected response using a classification-style loss, without
          needing a separate reward model or an RL loop.
        </p>
        <p>
          Because DPO is simpler to implement and more stable to train, it has become the
          default alignment technique for many open-source models. RLHF is still used by
          frontier labs where fine-grained reward shaping matters.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Refusal Behavior and Safety">
        <p>
          One concrete output of alignment training is <strong>refusal behavior</strong>:
          the ability of the model to decline requests that violate safety guidelines —
          &quot;I&apos;m not able to help with that&quot; — rather than complying or
          producing harmful content.
        </p>
        <p>
          Refusals are trained in via preference data: for harmful prompts, human raters
          prefer the safe refusal over a complying response, so the reward model learns to
          score refusals higher. The policy then learns to produce refusals.
        </p>
        <p>
          Getting refusal behavior right is genuinely difficult. Too little alignment and the
          model is dangerous; too much and it refuses legitimate requests (&quot;over-refusal&quot;),
          frustrating users. Frontier labs iterate constantly on this balance using a mix of
          red-teaming, evaluation suites, and user feedback.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Three Hs of Alignment">
        <p>
          Anthropic&apos;s framing summarizes alignment goals as <strong>Helpful, Harmless,
          and Honest</strong> — often abbreviated HHH. A well-aligned model:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Helpful:</strong> Follows instructions, answers questions accurately,
          completes tasks effectively.</li>
          <li><strong>Harmless:</strong> Refuses to assist with illegal or dangerous activities;
          avoids producing biased or toxic content.</li>
          <li><strong>Honest:</strong> Acknowledges uncertainty, does not fabricate information,
          corrects misunderstandings.</li>
        </ul>
        <p>
          These goals can conflict. A fully helpful model might assist with anything asked.
          A fully harmless model might refuse almost everything. Alignment research is largely
          the art of navigating this tension thoughtfully.
        </p>
      </ExplanationBox>
    </div>
  );
}
