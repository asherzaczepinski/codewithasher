'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="From Words to Numbers">
        <p>
          Our product-review dataset is a collection of raw strings. A model cannot consume
          strings directly — we need to convert each review into a fixed-length vector of numbers.
          This module covers the three main ways to do that: bag of words, n-grams, and TF-IDF.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Bag of Words">
        <p>
          The simplest approach is <strong>bag of words (BoW)</strong>. First, build a
          vocabulary: the set of every unique word that appears in the training corpus. Then
          represent each document as a vector whose i-th entry is the count of vocabulary word i
          in that document.
        </p>
        <p>
          For example, if the vocabulary is (great, battery, terrible, product, fast) and a
          review says &quot;great battery, great product&quot;, the vector is (2, 1, 0, 1, 0).
        </p>
        <p>
          <strong>Limitations:</strong> BoW ignores word order entirely — &quot;not great&quot;
          and &quot;great not&quot; produce the same vector. It also over-weights common words
          like &quot;the&quot; and &quot;is&quot; that appear everywhere and carry no sentiment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="N-Grams">
        <p>
          An <strong>n-gram</strong> is a contiguous sequence of n words. Instead of treating
          each word independently, you add phrases to the vocabulary:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Unigrams (n=1):</strong> &quot;not&quot;, &quot;great&quot;</li>
          <li><strong>Bigrams (n=2):</strong> &quot;not great&quot;, &quot;battery life&quot;</li>
          <li><strong>Trigrams (n=3):</strong> &quot;best battery life&quot;</li>
        </ul>
        <p>
          Adding bigrams lets the model distinguish &quot;not great&quot; from &quot;great&quot;,
          capturing negation. The trade-off is a larger vocabulary — a 10,000-word vocabulary
          yields up to 100 million possible bigrams, most of which never appear. In practice you
          keep only bigrams that appear at least a minimum number of times (min_df) to keep the
          matrix manageable.
        </p>
      </ExplanationBox>

      <ExplanationBox title="TF-IDF: Rewarding Rare, Informative Words">
        <p>
          <strong>TF-IDF</strong> (Term Frequency &ndash; Inverse Document Frequency) addresses
          the over-weighting problem by discounting words that appear in nearly every document
          (which carry little discriminating power) and up-weighting words that are frequent in
          one document but rare across the corpus.
        </p>
        <p>
          The score for word w in document d is the product of two terms:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>TF(w, d)</strong> — how often w appears in d, divided by the total word
            count in d.
          </li>
          <li>
            <strong>IDF(w)</strong> — log of the number of documents divided by the number of
            documents containing w. Rare words get a high IDF; words in every document get an
            IDF near zero.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="TF-IDF formula">
        TF-IDF(w, d) = TF(w, d) &times; IDF(w)
        &nbsp;&nbsp; where &nbsp;&nbsp;
        IDF(w) = log(N / df(w))
      </MathFormula>

      <WorkedExample title="TF-IDF Step by Step">
        <p>
          Corpus of 3 reviews (N = 3). We compute TF-IDF for the word &quot;battery&quot; in
          Review A: &quot;great battery life great product&quot; (4 words total).
          &quot;battery&quot; appears in 2 of the 3 reviews.
        </p>
        <CalcStep number={1}>
          TF(&quot;battery&quot;, Review A) = count in doc / total words = 1 / 4 = 0.25
        </CalcStep>
        <CalcStep number={2}>
          df(&quot;battery&quot;) = 2 (appears in Review A and one other review)
        </CalcStep>
        <CalcStep number={3}>
          IDF(&quot;battery&quot;) = log(N / df) = log(3 / 2) = log(1.5) &asymp; 0.405
        </CalcStep>
        <CalcStep number={4}>
          TF-IDF = 0.25 &times; 0.405 &asymp; 0.101
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Now consider the word &quot;the&quot;, which appears in all 3 reviews:
          IDF = log(3/3) = log(1) = 0. So &quot;the&quot; gets a TF-IDF score of exactly zero,
          no matter how often it appears in a single review — the formula automatically treats
          it as uninformative.
        </p>
      </WorkedExample>

      <ExplanationBox title="From Vectors to a Model">
        <p>
          After computing TF-IDF for every word in every review, each review becomes a sparse
          vector with one entry per vocabulary word. Most entries are zero because most words
          appear in only a fraction of reviews.
        </p>
        <p>
          These vectors are then fed directly into a classifier — logistic regression and naive
          Bayes both work well with sparse TF-IDF features and are interpretable: the largest
          positive coefficients correspond to the words most predictive of a positive review
          (&quot;excellent&quot;, &quot;love&quot;), and the largest negative coefficients
          identify negative sentiment words (&quot;terrible&quot;, &quot;broken&quot;).
        </p>
      </ExplanationBox>
    </div>
  );
}
