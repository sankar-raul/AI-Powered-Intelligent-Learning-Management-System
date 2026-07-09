import dotenv from "dotenv";

dotenv.config();
export const appConfig = {
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_AGE: "7d",
  EVIRONMENT: process.env.ENVIRONMENT,
  AWS_REGION: process.env.AWS_REGION,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    indexName: process.env.PINECONE_INDEX_NAME,
    indexHost: process.env.PINECONE_INDEX_HOST,
    batchSize: 100,
  },
};
export default appConfig;
