import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../file.service';
import { CreateFileDTO } from '../../DTOs/create-file.dto';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { PrismaService } from '../../../prisma/prisma.service';
import { File } from '@prisma/client';

const file: CreateFileDTO = {
  name: 'testName',
  key: 'testKey',
};

describe('File Service', () => {
  let fileService: FileService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let prismaService: PrismaService;
  let testFile: File;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CqrsModule],
    }).compile();

    await module.createNestApplication().init();
    fileService = module.get<FileService>(FileService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    testFile = await fileService.createFile(file);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await prismaService.file.deleteMany();
  });

  it('should create new file', async () => {
    const commandBusExecuteCreate = jest.spyOn(commandBus, 'execute');

    const result = await fileService.createFile(file);

    expect(result.name).toBe('testName');
    expect(result.key).toBe('testKey');
    expect(commandBusExecuteCreate).toBeCalledTimes(1);
  });

  it('should find file by id', async () => {
    const queryBusExecuteFindById = jest.spyOn(queryBus, 'execute');

    const result = await fileService.findFileById(testFile.id);

    expect(result.name).toBe('testName');
    expect(result.key).toBe('testKey');
    expect(queryBusExecuteFindById).toBeCalledTimes(1);
  });

  it('should delete file', async () => {
    const commandBusExecuteDelete = jest.spyOn(commandBus, 'execute');

    const result = await fileService.deleteFile(testFile.id);

    expect(result.name).toBe('testName');
    expect(result.key).toBe('testKey');
    expect(commandBusExecuteDelete).toBeCalledTimes(1);
  });
});
