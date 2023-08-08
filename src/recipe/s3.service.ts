import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GetSignedUrlCommand } from '../common/enums/getSignedUrlCommand.enum';

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

  async generatePresignedUrl(
    bucket: string,
    key: string,
    command: GetSignedUrlCommand,
  ) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    if (command === GetSignedUrlCommand.PUT) {
      return getSignedUrl(this.s3Client, new PutObjectCommand(params), {
        expiresIn: 60,
      });
    } else if (command === GetSignedUrlCommand.GET) {
      return getSignedUrl(this.s3Client, new GetObjectCommand(params), {
        expiresIn: 60,
      });
    }
  }

  async uploadFileToS3(bucket: string, key: string, file: Buffer) {
    const signedUrl = await this.generatePresignedUrl(
      bucket,
      key,
      GetSignedUrlCommand.PUT,
    );

    await axios({
      method: 'put',
      url: signedUrl,
      data: file,
      headers: {
        'Content-Type': 'image/jpg',
      },
    });

    return signedUrl;
  }

  async fetchFileFromS3(key: string, bucket: string) {
    return this.generatePresignedUrl(bucket, key, GetSignedUrlCommand.GET);
  }
}
