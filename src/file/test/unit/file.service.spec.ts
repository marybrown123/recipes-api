import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../file.service';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { FileResponse } from '../../responses/file.response';
import { S3Service } from '../../s3.service';
import { S3ServiceMock } from '../mocks/s3.service.mock';
import { PrismaService } from '../../../prisma/prisma.service';

const fileName = 'testName';

describe('File Service', () => {
  let fileService: FileService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let testFile: FileResponse;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CqrsModule],
    })
      .overrideProvider(S3Service)
      .useClass(S3ServiceMock)
      .compile();

    await module.createNestApplication().init();
    fileService = module.get<FileService>(FileService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    testFile = await fileService.createFile(fileName);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prismaService.file.deleteMany();
  });

  it('should create new file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    const result = await fileService.createFile(fileName);

    expect(result.name).toBe('testName');
    expect(commandBusExecute).toBeCalledTimes(1);
  });

  it('should find file by id', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');

    const result = await fileService.findFileById(testFile.id);

    expect(result.name).toBe('testName');
    expect(queryBusExecute).toBeCalledTimes(1);
  });

  it('should delete file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    await fileService.deleteFile(testFile.id);

    expect(commandBusExecute).toBeCalledTimes(1);
  });
});
