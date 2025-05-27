import { initTRPC } from '@trpc/server';
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../lib/prisma';
import superjson from 'superjson';
import { ZodError } from 'zod';

export type Context = {
  req: FastifyRequest;
  res: FastifyReply;
  prisma: typeof prisma;
};

export const createContext = async ({ req, res }: CreateFastifyContextOptions): Promise<Context> => {
  return {
    req,
    res,
    prisma,
  };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const _testRouter = t.router;