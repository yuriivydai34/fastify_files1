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

// Parse and validate environment variables
const minioEnv = (() => {
  try {
    return minioEnvSchema.parse(process.env);
  } catch (error) {
    console.error('MinIO configuration error:', error);
    if (error instanceof z.ZodError) {
      console.error('Missing or invalid MinIO environment variables. Please check your .env file contains all required variables:');
      console.error('Required variables:', Object.keys(minioEnvSchema.shape).join(', '));
    }
    throw new Error('Invalid MinIO configuration. Check your .env file.');
  }
})();

// Force SSL off for local development
const useSSL = false; // Override any env setting for now

console.log('Initializing MinIO client with config:', {
  endPoint: minioEnv.MINIO_ENDPOINT,
  port: minioEnv.MINIO_PORT,
  useSSL,
  bucket: minioEnv.MINIO_BUCKET,
  accessKeyLength: minioEnv.MINIO_ACCESS_KEY.length,
  secretKeyLength: minioEnv.MINIO_SECRET_KEY.length
});

export const minioClient = new Client({
  endPoint: minioEnv.MINIO_ENDPOINT,
  port: minioEnv.MINIO_PORT,
  useSSL,
  accessKey: minioEnv.MINIO_ACCESS_KEY,
  secretKey: minioEnv.MINIO_SECRET_KEY
});

export const MINIO_BUCKET = minioEnv.MINIO_BUCKET;

// Test MinIO connection and ensure bucket exists
export const initializeMinIO = async () => {
  try {
    console.log('Testing MinIO connection...');
    console.log(`Attempting to connect to ${minioEnv.MINIO_ENDPOINT}:${minioEnv.MINIO_PORT} (SSL: ${useSSL})`);
    
    // Test connection by checking if bucket exists
    const exists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!exists) {
      console.log(`Bucket "${MINIO_BUCKET}" does not exist, creating it...`);
      await minioClient.makeBucket(MINIO_BUCKET);
      console.log('Bucket created successfully');
    } else {
      console.log(`Bucket "${MINIO_BUCKET}" exists`);
    }
    
    console.log('MinIO connection successful!');
    return true;
  } catch (error) {
    console.error('MinIO initialization error details:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        code: (error as any).code,
        syscall: (error as any).syscall
      } : error,
      config: {
        endpoint: minioEnv.MINIO_ENDPOINT,
        port: minioEnv.MINIO_PORT,
        useSSL,
        bucket: MINIO_BUCKET
      }
    });
    throw error;
  }
};

// Initialize MinIO when this module is imported
initializeMinIO().catch(error => {
  console.error('Failed to initialize MinIO:', error);
  process.exit(1);
}); 