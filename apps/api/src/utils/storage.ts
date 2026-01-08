import { Client as MinioClient } from 'minio';
import { config } from '../config';
import { logger } from './logger';
import { nanoid } from 'nanoid';

class StorageService {
  private client: MinioClient;
  private bucket: string;

  constructor() {
    this.client = new MinioClient({
      endPoint: config.minio.endpoint,
      port: config.minio.port,
      useSSL: config.minio.useSSL,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
    });
    this.bucket = config.minio.bucket;
  }

  async ensureBucket(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket);
        logger.info(`Created MinIO bucket: ${this.bucket}`);
      }
    } catch (error) {
      logger.error({ error }, 'Failed to ensure bucket exists');
      throw error;
    }
  }

  async uploadFile(buffer: Buffer, filename: string, mimeType: string): Promise<{ key: string; url: string }> {
    const key = `${nanoid()}/${filename}`;

    await this.client.putObject(this.bucket, key, buffer, buffer.length, {
      'Content-Type': mimeType,
    });

    const url = await this.getFileUrl(key);

    logger.info({ key, filename }, 'Uploaded file to storage');

    return { key, url };
  }

  async getFileUrl(key: string): Promise<string> {
    // Generate presigned URL (expires in 7 days)
    const url = await this.client.presignedGetObject(this.bucket, key, 7 * 24 * 60 * 60);
    return url;
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
    logger.info({ key }, 'Deleted file from storage');
  }

  async getFile(key: string): Promise<Buffer> {
    const chunks: Buffer[] = [];
    const stream = await this.client.getObject(this.bucket, key);

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}

export const storageService = new StorageService();
