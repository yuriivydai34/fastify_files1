import fastify, { FastifyInstance } from 'fastify'

const server: FastifyInstance = fastify()

import prisma from './client'

import { deleteFile, minioMain, uploadFile } from './minio'

import fastifyMultipart, { MultipartFile } from '@fastify/multipart'

import { v4 as uuidv4 } from 'uuid';

server.register(fastifyMultipart)

server.get('/ping', async (request, reply) => {  
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

  try {
    const result = await uploadFile(filename, buffer);

    //save to db
    const file = await prisma.file.create({
      data: {
        name: filename,
      },
    })
    console.log('file in db>>>>', file);  

    reply.send('File uploaded as object ' + result.name + ' in bucket ' + result.bucket)
  } catch (error) {
    reply.send(error);
  }

  
})

server.get('/files', async (request, reply) => {
  const allFiles = await prisma.file.findMany()
  reply.send(allFiles);
})

server.delete('/files', async (request: any, reply) => {
  const id: string = request.query.id;
  deleteFile(id);
  
  await prisma.file.deleteMany({where: {name: id}})
  
  reply.send('Deleted ' + id);
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})