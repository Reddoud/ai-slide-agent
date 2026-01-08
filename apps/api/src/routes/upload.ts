import { FastifyPluginAsync } from 'fastify';
import { storageService } from '../utils/storage';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/', async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        success: false,
        error: { code: 'NO_FILE', message: 'No file uploaded' },
      });
    }

    const buffer = await data.toBuffer();
    const { key, url } = await storageService.uploadFile(
      buffer,
      data.filename,
      data.mimetype
    );

    const asset = await prisma.asset.create({
      data: {
        filename: data.filename,
        mimeType: data.mimetype,
        size: buffer.length,
        storageKey: key,
        url,
      },
    });

    return { success: true, data: asset };
  });
};
