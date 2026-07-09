import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || process.env.ENVIRONMENT || "development";
const isProduction = nodeEnv === "production";

const getAuthSecret = (
  key: "ACCESS_TOKEN_SECRET" | "REFRESH_TOKEN_SECRET",
  developmentFallback: string,
) => {
  const value = process.env[key];

  if (isProduction && !value) {
    throw new Error(`${key} is required in production`);
  }

  return value || developmentFallback;
};

const accessTokenSecret = getAuthSecret(
  "ACCESS_TOKEN_SECRET",
  process.env.JWT_SECRET || "development-access-token-secret-change-me",
);
const refreshTokenSecret = getAuthSecret(
  "REFRESH_TOKEN_SECRET",
  "development-refresh-token-secret-change-me",
);

if (isProduction && accessTokenSecret === refreshTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different");
}

export const appConfig = {
  PORT: Number(process.env.PORT) || 8080,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  ACCESS_TOKEN_AGE: "15m",
  ENVIRONMENT: nodeEnv,
  EVIRONMENT: process.env.ENVIRONMENT,
  isProduction,
  cors: {
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  },
  auth: {
    accessTokenSecret,
    refreshTokenSecret,
  },
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
