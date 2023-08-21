import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../file.service';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { S3Service } from '../../s3.service';
import { S3ServiceMock } from '../mocks/s3.service.mock';
import { PrismaService } from '../../../prisma/prisma.service';

const fileName = 'testName';

describe('File Service', () => {
  let fileService: FileService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
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

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should create new file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    const result = await fileService.createFile(fileName);

    expect(result.name).toBe('testName');
    expect(commandBusExecute).toBeCalledTimes(1);

    await fileService.deleteFile(result.id);
  });

  it('should find file by id', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');
    const testFile = await fileService.createFile(fileName);

    const result = await fileService.findFileById(testFile.id);

    expect(result.name).toBe('testName');
    expect(queryBusExecute).toBeCalledTimes(1);

    await fileService.deleteFile(testFile.id);
  });

  it('should delete file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');
    const fileToDelete = await fileService.createFile(fileName);
    await fileService.deleteFile(fileToDelete.id);

    const deletedFile = await prismaService.file.findFirst({
      where: { id: fileToDelete.id },
    });

    expect(deletedFile).toBe(null);
    expect(commandBusExecute).toBeCalledTimes(2);
  });
});
