import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class FileService {
  private s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  constructor(private configService: ConfigService) {}

  async uploadFileToS3(fileName: string, file: Buffer) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file,
    };
    const command = new PutObjectCommand(params);
    try {
      await this.s3Client.send(command);
    } catch (error) {
      throw new ForbiddenException();
    }

    return `https://${params.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
  }
}
