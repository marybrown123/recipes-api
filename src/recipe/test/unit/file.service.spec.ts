import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../../recipe/file.service';
import { S3Service } from '../../../recipe/s3.service';
import { Readable } from 'stream';
import { S3ServiceMock } from '../../../recipe/test/mocks/s3.service.mock';

const mockedFile = {
  fieldname: 'file',
  originalname: 'example.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1,
  destination: '/tmp',
  filename: 'example_123.jpg',
  path: '/tmp/example_123.jpg',
  buffer: Buffer.from('...'),
  stream: new Readable(),
};

describe('File Service', () => {
  let fileService: FileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(S3Service)
      .useClass(S3ServiceMock)
      .compile();

    await module.createNestApplication().init();
    fileService = module.get<FileService>(FileService);
  });

  it('should upload image to s3', async () => {
    const result = await fileService.uploadFileToS3(mockedFile);

    expect(result).toBe('mockedKey');
  });
});
