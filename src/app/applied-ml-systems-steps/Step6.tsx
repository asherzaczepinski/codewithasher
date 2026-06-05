'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Deployment Patterns">
        <p>
          Deploying a model means making its predictions accessible to the application or system
          that needs them. There are several distinct patterns, and the right one depends entirely
          on the latency and throughput requirements of your use case.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>REST API / gRPC service</strong> — the model runs inside a long-lived server
            process that accepts inference requests over the network. Each request arrives, the model
            runs forward pass, and the prediction is returned in the response. This is the most
            common pattern for real-time user-facing applications. Tools: TorchServe, TensorFlow
            Serving, Triton Inference Server, BentoML.
          </li>
          <li>
            <strong>Batch inference</strong> — predictions are generated for a large dataset
            offline on a schedule (nightly, hourly). Results are written to a database or data
            warehouse and read by the application at query time. There is no strict latency
            requirement — throughput matters instead. This is appropriate for email personalization,
            weekly risk reports, or any use case where pre-computing predictions is acceptable.
          </li>
          <li>
            <strong>Streaming inference</strong> — the model consumes events from a stream
            (Kafka, Kinesis) and emits predictions back to the stream. Each event is processed
            as it arrives, with latency measured in seconds rather than milliseconds. Fraud
            detection at payment time is a canonical example.
          </li>
          <li>
            <strong>Edge inference</strong> — the model runs on the device itself, with no network
            round-trip. Required when network latency is unacceptable (autonomous vehicle), when
            data cannot leave the device (on-device voice assistant), or when connectivity is
            unreliable (industrial IoT sensor).
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Batch vs. Online Inference: The Tradeoff">
        <p>
          Batch inference maximizes hardware utilization: you fill a GPU with a large batch of
          inputs and amortize the fixed overhead of a forward pass across many examples. Online
          inference often receives requests one at a time, meaning the GPU sits idle between
          requests or runs small batches that underutilize it.
        </p>
        <p>
          The tension is between <strong>latency</strong> (how long a single request takes to get
          a response) and <strong>throughput</strong> (how many predictions the system produces
          per second). Optimizing for one tends to hurt the other at the extremes.
        </p>
      </ExplanationBox>

      <MathFormula label="Throughput and latency">
        Throughput = batch_size / latency_per_batch
      </MathFormula>

      <WorkedExample title="Latency vs. Throughput Calculation">
        <p>
          A model takes 40 ms to process a batch of inputs. We test with batch sizes of 1 and 32.
        </p>
        <CalcStep number={1}>
          Batch size 1: latency = 40 ms, throughput = 1 / 0.040 s = 25 requests/sec
        </CalcStep>
        <CalcStep number={2}>
          Batch size 32: latency increases to 80 ms (larger batch, more compute), but throughput
          = 32 / 0.080 s = 400 requests/sec
        </CalcStep>
        <CalcStep number={3}>
          Throughput improved 16x at the cost of 2x latency. For an API with a 200 ms SLA,
          a batch size of 32 is viable. For a 50 ms SLA, it is not.
        </CalcStep>
        <CalcStep number={4}>
          A common production strategy: accumulate incoming requests for up to 20 ms
          (dynamic batching), then process together. This keeps latency acceptable while
          recovering most of the throughput gains of large batches.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Triton Inference Server and TorchServe both implement dynamic batching natively.
          You configure a max batch size and a max wait time; the server assembles batches
          automatically from concurrent requests.
        </p>
      </WorkedExample>

      <ExplanationBox title="GPU Training and Distributed Training">
        <p>
          Training large models on a single CPU is often impractical — a deep learning model
          may require trillions of floating-point operations per epoch. GPUs accelerate this
          by executing thousands of arithmetic operations in parallel using their SIMD cores.
        </p>
        <p>
          When a single GPU is not enough (model too large to fit in GPU memory, or training
          time too long), distributed training spreads the work across multiple GPUs or machines:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Data parallelism</strong> — each GPU holds a full copy of the model but
            processes a different shard of the training batch. Gradients are averaged across GPUs
            after each step (AllReduce). This is the standard approach for most models.
          </li>
          <li>
            <strong>Model parallelism</strong> — the model itself is split across GPUs, with
            different layers on different devices. Required when a single model is too large to
            fit in one GPU&apos;s memory (e.g., a 70B parameter LLM).
          </li>
          <li>
            <strong>Pipeline parallelism</strong> — layers are assigned to GPUs in pipeline
            stages, with micro-batches flowing through the pipeline to reduce idle time. Used in
            combination with model parallelism for very large models (GPipe, PipeDream).
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Mixed Precision and Checkpointing">
        <p>
          <strong>Mixed precision training</strong> stores model weights in 16-bit floating point
          (fp16 or bfloat16) during the forward and backward pass, reducing memory by 2x and
          speeding up matrix multiplications on modern GPUs (which have dedicated Tensor Cores
          for 16-bit operations). A master copy of the weights in fp32 is maintained for the
          optimizer step to preserve numerical stability. PyTorch&apos;s torch.amp.autocast handles
          this automatically.
        </p>
        <p>
          <strong>Checkpointing</strong> means saving the model weights, optimizer state, and
          training step number to disk at regular intervals. On a preemptible GPU instance —
          which cloud providers can reclaim with minutes of notice — a job that runs for 12
          hours without checkpointing loses all progress if the instance is interrupted.
          Checkpointing every 30 minutes limits the maximum loss to 30 minutes of computation.
        </p>
        <p>
          <strong>Gradient checkpointing</strong> (not to be confused with model checkpointing)
          is a different technique: instead of storing all intermediate activations during the
          forward pass for use in backpropagation, you recompute them on the fly during the
          backward pass. This trades compute time (roughly 30% slowdown) for memory (cuts
          activation memory by the square root of the number of layers), enabling larger batch
          sizes or deeper models on the same GPU.
        </p>
      </ExplanationBox>
    </div>
  );
}
