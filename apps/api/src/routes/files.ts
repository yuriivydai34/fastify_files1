/// <reference types="node" />

import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import { deleteFileSchema, uploadFileSchema } from "schema";
import { randomUUID } from "crypto";
import { mkdir, readdir, unlink, stat } from "fs/promises";
import { writeFileSync } from "fs";
import { join } from "path";
import { env } from "../config/env";

const UPLOAD_DIR = join(process.cwd(), "uploads");
const BASE_URL = `http://${env.HOST}:${env.PORT}/uploads`;

// Ensure upload directory exists
const ensureUploadDir = async () => {
  await mkdir(UPLOAD_DIR, { recursive: true });
};

export const filesRouter = router({
  uploadFile: publicProcedure
    .input(uploadFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ensureUploadDir();
        const fileId = randomUUID();
        const filePath = join(UPLOAD_DIR, fileId);
        
        // Convert base64 to buffer and write to file
        const fileData = Buffer.from(input.file, 'base64');
        writeFileSync(filePath, fileData);
        
        const stats = await stat(filePath);
        
        const file = await ctx.prisma.file.create({
          data: {
            name: input.name,
            url: `${BASE_URL}/${fileId}`,
            size: stats.size,
          }
        });
        
        return {
          id: file.id,
          name: file.name,
          createdAt: file.createdAt,
          size: file.size,
          url: file.url
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload file",
          cause: error
        });
      }
    }),

  getFiles: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const files = await ctx.prisma.file.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        return files;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get files",
          cause: error
        });
      }
    }),

  deleteFile: publicProcedure
    .input(deleteFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const file = await ctx.prisma.file.findUnique({
          where: { id: input.id }
        });
        
        if (!file) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found"
          });
        }

        // Delete from filesystem
        const fileId = file.url?.split('/').pop();
        if (fileId) {
          const filePath = join(UPLOAD_DIR, fileId);
          await unlink(filePath);
        }

        // Delete from database
        await ctx.prisma.file.delete({
          where: { id: input.id }
        });

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
          cause: error
        });
      }
    })
}); 