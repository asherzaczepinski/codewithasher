'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Big Idea: Compress, Then Reconstruct">
        <p>
          An autoencoder has two halves that work together. The <strong>encoder</strong> takes a
          high-dimensional input — say, a 784-pixel digit image — and squashes it down to a tiny
          vector called the <strong>latent code</strong> (also called the bottleneck). The
          <strong> decoder</strong> then takes that small vector and tries to rebuild the original
          image as accurately as possible.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Because the bottleneck is far smaller than the input, the network cannot simply memorise
          pixels. It is forced to store only what is truly important: the general shape of the
          digit, whether it leans left or right, how thick the stroke is. Everything redundant
          gets discarded.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Architecture in Plain English">
        <p>
          Think of it as a funnel followed by a reverse funnel:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Encoder layers</strong>: 784 &rarr; 128 &rarr; 32 &rarr; <em>latent code z (size 8)</em></li>
          <li><strong>Decoder layers</strong>: 8 &rarr; 32 &rarr; 128 &rarr; 784 (reconstructed image)</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Each layer is a standard fully-connected layer with an activation function. The only
          special thing is that the neck of the funnel — the latent code — is dramatically
          narrower than the input.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reconstruction Loss">
        <p>
          How do we train this? We need a loss that measures how different the reconstructed
          image is from the original. The most common choice for pixel-level images is
          <strong> mean squared error (MSE)</strong> across all pixels.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          If the original image has pixels x(1), x(2), ..., x(n) and the reconstruction has
          pixels x&#x0302;(1), x&#x0302;(2), ..., x&#x0302;(n), the loss is:
        </p>
      </ExplanationBox>

      <MathFormula label="Reconstruction Loss (MSE)">
        L = (1/n) * sum over i of (x(i) - x&#x0302;(i))^2
      </MathFormula>

      <ExplanationBox title="What the Bottleneck Forces the Network to Learn">
        <p>
          With only 8 numbers to describe a 784-pixel image, the encoder must discover the
          most compact possible description. In practice, the 8 latent dimensions end up
          capturing human-interpretable properties: one dimension might control digit identity
          (is it a 3 or a 7?), another might control stroke width, another might control
          tilt. This is <strong>representation learning</strong> — the network has found a
          compact, meaningful coordinate system for the data without anyone labelling those
          properties explicitly.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This is also why autoencoders are used for <strong>dimensionality reduction</strong>:
          instead of PCA&apos;s linear projections, an autoencoder can learn curved, nonlinear
          structure in the data.
        </p>
      </ExplanationBox>

      <WorkedExample title="Reconstruction Loss: Step by Step">
        <p>
          Our toy autoencoder compresses a 4-pixel image (grayscale, values 0–1) down to a
          2-number latent code, then reconstructs it. After one forward pass the reconstruction
          is:
        </p>
        <CalcStep number={1}>Original pixels: x = (0.9, 0.1, 0.8, 0.2)</CalcStep>
        <CalcStep number={2}>Reconstruction: x&#x0302; = (0.7, 0.3, 0.6, 0.4)</CalcStep>
        <CalcStep number={3}>Squared errors: (0.9-0.7)^2 = 0.04 &nbsp; (0.1-0.3)^2 = 0.04 &nbsp; (0.8-0.6)^2 = 0.04 &nbsp; (0.2-0.4)^2 = 0.04</CalcStep>
        <CalcStep number={4}>Sum of squared errors: 0.04 + 0.04 + 0.04 + 0.04 = 0.16</CalcStep>
        <CalcStep number={5}>MSE = 0.16 / 4 = 0.04</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          An MSE of 0.04 means the reconstruction is off by about 0.2 per pixel on average
          (since 0.2^2 = 0.04). Backpropagation flows through the decoder and encoder to reduce
          this loss — nudging every weight in both halves simultaneously. After thousands of
          training images the network learns to compress and reconstruct with very little error.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows exactly the architecture described above — encoder funnel,
          decoder reverse-funnel, and MSE reconstruction loss — written as a PyTorch
          <code>nn.Module</code>. This is <strong>illustrative</strong> code; comments explain
          every line so you can map it back to the concepts above.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="autoencoder.py"
        caption="A minimal PyTorch autoencoder with encoder, decoder, and MSE reconstruction loss."
        code={`import torch
import torch.nn as nn

# ------------------------------------------------------------------ #
# Illustrative PyTorch code — meant to be read alongside the lesson.  #
# Run it with: python autoencoder.py                                   #
# ------------------------------------------------------------------ #

class Autoencoder(nn.Module):
    # The whole autoencoder lives in one nn.Module so that
    # optimizer.step() updates both halves with a single call.

    def __init__(self, input_dim=784, latent_dim=8):
        super().__init__()

        # ENCODER — the left (compression) half of the funnel.
        # Each Linear layer reduces the dimension; ReLU adds non-linearity
        # so the network can learn curved, not just linear, compressions.
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),  # 784 -> 128
            nn.ReLU(),
            nn.Linear(128, 32),         # 128 -> 32
            nn.ReLU(),
            nn.Linear(32, latent_dim),  # 32  -> 8  (the bottleneck)
            # No activation here: the latent code can be any real number.
        )

        # DECODER — the right (reconstruction) half of the funnel.
        # It mirrors the encoder in reverse, expanding back to the original size.
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 32),  # 8   -> 32
            nn.ReLU(),
            nn.Linear(32, 128),         # 32  -> 128
            nn.ReLU(),
            nn.Linear(128, input_dim),  # 128 -> 784
            nn.Sigmoid(),  # Sigmoid squashes output to (0, 1),
                           # matching normalised pixel values.
        )

    def forward(self, x):
        # x shape: (batch_size, 784) — a flattened batch of MNIST images.

        # Step 1: compress to the latent code z.
        z = self.encoder(x)  # z shape: (batch_size, 8)

        # Step 2: reconstruct from the latent code.
        x_hat = self.decoder(z)  # x_hat shape: (batch_size, 784)

        # Return both so the training loop can compute the loss.
        return x_hat, z


# ------------------------------------------------------------------ #
# Training loop — shows how MSE loss drives both halves to improve.   #
# ------------------------------------------------------------------ #

def train_one_epoch(model, dataloader, optimizer):
    # nn.MSELoss() averages (x - x_hat)^2 over every pixel in the batch.
    loss_fn = nn.MSELoss()

    for x_batch, _ in dataloader:
        # Flatten 28x28 images to 784-element vectors.
        x_flat = x_batch.view(x_batch.size(0), -1)  # shape: (B, 784)

        # Forward pass: encoder then decoder.
        x_hat, z = model(x_flat)

        # Reconstruction loss: how different is x_hat from the ORIGINAL x?
        # The bottleneck forces the network to compress without losing too much.
        loss = loss_fn(x_hat, x_flat)

        # Standard PyTorch backward pass.
        optimizer.zero_grad()   # clear gradients from the previous step
        loss.backward()         # backprop through decoder AND encoder
        optimizer.step()        # update every weight in both halves

    return loss.item()  # return the last batch loss for logging


# Quick smoke-test with random data (no real dataset needed).
if __name__ == "__main__":
    model = Autoencoder(input_dim=784, latent_dim=8)
    # Adam is a good default optimiser; lr=1e-3 is a typical starting point.
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    # Fake a single batch: 32 images, each a 784-dim random vector in [0, 1].
    fake_batch = [(torch.rand(32, 1, 28, 28), None)]
    loss_val = train_one_epoch(model, fake_batch, optimizer)
    print(f"Loss after one batch: {loss_val:.4f}")
`}
      />

      <ExplanationBox title="Practical Uses of Autoencoders">
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Dimensionality reduction</strong> — like PCA but nonlinear; useful for visualising high-dimensional datasets.</li>
          <li><strong>Anomaly detection</strong> — train on normal data; at test time, unusually high reconstruction error flags an anomaly.</li>
          <li><strong>Feature extraction</strong> — use the encoder&apos;s output as compact features for a downstream classifier.</li>
          <li><strong>Pre-training</strong> — initialise the weights of a larger network using an autoencoder trained on unlabelled data.</li>
        </ul>
      </ExplanationBox>
    </div>
  );
}
