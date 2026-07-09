import { Pinecone } from "@pinecone-database/pinecone";
import appConfig from "./config.js";

const pinecone = new Pinecone({
  apiKey: appConfig.pinecone.apiKey!,
});

const index = pinecone.index(
  appConfig.pinecone.indexName!,
  appConfig.pinecone.indexHost!,
);

const pineconeClient = {
  index,
  pinecone,
};

export default pineconeClient;
