interface IChunk {
  _id: string;
  chunk_text: string;
  source_filename: string;
  document_id: string;
  subject_id: string;
  pages: number[];
}

export default IChunk;
