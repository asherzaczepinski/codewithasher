'use client';

import ExplanationBox from '@/components/ExplanationBox';
import NBEmailBag from '@/components/NBEmailBag';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Email as a Bag of Words">
        <p>
          Before any probability appears, a spam filter has to decide <em>what</em> to look at. The
          surprising answer is: not very much. It throws away grammar, punctuation, sentence order, and
          even how many times a word repeats. What remains is just a <strong>bag of words</strong> — an
          unordered set of which words appeared.
        </p>
        <p>
          So &quot;Click here to claim your free cash prize&quot; and &quot;Your free prize: claim the
          cash, click here&quot; look <strong>identical</strong> to the filter. Both reduce to the same
          bag: <em>click, claim, free, cash, prize</em>. Order is discarded; presence is everything.
        </p>
        <p>
          This sounds reckless — surely word order matters? But for spam, the mere presence of certain
          words is so revealing that the filter can do astonishingly well on presence alone. That is the
          bet Naive Bayes makes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Spammy Words vs Ham Words">
        <p>
          Once you view an email as a bag of words, classification becomes a question of which words are
          in the bag. Some words tilt strongly toward spam: <em>free</em>, <em>winner</em>,{' '}
          <em>click</em>, <em>cash</em>, <em>offer</em>. Others tilt toward ham — ordinary legitimate
          mail: <em>meeting</em>, <em>agenda</em>, <em>attached</em>, <em>project</em>, <em>lunch</em>.
        </p>
        <p>
          No single word is a guarantee. Plenty of real emails say <em>free</em> (&quot;feel free to
          reply&quot;), and spam can mention a <em>meeting</em>. The filter never relies on one word
          alone — it weighs all the words in the bag together. But you can already feel the pull each
          word exerts.
        </p>
      </ExplanationBox>

      <NBEmailBag />

      <ExplanationBox title="What the Filter Must Decide">
        <p>
          Drag a few words into the email above and watch the soft verdict shift. With only a chip count,
          we can say an email &quot;leans spam&quot; or &quot;leans ham&quot; — but that is just
          intuition. What happens when the bag holds a mix, like <em>free</em> plus <em>meeting</em>?
          Counting chips no longer settles it.
        </p>
        <p>
          To make a principled decision we need to turn that intuition into <strong>numbers</strong>: how
          much more likely is each word in spam than in ham, and how do we combine those clues? That is
          exactly what the rest of this course builds. The next part shows how each word becomes a
          probability you can read straight off the training data.
        </p>
      </ExplanationBox>
    </div>
  );
}
