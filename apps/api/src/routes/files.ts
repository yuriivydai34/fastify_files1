/// <reference types="node" />

import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "./trpc";
import { deleteFileSchema, uploadFileSchema } from "schema";
import { randomUUID } from "crypto";
import { minioClient, MINIO_BUCKET } from "../config/minio";

// Helper function to generate presigned URL with expiry
const getPresignedUrl = async (objectName: string) => {
  try {
    // Generate URL that expires in 24 hours
    return await minioClient.presignedGetObject(MINIO_BUCKET, objectName, 24 * 60 * 60);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return null;
  }
};

// Helper function to extract object name from URL
const getObjectNameFromUrl = (url: string | null): string | null => {
  if (!url) return null;
  try {
    // Extract the last part of the URL path as the object name
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1];
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};

export const filesRouter = router({
  uploadFile: publicProcedure
    .input(uploadFileSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const fileId = randomUUID();
        const fileBuffer = Buffer.from(input.file, 'base64');
        const contentType = input.type || 'application/octet-stream';
        
        console.log('Attempting file upload:', {
          fileId,
          contentType,
          size: fileBuffer.length,
          bucket: MINIO_BUCKET
        });

        // Upload to MinIO
        await minioClient.putObject(
          MINIO_BUCKET,
          fileId,
          fileBuffer,
          fileBuffer.length,
          { 'Content-Type': contentType }
        );

        console.log('File uploaded successfully to MinIO');

        // Get the URL for the uploaded file
        const fileUrl = await getPresignedUrl(fileId);
        if (!fileUrl) {
          throw new Error('Failed to generate presigned URL');
        }

        console.log('Generated presigned URL for file');
        
        // Save file metadata to database
        const file = await ctx.prisma.file.create({
          data: {
            name: input.name,
            url: fileUrl,
            size: fileBuffer.length,
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
        console.error('File upload error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? 
            `Failed to upload file: ${error.message}` : 
            "Failed to upload file",
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

        // Update presigned URLs for all files
        const updatedFiles = await Promise.all(
          files.map(async (file) => {
            const objectName = getObjectNameFromUrl(file.url);
            if (!objectName) {
              console.warn(`Could not extract object name from URL for file ${file.id}`);
              return file;
            }

            const newUrl = await getPresignedUrl(objectName);
            return {
              ...file,
              url: newUrl || file.url // fallback to old URL if generation fails
            };
          })
        );
        
        return updatedFiles;
      } catch (error) {
        console.error('Get files error:', error);
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
        console.log('Attempting to delete file:', input.id);

        const file = await ctx.prisma.file.findUnique({
          where: { id: input.id }
        });
        
        if (!file) {
          console.log('File not found in database:', input.id);
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "File not found"
          });
        }

        // Extract object name from URL
        const objectName = getObjectNameFromUrl(file.url);
        if (!objectName) {
          console.error('Could not extract object name from URL:', file.url);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Invalid file URL format"
          });
        }

        console.log('Deleting object from MinIO:', {
          bucket: MINIO_BUCKET,
          objectName
        });

        // Delete from MinIO
        await minioClient.removeObject(MINIO_BUCKET, objectName);
        console.log('File deleted from MinIO successfully');

        // Delete from database
        await ctx.prisma.file.delete({
          where: { id: input.id }
        });
        console.log('File record deleted from database');

        return { success: true };
      } catch (error) {
        console.error('Delete file error:', error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? 
            `Failed to delete file: ${error.message}` : 
            "Failed to delete file",
          cause: error
        });
      }
    })
}); 