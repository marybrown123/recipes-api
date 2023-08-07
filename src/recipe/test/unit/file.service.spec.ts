import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../../recipe/file.service';
import { S3Service } from '../../../recipe/s3.service';
import { Readable } from 'stream';

const mockedImageURL = 'testURL';

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
  let s3Service: S3Service;
  let fileService: FileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await module.createNestApplication().init();
    s3Service = module.get<S3Service>(S3Service);
    fileService = module.get<FileService>(FileService);
  });

  it('should upload image to s3', async () => {
    const s3ServiceUpload = jest
      .spyOn(s3Service, 'uploadFileToS3')
      .mockResolvedValue(mockedImageURL);

    const result = await fileService.uploadFileToS3(mockedFile);

    expect(result).toBe(mockedImageURL);
    expect(s3ServiceUpload).toBeCalledTimes(1);
  });
});
