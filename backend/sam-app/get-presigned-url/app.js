import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET = process.env.BUCKET;

const s3 = new S3Client({
  region: AWS_REGION,
  endpoint: process.env.S3_ENDPOINT || "http://localhost:4566",
  forcePathStyle: true, // important for LocalStack
});

s3.middlewareStack.remove("flexibleChecksumsMiddleware");

export const handler = async (event) => {
  try {
    const { filename, fileType } = JSON.parse(event.body ?? "{}");

    if (!fileType?.startsWith("image/")) {
      return { statusCode: 400, body: "Invalid content type" };
    }

    const ext = filename?.split(".").pop() || "jpg";
    const key = `recipes/${randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 }); // seconds

    const s3ObjectUrl = `https://${BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key, s3ObjectUrl }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
