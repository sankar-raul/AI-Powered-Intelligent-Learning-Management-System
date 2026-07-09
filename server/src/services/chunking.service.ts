import IChunk from "@/@types/interface/chunk.interface.js";
import { get_encoding } from "tiktoken";

export interface PageContent {
  pageNumber: number | null;
  text: string;
}

class Chunk {
  static fire(
    pages: PageContent[],
    document_id: string,
    filename: string,
    subject_id: string,
    chunk_size = 800,
    overlap = 100,
  ): IChunk[] {
    const encoding = get_encoding("cl100k_base");

    const allTokens: number[] = [];
    const tokenPageMap: (number | null)[] = [];

    for (const page of pages) {
      const tokens = encoding.encode(page.text);

      allTokens.push(...tokens);

      tokenPageMap.push(...Array(tokens.length).fill(page.pageNumber));
    }

    const chunks: IChunk[] = [];

    let start = 0;
    let chunkId = 0;

    while (start < allTokens.length) {
      const end = start + chunk_size;

      const chunkTokens = allTokens.slice(start, end);

      const decodedText = new TextDecoder().decode(
        encoding.decode(new Uint32Array(chunkTokens)),
      );

      const pagesInChunk = [
        ...new Set(
          tokenPageMap
            .slice(start, end)
            .filter((page): page is number => page !== null),
        ),
      ].sort((a, b) => a - b);

      chunks.push({
        _id: `${document_id}_chunk_${chunkId}`,
        chunk_text: decodedText,
        source_filename: filename,
        document_id,
        pages: pagesInChunk,
        subject_id,
      });

      chunkId++;

      start += chunk_size - overlap;
    }

    encoding.free();

    return chunks;
  }
}

export default Chunk;
