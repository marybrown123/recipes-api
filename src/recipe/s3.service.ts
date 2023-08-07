import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  async uploadFileToS3(bucket: string, fileName: string, file: Buffer) {
    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file,
    };
    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);
    return `https://${bucket}.s3.${this.configService.getOrThrow(
      'AWS_S3_REGION',
    )}.amazonaws.com/${fileName}`;
  }
}
