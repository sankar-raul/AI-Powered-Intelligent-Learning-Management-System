import { S3Client } from "@aws-sdk/client-s3";
import appConfig from "./config.js";

const s3 = new S3Client({
  region: appConfig.AWS_REGION!,
  credentials: {
    accessKeyId: appConfig.S3_ACCESS_KEY_ID!,
    secretAccessKey: appConfig.S3_SECRET_ACCESS_KEY!,
  },
});

export default s3;
