'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step14() {
  return (
    <div>
      <ExplanationBox title="PCA in the Real World">
        <p>
          Our 5-student example was deliberately tiny so every number stayed checkable by
          hand. But the exact same six-stage pipeline runs on datasets with thousands of
          features. Here&apos;s where you&apos;ll actually meet PCA in the wild.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Eigenfaces">
        <p>
          Treat a grayscale face photo as one long vector — a 100×100 image is a point in
          10,000-dimensional space. Run PCA across a library of faces and the top
          eigenvectors, drawn back out as images, look like ghostly faces called{' '}
          <strong>eigenfaces</strong>. The first few capture broad effects like lighting
          direction and overall face shape; later ones capture finer identity details.
        </p>
        <p>
          Any face can then be approximated as a weighted sum of a few dozen eigenfaces
          instead of 10,000 raw pixels — an early and famous approach to face recognition.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Genetics &amp; Population Structure">
        <p>
          Each person can be described by hundreds of thousands of genetic markers (SNPs).
          Run PCA on a population&apos;s SNP data and a remarkable thing happens: the first two
          principal components, plotted against each other, reproduce a rough{' '}
          <strong>map of geographic ancestry</strong>. Individuals cluster by region almost
          as if PCA had been handed a world map. The dominant axes of genetic variation line
          up with how populations historically migrated and mixed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Image &amp; Data Compression">
        <p>
          Keep the top components, discard the rest, and you store a faithful approximation
          of your data in a fraction of the space — exactly the reconstruction trade-off you
          measured earlier. The same idea underlies many compression and feature-extraction
          pipelines: represent each sample by a handful of PC scores instead of the full
          high-dimensional vector, then reconstruct when needed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Denoising">
        <p>
          Real measurements are noisy, and noise tends to spread itself thinly across many
          directions — showing up as lots of <strong>small</strong> eigenvalues. The big
          eigenvalues usually carry the genuine signal. So projecting onto the top few
          components and dropping the small-eigenvalue tail often <em>removes noise</em>{' '}
          while keeping the structure, leaving you with cleaner data than you started with.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Limitations &amp; Cousins">
        <p>
          PCA is powerful but it has firm assumptions worth knowing:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>PCA is linear.</strong> It can only find straight-line directions of
            variance. Data curled onto a curved manifold (think a Swiss roll) defeats it. For
            nonlinear visualization people reach for <strong>t-SNE</strong> and{' '}
            <strong>UMAP</strong>, which preserve local neighbourhood structure.
          </li>
          <li>
            <strong>Autoencoders</strong> — neural networks trained to compress then
            reconstruct — are a nonlinear generalization of PCA. With linear activations an
            autoencoder essentially <em>rediscovers</em> PCA; with nonlinear ones it can
            capture curved structure PCA cannot.
          </li>
          <li>
            <strong>PCA assumes variance = importance.</strong> The direction of largest
            spread is treated as most informative — but that isn&apos;t always true. A
            high-variance direction can be irrelevant to your actual task, while a subtle,
            low-variance signal is the thing you care about. PCA is unsupervised; it never
            looks at your labels.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="You Can Now Do This">
        <p>
          You started with a vague worry about &quot;too many dimensions&quot; and finished
          able to run PCA from first principles. You can now:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>center data and build its covariance matrix;</li>
          <li>find eigenvalues and eigenvectors and read them as variances and directions;</li>
          <li>project data onto principal components to compress it;</li>
          <li>reconstruct points and quantify exactly what compression costs;</li>
          <li>choose how many components to keep using explained variance and a scree plot;</li>
          <li>recognise where PCA helps in the real world — and where its linear, variance-equals-importance assumptions mean you should reach for a cousin instead.</li>
        </ul>
        <p>
          That&apos;s the core of dimensionality reduction. Take a dataset with hundreds of
          correlated features, find the handful of directions that actually matter, and keep
          only those — faster models, possible visualizations, cleaner data. Nicely done.
        </p>
      </ExplanationBox>
    </div>
  );
}
