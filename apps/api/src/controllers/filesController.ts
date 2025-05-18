import prisma from '../client'
import { deleteFile } from '../minio'

exports.get = async (request: any, reply: any) => {
  try {
    const allFiles = await prisma.file.findMany()
    return allFiles;
  } catch (error) {
    throw error;
  }
};

exports.delete = async (request: any, reply: any) => {
  try {
    const id: string = request.query.id;
    deleteFile(id);
    await prisma.file.deleteMany({ where: { name: id } })
    return 'Deleted ' + id;
  } catch (error) {
    throw error;
  }
};
