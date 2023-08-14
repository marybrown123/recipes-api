import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDTO } from './DTOs/create-file.dto';
import { FileResponse } from './responses/file.response';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileDAO {
  constructor(private prismaService: PrismaService) {}

  async createFile(file: CreateFileDTO): Promise<FileResponse> {
    const fileFromDb = await this.prismaService.file.create({
      data: {
        ...file,
      },
    });

    return new FileResponse(fileFromDb);
  }

  async findFileById(fileId: number): Promise<FileResponse> {
    const fileFromDb = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!fileFromDb) {
      throw new NotFoundException();
    }

    return new FileResponse(fileFromDb);
  }

  async deleteFile(fileId: number): Promise<FileResponse> {
    await this.findFileById(fileId);
    const deletedFile = await this.prismaService.file.delete({
      where: { id: fileId },
    });
    return new FileResponse(deletedFile);
  }
}
