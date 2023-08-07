import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../recipe/s3.service';

@Injectable()
export class FileService {
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  async uploadFileToS3(file: Express.Multer.File) {
    const bucket =
      this.configService.get('S3_BUCKET_NAME') || 'recipe-api-images';
    try {
      return await this.s3Service.uploadFileToS3(
        bucket,
        file.originalname,
        file.buffer,
      );
    } catch (error) {
      return error.message;
    }
  }
}
