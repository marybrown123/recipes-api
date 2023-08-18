import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { FileService } from '../../file.service';
import { CreateFileDTO } from '../../DTOs/create-file.dto';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { File } from '@prisma/client';

const file: CreateFileDTO = {
  name: 'testName',
  key: 'testKey',
};

describe('File Service', () => {
  let fileService: FileService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let testFile: File;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CqrsModule],
    }).compile();

    await module.createNestApplication().init();
    fileService = module.get<FileService>(FileService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  beforeEach(async () => {
    testFile = await fileService.createFile(file);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await fileService.deleteFile(testFile.id);
  });

  it('should create new file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    const result = await fileService.createFile(file);

    expect(result.name).toBe('testName');
    expect(result.key).toBe('testKey');
    expect(commandBusExecute).toBeCalledTimes(1);
  });

  it('should find file by id', async () => {
    const queryBusExecute = jest.spyOn(queryBus, 'execute');

    const result = await fileService.findFileById(testFile.id);

    expect(result.name).toBe('testName');
    expect(result.key).toBe('testKey');
    expect(queryBusExecute).toBeCalledTimes(1);
  });

  it('should delete file', async () => {
    const commandBusExecute = jest.spyOn(commandBus, 'execute');

    await fileService.deleteFile(testFile.id);

    expect(commandBusExecute).toBeCalledTimes(1);
  });
});
