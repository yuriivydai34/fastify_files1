import fastify, { FastifyServerOptions } from "fastify";
import sensible from "@fastify/sensible";
import fastifyStatic from "@fastify/static";
import { join } from "path";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

export const build = (opts?: FastifyServerOptions) => {
  const app = fastify({
    ...opts,
    bodyLimit: MAX_FILE_SIZE,
    maxParamLength: 100,
  });

  app.register(sensible);
  
  // Serve uploaded files statically
  app.register(fastifyStatic, {
    root: join(process.cwd(), "uploads"),
    prefix: "/uploads/",
    decorateReply: false
  });

  return app;
};
