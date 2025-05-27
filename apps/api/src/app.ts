import fastify, { FastifyServerOptions } from "fastify";
import sensible from "@fastify/sensible";
import fastifyStatic from "@fastify/static";
import { join } from "path";

export const build = (opts?: FastifyServerOptions) => {
  const app = fastify(opts);

  app.register(sensible);
  
  // Serve uploaded files statically
  app.register(fastifyStatic, {
    root: join(process.cwd(), "uploads"),
    prefix: "/uploads/",
    decorateReply: false
  });

  return app;
};
