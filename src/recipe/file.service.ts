import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../recipe/s3.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  generateS3Key(fileName: string) {
    const ex = fileName.split('.')[1];
    return `${randomUUID()}.${ex}`;
  }

  async uploadFileToS3(file: Express.Multer.File, key: string) {
    const bucket =
      this.configService.get('S3_BUCKET_NAME') || 'recipe-api-images';
    try {
      return await this.s3Service.uploadFileToS3(bucket, key, file.buffer);
    } catch (error) {
      return error.message;
    }
  }

  async fetchFileFromS3(key: string) {
    const bucket =
      this.configService.get('S3_BUCKET_NAME') || 'recipe-api-images';
    return this.s3Service.fetchFileFromS3(key, bucket);
  }
}
