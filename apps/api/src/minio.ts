import * as Minio from 'minio'

import 'dotenv/config'

export async function main() {
  const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_S3_ENDPOINT || '',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
  })

  // Destination bucket
  const bucket = process.env.MINIO_S3_BUCKET || ''

  const exists = await minioClient.bucketExists(bucket)
  if (exists) {
    console.log('Bucket ' + bucket + ' exists.')
  }
}