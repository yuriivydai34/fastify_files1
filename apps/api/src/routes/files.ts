import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import { deleteFileSchema, uploadFileSchema } from "schema";
import { randomUUID } from "crypto";
import { mkdir, writeFile, readdir, unlink, stat } from "fs/promises";
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
    .mutation(async ({ input }) => {
      try {
        await ensureUploadDir();
        const fileId = randomUUID();
        const filePath = join(UPLOAD_DIR, fileId);
        
        await writeFile(filePath, input.file);
        
        const stats = await stat(filePath);
        
        return {
          id: fileId,
          name: input.name,
          createdAt: new Date(),
          size: stats.size,
          url: `${BASE_URL}/${fileId}`
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
    .query(async () => {
      try {
        await ensureUploadDir();
        const files = await readdir(UPLOAD_DIR);
        const fileInfos = await Promise.all(
          files.map(async (fileId) => {
            const filePath = join(UPLOAD_DIR, fileId);
            const stats = await stat(filePath);
            return {
              id: fileId,
              name: fileId, // In a real app, you'd store file names in a database
              createdAt: stats.birthtime,
              size: stats.size,
              url: `${BASE_URL}/${fileId}`
            };
          })
        );
        return fileInfos;
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
    .mutation(async ({ input }) => {
      try {
        const filePath = join(UPLOAD_DIR, input.id);
        await unlink(filePath);
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