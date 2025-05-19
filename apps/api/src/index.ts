import Fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import websocket, {WebSocket} from '@fastify/websocket'

const server: FastifyInstance = Fastify()

import cors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'

// bring in routes
const routes = require('./routes');

server.register(websocket)
server.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (socket: WebSocket, req: FastifyRequest) => {
    socket.on('message', message => {
      console.log(message.toString())
      socket.send('hi from server')
    })
  })
})

server.register(cors, {
  origin: '*',
  methods: '*'
})

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