import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { prisma } from "../lib/prisma";
import type { Context } from "./trpc";

// For testing purposes
export async function createContextInner() {
  return {
    prisma,
  };
}

export async function createContext({ req, res }: CreateFastifyContextOptions): Promise<Context> {
  const contextInner = await createContextInner();

  return {
    ...contextInner,
    req,
    res,
  };
}

export type InnerContext = Awaited<ReturnType<typeof createContextInner>>;
