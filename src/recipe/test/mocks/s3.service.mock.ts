/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3Service } from '../../../recipe/s3.service';

const mockedUrl = 'mockedUrl';

export class S3ServiceMock implements Required<S3Service> {
  async deleteFileFromS3(_bucket: string, _key: string): Promise<void> {}

  async fetchFileFromS3(_key: string, _bucket: string): Promise<string> {
    return mockedUrl;
  }

  generateS3Key(_fileName: string): string {
    return 'mockedKey';
  }

  async generatePresignedUrl(_bucket: string, _key: string): Promise<string> {
    return mockedUrl;
  }

  async uploadFileToS3(
    _bucket: string,
    _key: string,
    _file: Buffer,
  ): Promise<void> {}
}
