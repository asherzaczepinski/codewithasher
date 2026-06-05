'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Problem: Multiple Words">
        <p>
          Real emails contain many words, not just one. We need to compute
          P(word₁ and word₂ and word₃ | class) — the joint probability that
          all these words appear together, given the class.
        </p>
        <p>
          In principle, estimating this joint probability would require seeing every
          possible combination of words in the training data. With a vocabulary of
          50,000 words you would need an astronomically large training set — far more
          emails than exist in the world.
        </p>
      </ExplanationBox>

      <ExplanationBox title='The &quot;Naive&quot; Assumption: Conditional Independence'>
        <p>
          Naive Bayes escapes this explosion with one bold assumption: the words are
          <strong> conditionally independent</strong> given the class. That means, once you
          know the class label, knowing one word tells you nothing extra about the
          probability of another word appearing.
        </p>
        <p>
          Under this assumption, the joint likelihood factors into a simple product:
        </p>
      </ExplanationBox>

      <MathFormula label="The Naive Assumption">
        P(w₁, w₂, …, wₙ | class) = P(w₁ | class) × P(w₂ | class) × … × P(wₙ | class)
      </MathFormula>

      <ExplanationBox title="Why It Is Naive">
        <p>
          The assumption is plainly unrealistic. In spam emails, words like <em>free</em> and
          <em> offer</em> tend to co-occur far more than chance would predict — they are
          correlated. Treating them as independent ignores that relationship.
        </p>
        <p>
          Likewise, in ham emails the pair <em>meeting</em> and <em>agenda</em> appear together
          often. Assuming independence underestimates that joint probability.
        </p>
        <p>
          Despite this, the classifier makes the <strong>right ranking decision</strong> most
          of the time. The errors in the individual probabilities partially cancel out, and the
          class with the genuinely higher score tends to win regardless.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why It Makes the Math Tractable">
        <p>
          With the naive assumption, we only need to estimate one number per word per class —
          P(word | class) — from the training data. That is just a frequency count: how often
          does this word appear in emails of this class?
        </p>
        <p>
          For a 50,000-word vocabulary and 2 classes, that is 100,000 numbers. Without the
          assumption, the joint space would require billions of numbers that could never be
          reliably estimated from realistic training data.
        </p>
        <p>
          The naive assumption transforms an intractable problem into a loop of simple
          multiplications.
        </p>
      </ExplanationBox>

      <WorkedExample title="Factoring the Likelihood for Two Words">
        <p>
          An email contains both &quot;free&quot; and &quot;winner.&quot; Using our training table (40 spam, 60 ham):
        </p>
        <CalcStep number={1}>P(&quot;free&quot; | spam) = 32/40 = 0.800</CalcStep>
        <CalcStep number={2}>P(&quot;winner&quot; | spam) = 28/40 = 0.700</CalcStep>
        <CalcStep number={3}>Joint likelihood for spam ≈ 0.800 × 0.700 = 0.560</CalcStep>
        <CalcStep number={4}>P(&quot;free&quot; | ham) = 4/60 ≈ 0.0667</CalcStep>
        <CalcStep number={5}>P(&quot;winner&quot; | ham) = 1/60 ≈ 0.0167</CalcStep>
        <CalcStep number={6}>Joint likelihood for ham ≈ 0.0667 × 0.0167 ≈ 0.00111</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The spam joint likelihood (0.560) is over 500 times larger than the ham joint
          likelihood (0.00111). Each additional damning word makes the gap even more extreme —
          which is exactly the behaviour we want from a spam filter.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The <code>train()</code> function scans the dataset once and records, for each word and
          each class, how many emails contained that word. Dividing by the class size gives
          P(word | class) — the likelihood table.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="naive_bayes.py"
        caption="train() builds a per-class likelihood table by counting word occurrences."
        code={`# --- continued from Step 3 ---
# We store all per-word likelihoods in a nested dict:
#   word_likelihoods[class_label][word] = P(word | class)
# This is the core data structure the classifier will read at prediction time.

def train(dataset):
    # Separate the emails by class so we can count within each class.
    spam_emails = [words for words, label in dataset if label == "spam"]
    ham_emails  = [words for words, label in dataset if label == "ham"]

    # Count how many emails in each class contain each word.
    # We use a simple binary presence check: does the word appear at all?
    # (This is Bernoulli Naive Bayes — presence, not frequency.)
    def count_words(emails):
        counts = {}
        for words in emails:
            for word in set(words):  # set() removes duplicates within one email
                counts[word] = counts.get(word, 0) + 1
        return counts

    spam_counts = count_words(spam_emails)
    ham_counts  = count_words(ham_emails)

    # Divide raw counts by class size to get P(word | class).
    # These are the LIKELIHOODS — what the naive assumption lets us multiply together.
    n_spam = len(spam_emails)
    n_ham  = len(ham_emails)

    spam_likelihoods = {word: count / n_spam for word, count in spam_counts.items()}
    ham_likelihoods  = {word: count / n_ham  for word, count in ham_counts.items()}

    # Package everything the predictor will need.
    return {
        "spam": spam_likelihoods,
        "ham":  ham_likelihoods,
        "p_spam": n_spam / (n_spam + n_ham),  # prior stored alongside likelihoods
        "p_ham":  n_ham  / (n_spam + n_ham),
        "n_spam": n_spam,
        "n_ham":  n_ham,
    }

# Train on our tiny dataset from Step 3.
model = train(dataset)

# Sanity-check: P("free" | spam) should be 3/3 = 1.0 on our 7-email set.
print(f'P(free | spam) = {model["spam"].get("free", 0):.3f}')
print(f'P(free | ham)  = {model["ham"].get("free",  0):.3f}')`}
      />
    </div>
  );
}
