import { DocumentRoles } from "@/@types/interface/document.interface.js";
import appConfig from "@/config/config.js";
import s3 from "@/config/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: Express.Multer.File,
  docRole: DocumentRoles,
): Promise<{ key: string }> {
  const key = `documents/${Date.now()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: appConfig.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return {
    key,
  };
}
