'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Why Domain Matters Before Architecture">
        <p>
          Before choosing a model architecture, you need to know what kind of data you have and
          what kind of output you need. A ResNet is a terrible choice for sentiment analysis.
          A bag-of-words model is a terrible choice for object detection. The domain determines
          the inductive bias — the built-in assumptions — that make a model efficient.
        </p>
        <p>
          The good news: every domain reuses the same underlying building blocks (linear layers,
          attention, convolution, embeddings). What changes is how those blocks are assembled and
          what pre-training strategy makes sense.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Computer Vision">
        <p>
          <strong>Typical task:</strong> classify images, detect objects, segment pixels, estimate
          depth, or generate images.
        </p>
        <p>
          <strong>Data:</strong> grids of pixel values, usually stored as tensors of shape
          (height, width, channels). Images are high-dimensional — a 224×224 RGB image has
          150,528 values — but most of that information is spatially local and translation-invariant:
          a cat in the top-left corner looks the same as a cat in the bottom-right corner.
        </p>
        <p>
          <strong>Core model:</strong> Convolutional Neural Networks (CNNs) exploit spatial
          locality by sliding small filters across the image. Modern vision models often add
          attention on top (Vision Transformers, ViT) to capture long-range dependencies. For
          most applied work, you fine-tune a pre-trained backbone (ResNet, EfficientNet, ViT)
          on your own data rather than training from scratch — the ImageNet pre-training gives
          you powerful low-level feature detectors for free.
        </p>
        <p>
          <strong>Key challenges in production:</strong> image resolution variability, lighting
          and camera differences between training and production, and the cost of labeling
          (bounding boxes for detection take 10-20x longer to annotate than image-level labels).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Natural Language Processing">
        <p>
          <strong>Typical task:</strong> classify text, extract entities, translate, summarize,
          answer questions, or generate text.
        </p>
        <p>
          <strong>Data:</strong> sequences of tokens (words, subwords, or characters). Language
          is discrete, variable-length, and highly context-dependent — the word &quot;bank&quot; means
          something completely different in &quot;river bank&quot; versus &quot;bank account.&quot;
        </p>
        <p>
          <strong>Core model:</strong> Transformers with self-attention dominate modern NLP.
          The attention mechanism lets every token attend to every other token in the sequence,
          handling long-range dependencies that RNNs struggled with. In practice, you almost
          always start from a pre-trained language model (BERT for understanding tasks, GPT-style
          for generation) and fine-tune on your task.
        </p>
        <p>
          <strong>Key challenges in production:</strong> tokenization mismatches between training
          and deployment (different vocabulary sizes, BPE vs. WordPiece), input length limits
          (most models cap at 512 or 4096 tokens), and the cost of inference — a 7B parameter
          model needs ~14 GB of GPU memory at fp16.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Speech Recognition">
        <p>
          <strong>Typical task:</strong> transcribe spoken audio to text (ASR), detect a wake
          word, classify a speaker, or convert text to speech (TTS).
        </p>
        <p>
          <strong>Data:</strong> raw audio waveforms, usually converted to mel spectrograms before
          feeding to a model. A spectrogram is a 2-D representation of how frequency content
          changes over time — it looks like an image, which is why many ASR models reuse
          CNN and Transformer components from vision and NLP.
        </p>
        <p>
          <strong>Core model:</strong> Modern ASR systems (Whisper, Wav2Vec 2.0) use a
          Transformer encoder trained with a connectionist temporal classification (CTC) loss
          or an encoder-decoder architecture for sequence-to-sequence transcription. The
          key insight is that audio frames and text tokens are misaligned in length — CTC
          handles this by allowing the model to output blank tokens and then collapsing repeats.
        </p>
        <p>
          <strong>Key challenges in production:</strong> accents, background noise, domain-specific
          vocabulary (medical terms, product names), and latency — streaming ASR must produce
          partial transcripts in real time with less than ~200 ms delay for a usable user experience.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Audio ML Beyond Speech">
        <p>
          Not all audio is speech. Audio ML also covers music classification, environmental sound
          detection (a smoke alarm, a gunshot), audio event detection in video, and music generation.
        </p>
        <p>
          The modelling approach is similar: convert waveform to a time-frequency representation,
          then apply a CNN or Transformer. The difference is the label space — instead of words,
          you&apos;re classifying into sound event categories, genres, or instrument types.
        </p>
        <p>
          <strong>How the domains connect:</strong> all four areas (vision, NLP, speech, audio ML)
          converge on the Transformer architecture. Vision uses patch embeddings instead of token
          embeddings; speech uses spectrograms as input; NLP uses subword tokens. The attention
          mechanism and training recipe are nearly identical. This is why large multimodal models
          that process images, text, and audio together (GPT-4o, Gemini) are architecturally
          feasible — the modality-specific encoding is a thin wrapper around a shared backbone.
        </p>
      </ExplanationBox>

      <MathFormula label="Attention score (scaled dot-product)">
        Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V
      </MathFormula>

      <ExplanationBox title="Reading the Attention Formula">
        <p>
          The formula above appears in every Transformer-based model across vision, NLP, and speech.
          Q (query), K (key), and V (value) are linear projections of the input sequence.
          The dot product Q K^T measures how much each position should attend to every other
          position. Dividing by sqrt(d_k) prevents the dot products from growing so large that
          gradients vanish through the softmax. The result is a weighted average of the value
          vectors — each output position gets a blend of all input positions, weighted by relevance.
        </p>
        <p>
          This single operation is what lets a model understand that &quot;it&quot; in &quot;The animal
          didn&apos;t cross the street because it was too tired&quot; refers to &quot;animal,&quot; not
          &quot;street&quot; — by attending back across the full sequence.
        </p>
      </ExplanationBox>
    </div>
  );
}
