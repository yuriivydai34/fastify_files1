import { MultipartFile } from '@fastify/multipart';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../services/prismaClient'
import { deleteFile, uploadFile } from '../services/minio'
import { FastifyReply, FastifyRequest } from 'fastify';
import { MyRequest } from '../types';

exports.get = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const allFiles = await prisma.file.findMany()
    return allFiles;
  } catch (error) {
    throw error;
  }
};

exports.delete = async (request: MyRequest, reply: FastifyReply) => {
  try {
    const id: string = request.query.id;
    deleteFile(id);
    await prisma.file.deleteMany({ where: { name: id } })
    return 'Deleted ' + id;
  } catch (error) {
    throw error;
  }
};

exports.post = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data: MultipartFile | undefined = await request.file()
    let buffer;
    const filename = uuidv4();
    if (data?.type === 'file') {
      buffer = await data.toBuffer()
    }

    const result = await uploadFile(filename, buffer);

    //save to db
    const file = await prisma.file.create({
      data: {
        name: filename,
      },
    })

    return 'File uploaded as object ' + result.name + ' in bucket ' + result.bucket
  } catch (error) {
    throw error;
  }
};