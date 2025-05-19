// CommonJs
const fastify = require('fastify')({
  logger: true
})

fastify.register(require('@fastify/websocket'))
fastify.register(async function (fastify) {
  fastify.get('/', { websocket: true }, (socket /* WebSocket */, req /* FastifyRequest */) => {
    socket.on('message', message => {
      // message.toString() === 'hi from client'
      socket.send('hi from server')
    })
  })
})

// Run the server!
fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})