import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const AWS_REGION = process.env.AWS_REGION_NAME;
const BUCKET = process.env.BUCKET;

const s3 = new S3Client({
  region: AWS_REGION,
});

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

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl, key }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
