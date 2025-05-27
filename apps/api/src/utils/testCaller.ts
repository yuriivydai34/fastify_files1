import { testRouter } from "../routes";
import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export const createTestCaller = async () => {
  // Create mock request and response objects
  const mockReq = {} as FastifyRequest;
  const mockRes = {} as FastifyReply;

  const ctx = {
    req: mockReq,
    res: mockRes,
    prisma,
  };

  return testRouter.createCaller(ctx);
};
