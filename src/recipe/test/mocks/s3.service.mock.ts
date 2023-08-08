/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GetSignedUrlCommand } from '../../../common/enums/getSignedUrlCommand.enum';
import { S3Service } from '../../../recipe/s3.service';

const mockedUrl = 'mockedUrl';

export class S3ServiceMock implements Required<S3Service> {
  async fetchFileFromS3(_key: string, _bucket: string): Promise<string> {
    return mockedUrl;
  }
  generateS3Key(_fileName: string): string {
    return 'mockedKey';
  }
  async generatePresignedUrl(
    _bucket: string,
    _fileName: string,
    _command: GetSignedUrlCommand,
  ): Promise<string> {
    return mockedUrl;
  }
  async uploadFileToS3(
    _bucket: string,
    _fileName: string,
    _file: Buffer,
  ): Promise<string> {
    return mockedUrl;
  }
}
