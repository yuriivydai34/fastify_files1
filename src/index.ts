import fastify from 'fastify'

const server = fastify()

import prisma from './client'

import * as minio from './minio'

server.get('/ping', async (request, reply) => {
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
  
  minio.main()
  
  return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})