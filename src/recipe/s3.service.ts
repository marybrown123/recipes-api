import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

  generateS3Key(fileName: string): string {
    return `${randomUUID()}-${fileName}`;
  }

  async generatePresignedUrl(bucket: string, key: string): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: key,
    };

    return getSignedUrl(this.s3Client, new GetObjectCommand(params), {
      expiresIn: 60,
    });
  }

  async uploadFileToS3(
    bucket: string,
    key: string,
    file: Buffer,
  ): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
    };
    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
  }

  async deleteFileFromS3(bucket: string, key: string): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }
}
