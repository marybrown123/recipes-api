import { S3Service } from 'src/recipe/s3.service';

export class S3ServiceMock implements Required<S3Service> {
  async uploadFileToS3(
    _bucket: string,
    _fileName: string,
    _file: Buffer,
  ): Promise<string> {
    return 'mockedURL';
  }
}
