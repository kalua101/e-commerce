import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Only initialize S3 if credentials are available
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";

let s3Client: S3Client | null = null;

// Only create S3 client if credentials are provided
if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_S3_BUCKET) {
  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });
}

export async function uploadToS3(file: Buffer, fileName: string, contentType: string): Promise<string> {
  if (!s3Client || !AWS_S3_BUCKET) {
    throw new Error("AWS S3 is not configured. Please set AWS environment variables.");
  }

  const key = `products/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read", // Make images publicly accessible
  });

  await s3Client.send(command);

  // Return the public URL
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(fileUrl: string): Promise<void> {
  if (!s3Client || !AWS_S3_BUCKET) {
    console.warn("AWS S3 is not configured. Skipping delete operation.");
    return;
  }

  // Extract the key from the URL
  const urlParts = fileUrl.split(".com/");
  if (urlParts.length !== 2) return;

  const key = urlParts[1];

  const command = new DeleteObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

export function getS3Url(key: string): string {
  if (!AWS_S3_BUCKET) {
    throw new Error("AWS S3 is not configured.");
  }
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export function isS3Configured(): boolean {
  return s3Client !== null;
}
