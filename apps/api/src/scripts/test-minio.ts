import { config } from 'dotenv';
import { resolve } from 'path';
import { Client } from 'minio';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../../.env') });

async function testConnection(useSSL: boolean) {
  const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || ''
  });

  try {
    console.log(`Testing MinIO connection with useSSL=${useSSL}...`);
    console.log(`Endpoint: ${process.env.MINIO_ENDPOINT}`);
    console.log(`Port: ${process.env.MINIO_PORT}`);
    
    const exists = await minioClient.bucketExists(process.env.MINIO_BUCKET || 'test');
    console.log('Successfully connected to MinIO');
    console.log('Bucket exists:', exists);
    return true;
  } catch (error) {
    console.error(`Failed to connect with useSSL=${useSSL}:`, error);
    return false;
  }
}

async function main() {
  console.log('Testing MinIO connections...\n');
  
  // Try non-SSL first
  const nonSSLSuccess = await testConnection(false);
  if (nonSSLSuccess) {
    console.log('\nSuccessfully connected using non-SSL');
    process.exit(0);
  }

  console.log('\nTrying SSL connection...');
  // Try SSL if non-SSL failed
  const sslSuccess = await testConnection(true);
  if (sslSuccess) {
    console.log('\nSuccessfully connected using SSL');
    process.exit(0);
  }

  console.error('\nAll connection attempts failed');
  process.exit(1);
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 