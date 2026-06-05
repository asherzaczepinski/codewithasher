'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="A Game With Two Players">
        <p>
          The interaction between G and D is formally a <strong>two-player minimax game</strong>.
          In game theory, a minimax game is one where one player tries to maximise a value
          function while the other tries to minimise it — they have perfectly opposite interests
          over the same score.
        </p>
        <p>
          D wants to <em>maximise</em> the value function V: it wants high scores for real images
          and low scores for fakes. G wants to <em>minimise</em> the same V: it wants its fakes
          to score high (fooling D), which reduces V from D&apos;s perspective.
        </p>
      </ExplanationBox>

      <MathFormula label="GAN minimax objective">
        {`V(G, D) = E[log D(x)] + E[log(1 − D(G(z)))]`}
      </MathFormula>

      <ExplanationBox title="Reading the Objective Term by Term">
        <p>
          The value function has two expectations (averages over many samples):
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>E[log D(x)]</strong> — average log-probability that D assigns &quot;real&quot;
            to actual real images x from the training set. When D is perfect on real data this
            term equals 0 (log 1 = 0). When D is confused it becomes very negative (log of a
            small number). D wants this term large → close to 0.
          </li>
          <li>
            <strong>E[log(1 − D(G(z)))]</strong> — average log-probability that D assigns
            &quot;fake&quot; to G&apos;s outputs. When D correctly calls every fake a fake,
            D(G(z)) ≈ 0 so log(1 − 0) = log 1 = 0 again. When G fools D perfectly,
            D(G(z)) ≈ 1 so log(1 − 1) → −∞. D wants this term large (close to 0); G wants
            it as small (as negative) as possible.
          </li>
        </ul>
        <p>
          Put together: <strong>D maximises V, G minimises V</strong>. Both are using gradient
          steps on the same equation but pulling in opposite directions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Equilibrium: When Fakes Are Indistinguishable">
        <p>
          Goodfellow proved that the theoretical equilibrium of this game — the point where
          neither player can improve — is reached when the Generator has learned the true
          data distribution exactly. At that point every fake is statistically identical to a
          real image, so the best D can possibly do is guess randomly.
        </p>
        <p>
          At equilibrium: <strong>D(x) = 0.5 for every image x</strong>, real or fake.
          The detective can do no better than flipping a coin. When you train a GAN and see D
          hovering near 0.5, that is a sign that G has learned something meaningful — D has
          genuinely been fooled, not just confused by a poorly trained network.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Intuition: The Counterfeiter Gets Feedback">
        <p>
          Think about what gradient descent looks like for each player in our face example:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            G produces a blurry, smeared face. D easily scores it near 0. The gradient flowing
            back into G says: &quot;everything about this output screamed fake — change it.&quot;
            G adjusts its weights to produce sharper edges and more coherent structure.
          </li>
          <li>
            D sees G&apos;s improved output and is sometimes tricked. Its gradient says:
            &quot;you missed some subtle tells — pay attention to skin texture and eye symmetry.&quot;
            D adjusts to catch those patterns.
          </li>
        </ul>
        <p>
          Over thousands of iterations, this back-and-forth pushes G toward images that are
          realistic along every dimension D has learned to inspect — which, ideally, is every
          dimension that matters.
        </p>
      </ExplanationBox>
    </div>
  );
}
