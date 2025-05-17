import fastify, { FastifyInstance } from 'fastify'

const server: FastifyInstance = fastify()

import prisma from './client'

import { minioMain, uploadFile } from './minio'

import fastifyMultipart, { MultipartFile } from '@fastify/multipart'

import { v4 as uuidv4 } from 'uuid';

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
  const filename = uuidv4();
  if (data?.type === 'file') {
    buffer = await data.toBuffer()
  }

  const result = await uploadFile(filename, buffer);

  reply.send(result)
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})