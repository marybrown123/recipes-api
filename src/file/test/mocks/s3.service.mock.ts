/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3Service } from '../../s3.service';

const mockedKey = 'mockedKey';
const mockedUrl = 'mockedUrl';

export class S3ServiceMock implements Required<S3Service> {
  async generatePresignedUrl(_fileKey: string): Promise<string> {
    return mockedUrl;
  }
  generateKey(_fileName: string): string {
    return mockedKey;
  }
  async uploadFile(_file: Express.Multer.File): Promise<string> {
    return mockedKey;
  }

  async deleteFile(_fileKey: string): Promise<void> {}
}
