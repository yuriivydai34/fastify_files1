import fastify, { FastifyInstance } from 'fastify'

const server: FastifyInstance = fastify()

import prisma from './client'

import { minioMain } from './minio'

import fastifyMultipart, { MultipartFile } from '@fastify/multipart'

server.register(fastifyMultipart)

server.get('/ping', async (request, reply) => {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
  
  minioMain()
  
  return 'pong\n'
})

server.post('/upload', async (request, reply) => {
  const data: MultipartFile | undefined = await request.file()
  let buffer;
  if (data?.type === 'file') {
    console.log('filename>>>', data.filename);
    buffer = await data.toBuffer()
  }

  console.log('buffer>>>>', buffer);

  reply.send('file uploaded fine!')
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})