import { FastifyRequest } from "fastify"

export type MyRequest = FastifyRequest<{
  Querystring: { id: string }
}>