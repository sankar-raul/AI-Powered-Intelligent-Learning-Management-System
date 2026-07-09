import crypto from "crypto";

const CHUNK_SIZE = 8192; // 8KB

export async function generateFingerprint(file: Buffer): Promise<string> {
  const hash = crypto.createHash("sha256");

  let offset = 0;
  while (offset < file.length) {
    const chunk = file.subarray(offset, offset + CHUNK_SIZE);
    hash.update(chunk);
    offset += CHUNK_SIZE;
  }

  return hash.digest("hex");
}
