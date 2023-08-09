import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../recipe/s3.service';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  async uploadFileToS3(file: Express.Multer.File): Promise<string> {
    const bucket =
      this.configService.get('S3_BUCKET_NAME') || 'recipe-api-images';
    try {
      const key = this.s3Service.generateS3Key(file.originalname);
      await this.s3Service.uploadFileToS3(bucket, key, file.buffer);
      return key;
    } catch (error) {
      return error.message;
    }
  }
}
