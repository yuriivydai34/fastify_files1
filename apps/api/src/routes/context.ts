import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { prisma } from "../lib/prisma";
// Reference required for compilation
import type fastify from "fastify";

// eslint-disable-next-line @typescript-eslint/require-await
export async function createContextInner() {
  return {
    prisma,
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const server = req.server;
  const contextInner = await createContextInner();

  return {
    ...contextInner,
    fastify: server,
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
export type InnerContext = inferAsyncReturnType<typeof createContextInner>;
