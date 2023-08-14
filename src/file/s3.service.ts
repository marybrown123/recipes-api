import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(private configService: ConfigService) {}

  generateKey(fileName: string): string {
    return `${randomUUID()}-${fileName}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileKey = this.generateKey(file.originalname);
    const params = {
      Bucket: 'recipe-api-images',
      Key: fileKey,
      Buffer: file,
    };
    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
    return fileKey;
  }

  async deleteFile(fileKey: string): Promise<void> {
    const params = {
      Bucket: 'recipe-api-images',
      Key: fileKey,
    };
    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }
}
