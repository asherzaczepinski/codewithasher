'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import PCADistanceDemo from '@/components/PCADistanceDemo';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="More Features, More Problems">
        <p>
          Intuition says: the more information you feed a model, the better it will do.
          In practice, beyond a certain point, adding more features <em>hurts</em>. This
          surprising failure is called the <strong>curse of dimensionality</strong>.
        </p>
        <p>
          The core issue is that high-dimensional space is almost entirely empty. As the
          number of dimensions grows, the volume of the space grows exponentially — but
          your dataset stays the same size. Your data points end up impossibly far apart
          from each other.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Distance Breaks Down">
        <p>
          Many machine-learning algorithms — k-nearest neighbors, clustering, SVMs with RBF
          kernels — rely on the idea that nearby points are similar. In high dimensions, that
          idea collapses.
        </p>
        <p>
          Imagine points uniformly scattered in a unit cube. In 2D, two random points are
          on average about 0.52 units apart. In 100D, they are on average about 9.0 units
          apart — and crucially, almost <em>all</em> pairs of points end up with nearly the
          same distance from each other. When every point is roughly equidistant from every
          other point, &quot;nearest neighbor&quot; is meaningless.
        </p>
      </ExplanationBox>

      <MathFormula label="Average distance grows with dimensions">
        E[distance] ≈ √(d / 6)   for d uniformly random dimensions in [0, 1]
      </MathFormula>

      <ExplanationBox title="Watch Distances Concentrate">
        <p>
          Drag the dimension slider and watch what happens to the gap between a point&apos;s{' '}
          <em>nearest</em> and <em>farthest</em> neighbor. In low dimensions that gap is huge —
          near and far are obviously different. As d climbs, the two markers slide together and
          the ratio <strong>(farthest − nearest) / nearest</strong> collapses toward zero.
        </p>
      </ExplanationBox>

      <PCADistanceDemo />

      <ExplanationBox title="Sparsity: You Need Exponentially More Data">
        <p>
          Suppose you split each feature into just 10 bins. In 1D you need 10 data points to
          fill the space. In 2D you need 10² = 100. In 10D you need 10¹⁰ = 10 billion. The
          amount of data required to densely cover a d-dimensional space grows exponentially
          with d.
        </p>
        <p>
          In practice your dataset is a fixed size, so in high dimensions it is impossibly
          sparse. A model trained on sparse data is essentially interpolating in the dark —
          it has no nearby examples to learn from for most of the input space.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Overfitting Becomes Inevitable">
        <p>
          With many features and sparse data, a model can always find some combination of
          features that fits the training set perfectly — by pure chance. It memorizes the
          noise instead of learning the signal. This is overfitting, and it gets worse as
          dimensionality increases.
        </p>
        <p>
          The fix is not &quot;get more data&quot; (often impossible) — it is to <strong>reduce
          dimensionality</strong>. By compressing features down to the directions that actually
          carry information, we make the space dense again and give our model a fighting chance.
          That is exactly what PCA does.
        </p>
      </ExplanationBox>
    </div>
  );
}
