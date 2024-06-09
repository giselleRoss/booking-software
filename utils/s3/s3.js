import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  endpoint: process.env.NEXT_PUBLIC_AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file, filePath) => {
  const uploadCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: filePath,
    Body: file,
    ContentType: file.type,
  });

  try {
    const data = await client.send(uploadCommand);
    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${filePath}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
