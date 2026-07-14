import IChunk from "@/@types/interface/chunk.interface.js";
import appConfig from "@/config/config.js";
import pineconeClient from "@/config/pinecone.js";
import Chunk, { IPageContent } from "./chunking.service.js";

const BATCH_SIZE = appConfig.pinecone.batchSize || 100;
class PineConeService {
  public static async process(
    pages: IPageContent[],
    document_id: string,
    subject_id: string,
    filename: string,
  ) {
    try {
      const chunks = Chunk.fire(pages, document_id, filename, subject_id);
      await PineConeService.upsertChunks(chunks);
    } catch (error) {
      console.log("[Pinecone] Error processing chunks:", error);
      throw error;
    }
  }
  public static async upsertChunks(chunks: IChunk[]) {
    // batch insert 😅😊
    try {
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        await pineconeClient.index.upsertRecords({
          records: batch.map((chunk) => ({
            _id: chunk._id,
            chunk_text: chunk.chunk_text,
            subject_id: chunk.subject_id,
            document_id: chunk.document_id,
            pages: JSON.stringify(chunk.pages),
            source_filename: chunk.source_filename,
            text: chunk.chunk_text,
          })),
        });
      }
    } catch (error) {
      console.log("[Pinecone] Error upserting chunks:", error);
      throw error;
    }
  }
  public static async searchChunks(
    query: string,
    topK: number = 10,
    filters?: Exclude<IChunk, "_id" | "chunk_text" | "pages">,
  ) {
    const response = await pineconeClient.index.searchRecords({
      query: {
        topK,
        inputs: {
          text: query,
        },
        filter: filters || undefined,
      },
    });
    return response.result.hits;
  }
}

export default PineConeService;
