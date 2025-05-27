import { Client } from 'minio';
import z from 'zod';

const minioEnvSchema = z.object({
  MINIO_ENDPOINT: z.string(),
  MINIO_PORT: z.coerce.number().int(),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_BUCKET: z.string()
});

const minioEnv = minioEnvSchema.parse(process.env);

export const minioClient = new Client({
  endPoint: minioEnv.MINIO_ENDPOINT,
  port: minioEnv.MINIO_PORT,
  useSSL: minioEnv.MINIO_USE_SSL,
  accessKey: minioEnv.MINIO_ACCESS_KEY,
  secretKey: minioEnv.MINIO_SECRET_KEY
});

export const MINIO_BUCKET = minioEnv.MINIO_BUCKET;

// Test MinIO connection
export const testMinioConnection = async () => {
  try {
    // Check if bucket exists
    const exists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET);
      console.log('Created MinIO bucket:', MINIO_BUCKET);
    }
    console.log('Successfully connected to MinIO');
    return true;
  } catch (error) {
    console.error('Failed to connect to MinIO:', error);
    return false;
  }
}; 