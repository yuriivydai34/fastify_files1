import * as Minio from 'minio'

import 'dotenv/config'

export async function minioMain() {
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
  } else {
    await minioClient.makeBucket(bucket);
  }
}

export async function uploadFile(name: string, file: any) {
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
  } else {
    await minioClient.makeBucket(bucket);
  }

  await minioClient.putObject(bucket, name, file, 1234, function (err: Error, objInfo: any) {
    if (err) {
      throw err;
    }
    console.log('Success', objInfo.etag, objInfo.versionId)
  })

  return {name, bucket}
}

export async function getFiles() {
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
  } else {
    await minioClient.makeBucket(bucket);
  }

  //get files!!! list???
}

export async function deleteFile(id: string) {
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
  } else {
    await minioClient.makeBucket(bucket);
  }

  minioClient.removeObject(bucket, id);

  return id;
}