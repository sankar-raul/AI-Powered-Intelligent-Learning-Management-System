import axios from "axios";

const BATCH_SIZE = 32;

export async function embedChunks(chunks: { text: string }[]) {
  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const response = await axios.post("http://127.0.0.1:8081/v1/embeddings", {
      input: batch.map((c) => c.text),
    });

    embeddings.push(...response.data.data.map((item: any) => item.embedding));

    console.log(
      `Processed ${Math.min(i + BATCH_SIZE, chunks.length)} / ${chunks.length}`,
    );
  }

  return embeddings;
}
