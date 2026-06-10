'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="When Directions Don&apos;t Make Sense">
        <p>
          Bayesian networks use directed edges — they say &quot;X causes Y.&quot; But many real-world
          relationships are symmetric. In a grid of pixels, neighboring pixels are correlated with
          each other; no single pixel causes its neighbor. In a social network, friendship is
          mutual. In a sentence, each word constrains its neighbors in both directions.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Markov Random Fields (MRFs)</strong> — also called undirected graphical models
          or Markov networks — represent these symmetric relationships naturally. Instead of
          conditional probability tables over children given parents, MRFs use{' '}
          <strong>potential functions</strong> over cliques.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Cliques and Potentials">
        <p>
          A <strong>clique</strong> in an undirected graph is a fully connected subset of nodes.
          An MRF defines a non-negative <strong>potential function</strong> (also called a factor)
          over each clique. The potential encodes how compatible different joint configurations of
          those variables are — high potential means the configuration is preferred; low potential
          means it is unlikely.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The joint distribution is then proportional to the product of all clique potentials:
        </p>
      </ExplanationBox>

      <MathFormula label="MRF Joint Distribution">
        P(X) = (1 / Z) &times; &prod;(c &isin; cliques) &psi;(c)(Xc)
      </MathFormula>

      <ExplanationBox title="The Partition Function">
        <p>
          The term Z in the denominator is the <strong>partition function</strong> — the sum (or
          integral) of the numerator over all possible configurations. It ensures the distribution
          sums to 1:
        </p>
      </ExplanationBox>

      <MathFormula label="Partition Function">
        Z = &sum;(all X) &prod;(c) &psi;(c)(Xc)
      </MathFormula>

      <ExplanationBox title="The Critical Challenge: Computing Z">
        <p>
          Computing Z requires summing over all configurations. For n binary variables that is 2^n
          terms — exponentially many. This is what makes exact inference in large MRFs intractable,
          and motivates the approximate inference methods in Part 2 of this course.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Directed vs Undirected: Key Differences">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Bayesian networks</strong> normalize locally — each conditional P(Xi | pa(Xi))
            sums to 1 on its own. There is no partition function.
          </li>
          <li>
            <strong>MRFs</strong> require a global normalizing constant Z. This makes them harder
            to train and perform inference in, but easier to define symmetric relationships.
          </li>
          <li>
            Bayesian networks naturally encode causality and generative processes. MRFs naturally
            encode soft constraints and compatibility between neighbors.
          </li>
          <li>
            Every directed model can be converted to an undirected one (by moralizing the graph),
            but the converse is not always possible without introducing additional structure.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Conditional Random Fields">
        <p>
          A <strong>Conditional Random Field (CRF)</strong> is an undirected model that conditions
          on observed inputs X and models the output distribution P(Y | X). Unlike a generative
          MRF that models P(X, Y), a CRF is discriminative — it never has to model the (often
          complex) distribution of X.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          CRFs shine in <strong>structured prediction</strong>: tasks where the output Y is itself
          a structured object such as a sequence of labels. The canonical example is{' '}
          <strong>named entity recognition</strong>: given a sentence (X), label each word as
          person, organization, location, or other (Y). The words interact: if the previous word
          is labeled person, the next word is more likely to also be person.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A linear-chain CRF defines potentials over adjacent label pairs and over each
          (word, label) pair. Efficient inference with the forward-backward algorithm runs in
          O(n &times; |Y|^2) time — polynomial, not exponential.
        </p>
      </ExplanationBox>

      <WorkedExample title="A Two-Node MRF Potential">
        <p>
          Two weather stations observe neighboring regions. Let X1 and X2 each be sunny (1) or
          rainy (0). We define a single clique potential over the pair (X1, X2) that prefers
          neighbors to agree:
        </p>

        <CalcStep number={1}>
          Define the potential: &psi;(X1, X2) = 10 if X1 = X2, else 1.
        </CalcStep>
        <CalcStep number={2}>
          List all configurations and unnormalized scores:
          (1,1) &rarr; 10, (0,0) &rarr; 10, (1,0) &rarr; 1, (0,1) &rarr; 1.
        </CalcStep>
        <CalcStep number={3}>
          Compute Z = 10 + 10 + 1 + 1 = 22.
        </CalcStep>
        <CalcStep number={4}>
          Normalize: P(X1=1, X2=1) = 10/22 &approx; 0.455. P(X1=1, X2=0) = 1/22 &approx; 0.045.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The potential strongly encourages agreement. Disagreement configurations are ten times
          less likely than agreement configurations. This is the essence of MRF modeling: use
          potentials to encode soft preferences, then normalize to get a valid distribution.
        </p>
      </WorkedExample>
    </div>
  );
}
