'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="When Data Has Structure: Graphs">
        <p>
          Grids (images) and sequences (text, audio) are the structures that CNNs and RNNs/transformers
          were designed for. But much real-world data is neither — it is a <strong>graph</strong>:
          a set of nodes connected by edges with no canonical ordering.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Molecules: atoms are nodes, bonds are edges. Predicting drug toxicity or protein-ligand binding.</li>
          <li>Social networks: users are nodes, friendships are edges. Predicting community membership or viral spread.</li>
          <li>Knowledge graphs: entities are nodes, relations are edges. Answering factual questions.</li>
          <li>Road networks: intersections are nodes, road segments are edges. Predicting traffic flow or ETA.</li>
          <li>Scenes: objects are nodes, spatial relations are edges. Visual question answering.</li>
        </ul>
        <p>
          Standard deep learning cannot handle graphs directly because it assumes a fixed-size,
          ordered input. <strong>Graph Neural Networks (GNNs)</strong> generalize deep learning
          to arbitrary graph structures.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Message Passing: The Core GNN Operation">
        <p>
          All modern GNNs are instances of the <strong>message passing framework</strong>.
          Each node maintains a feature vector (embedding). In each layer, every node:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Sends messages</strong> to each of its neighbors — a function of its own
          embedding and the edge features.</li>
          <li><strong>Aggregates</strong> incoming messages from all neighbors — commonly by
          summing, averaging, or taking the maximum.</li>
          <li><strong>Updates</strong> its own embedding using the aggregated message and its
          previous embedding — via a learned neural network (e.g., an MLP or GRU).</li>
        </ul>
        <p>
          After L layers, each node&apos;s embedding encodes information from its L-hop neighborhood.
          The design choices of message, aggregation, and update functions distinguish Graph
          Convolutional Networks (GCN), GraphSAGE, Graph Attention Networks (GAT), and
          Message Passing Neural Networks (MPNN).
        </p>
      </ExplanationBox>

      <MathFormula label="Message Passing Update (one layer)">
        h_v^(l+1) = UPDATE( h_v^(l), AGGREGATE( h_u^(l) for u in N(v) ) )
      </MathFormula>

      <ExplanationBox title="Node, Edge, and Graph Tasks">
        <p>
          GNNs support three levels of prediction:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Node-level:</strong> Classify each node. Example: predict whether each
          user in a social network is a bot. After message passing, apply a classifier to
          each node&apos;s final embedding.</li>
          <li><strong>Edge-level:</strong> Predict properties of edges or whether missing edges
          exist (link prediction). Concatenate or compute a dot product of endpoint embeddings,
          then apply a classifier. Used in recommendation systems.</li>
          <li><strong>Graph-level:</strong> Classify or regress the entire graph. Aggregate all
          node embeddings into a single graph-level representation (via readout: sum, mean, or
          learned attention), then apply a classifier. Used in molecular property prediction.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Neural Architecture Search and AutoML">
        <p>
          Designing a neural network architecture requires many human decisions: number of layers,
          layer sizes, activation functions, skip connections, normalization layers, learning rate
          schedules. Getting these right often requires weeks of expert experimentation.
          <strong>Neural Architecture Search (NAS)</strong> automates this by treating architecture
          design as an optimization problem.
        </p>
        <p>
          Early NAS methods (Zoph &amp; Le 2017) trained a controller RNN to generate architectures
          and used reinforcement learning to reward architectures that performed well after training.
          This was enormously expensive — thousands of GPU-hours. Modern approaches are much
          more efficient:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>DARTS (Differentiable Architecture Search):</strong> Relax the discrete
          architecture choices to continuous weights (a weighted sum of candidate operations at
          each edge), and jointly optimize architecture weights and model weights with gradient
          descent. Then discretize by keeping the top-weighted operation at each edge.</li>
          <li><strong>Weight sharing / supernets:</strong> Train a single supernet that contains
          all candidate architectures as subgraphs, sharing weights. Sample and evaluate subnets
          efficiently without retraining from scratch.</li>
          <li><strong>Bayesian optimization and evolutionary methods:</strong> Treat architecture
          performance as a black-box function and use surrogate models or evolutionary algorithms
          to search the space with fewer evaluations.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Memory-Augmented and Multimodal Foundation Models">
        <p>
          <strong>Memory-augmented networks</strong> extend neural networks with an explicit,
          addressable external memory. The Neural Turing Machine (NTM) and Differentiable
          Neural Computer (DNC) use soft attention over a memory matrix to read and write
          information across timesteps — enabling the network to store and retrieve structured
          information that exceeds what fits in the weights alone. Retrieval-augmented generation
          (RAG), now widely deployed in production LLMs, applies this idea at scale: at inference
          time, relevant documents are retrieved from a vector database and injected into the
          context, effectively giving the model a dynamic external memory.
        </p>
        <p>
          <strong>Multimodal foundation models</strong> extend the language model paradigm to
          multiple modalities — images, audio, video, code, structured data — in a unified
          architecture. Contrastive pre-training (CLIP) aligns image and text representations
          by maximizing agreement between matched image-text pairs. Generative multimodal models
          (GPT-4o, Gemini, Claude) are trained on mixed-modality data and can reason fluidly
          across modalities.
        </p>
        <p>
          These models inherit the challenges of this entire course at scale: they can be
          adversarially attacked across modalities, they encode and amplify biases present in
          web-scale training data, their reasoning is opaque, and they catastrophically forget
          when fine-tuned on a narrow task. The frontier problems are not solved — they are
          larger.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Wrap-Up: What You Now Know">
        <p>
          You have covered the frontier of ML research in eight modules. Let&apos;s take stock:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Kernel methods</strong> let you work in infinite-dimensional feature spaces
          cheaply; structured prediction handles complex output spaces.</li>
          <li><strong>Adversarial examples</strong> reveal the brittleness of learned models;
          adversarial training is the strongest known defense, at a robustness-accuracy cost.</li>
          <li><strong>Causal inference</strong> gives you the tools to ask and answer
          &quot;what if I do X?&quot; — not just &quot;what is correlated with X?&quot;</li>
          <li><strong>Fairness</strong> requires choosing among incompatible formal criteria;
          interpretability — from SHAP to mechanistic circuits — lets humans audit and correct models.</li>
          <li><strong>Meta-learning</strong> optimizes for rapid adaptation; MAML learns an
          initialization that adapts well from very few examples on any new task.</li>
          <li><strong>Continual learning</strong> combats catastrophic forgetting; active learning
          acquires labels efficiently; online learning handles streaming data; multi-task learning
          shares structure across related tasks.</li>
          <li><strong>GNNs</strong> bring message passing over arbitrary graphs; NAS automates
          architecture design; memory-augmented and multimodal models push the scale frontier.</li>
        </ul>
        <p>
          The underlying theme across all of these: building ML systems that are not just accurate
          on a fixed benchmark, but <em>reliable, fair, interpretable, and adaptable</em> in a
          world that is complex, adversarial, and always changing. That is the real engineering
          challenge — and the frontier where the most important research is being done.
        </p>
      </ExplanationBox>

      <WorkedExample title="GNN Message Passing: One Layer by Hand">
        <p>
          A simple graph has 3 nodes: node 1 connects to nodes 2 and 3; nodes 2 and 3 do not
          connect to each other. Initial embeddings: h1 = 1.0, h2 = 2.0, h3 = 0.0 (scalars for simplicity).
          Aggregation = mean. Update = tanh(h_v + aggregated).
        </p>
        <CalcStep number={1}>Node 1&apos;s neighbors: 2 and 3. Aggregate = mean(2.0, 0.0) = 1.0.</CalcStep>
        <CalcStep number={2}>Node 1 update: h1&apos; = tanh(1.0 + 1.0) = tanh(2.0) = 0.964.</CalcStep>
        <CalcStep number={3}>Node 2&apos;s neighbors: 1 only. Aggregate = mean(1.0) = 1.0.</CalcStep>
        <CalcStep number={4}>Node 2 update: h2&apos; = tanh(2.0 + 1.0) = tanh(3.0) = 0.995.</CalcStep>
        <CalcStep number={5}>Node 3&apos;s neighbors: 1 only. Aggregate = mean(1.0) = 1.0.</CalcStep>
        <CalcStep number={6}>Node 3 update: h3&apos; = tanh(0.0 + 1.0) = tanh(1.0) = 0.762.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          After one layer, every node has incorporated information from its 1-hop neighbors.
          Node 3 went from 0.0 to 0.762 because it received node 1&apos;s strong signal. After a
          second layer, each node would know about its 2-hop neighborhood — and so on. The depth
          of the GNN controls the radius of the receptive field in the graph.
        </p>
      </WorkedExample>
    </div>
  );
}
