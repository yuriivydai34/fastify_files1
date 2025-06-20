import * as z from "zod";

export const uploadFileSchema = z.object({
  name: z.string(),
  file: z.string(),
  type: z.string().optional()
});

export const deleteFileSchema = z.object({
  id: z.number(),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;

export type FileInfo = {
  id: number;
  name: string;
  createdAt: Date;
  size: number | null;
  url: string | null;
}; 