import fastify, { FastifyInstance } from 'fastify'

const server: FastifyInstance = fastify()

import fastifyMultipart from '@fastify/multipart'

// bring in routes
const routes = require('./routes');

server.register(fastifyMultipart)

server.get('/ping', async (request, reply) => {
  return 'pong\n'
})

routes.forEach((route: any) => {
  server.route(route);
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})