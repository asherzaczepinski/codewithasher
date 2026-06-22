'use client';

import ExplanationBox from '@/components/ExplanationBox';
import NBEmailGrid from '@/components/NBEmailGrid';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="100 Emails as a Grid">
        <p>
          A conditional probability can feel abstract, but it is really just <strong>counting dots</strong>.
          Picture our training set as a 10×10 grid of 100 squares — one square per labelled email. We
          colour <span style={{ color: '#dc2626', fontWeight: 600 }}>40 of them red for spam</span> and{' '}
          <span style={{ color: '#2563eb', fontWeight: 600 }}>60 of them blue for ham</span>.
        </p>
        <p>
          That single picture holds everything the classifier knows. Every probability it will ever
          compute is just a count of squares divided by another count of squares. Nothing more mysterious
          than that.
        </p>
      </ExplanationBox>

      <NBEmailGrid />

      <ExplanationBox title="Reading P(word | class) Off the Grid">
        <p>
          Select <em>free</em> above. Out of the 40 spam squares,{' '}
          <span style={{ color: '#dc2626', fontWeight: 600 }}>32 light up</span> — those are the spam
          emails that contain the word free. Among the 60 ham squares, only{' '}
          <span style={{ color: '#2563eb', fontWeight: 600 }}>4 light up</span>. Read directly:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>P(free | spam) = 32 / 40 = 0.80</strong> — four out of five spam emails shout
            &quot;free&quot;.
          </li>
          <li>
            <strong>P(free | ham) = 4 / 60 ≈ 0.067</strong> — barely one in fifteen normal emails do.
          </li>
        </ul>
        <p>
          The same trick works for every word. <em>Winner</em> lights up 28 spam and 1 ham square;{' '}
          <em>meeting</em> lights up just 2 spam but 42 ham squares. The conditional probability is
          always &quot;how many of <em>this colour</em> light up&quot; divided by &quot;how many of
          this colour exist&quot;.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Counting Is All Training Is">
        <p>
          Here is the quietly profound part: <strong>training a Naive Bayes classifier is nothing but
          counting.</strong> For each word and each class you tally how many emails contain it, then
          divide by the size of the class. There is no gradient descent, no iteration, no tuning — one
          pass over the data fills in the whole table.
        </p>
        <p>
          That is why Naive Bayes is so fast and so easy to inspect. Every number it uses traces back to
          a count you could verify by hand. In the next step we&apos;ll take these counts and feed them
          into Bayes&apos; theorem to actually score an email.
        </p>
      </ExplanationBox>
    </div>
  );
}
