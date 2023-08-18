import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDTO } from './DTOs/create-file.dto';
import { PrismaService } from '../prisma/prisma.service';
import { File } from '@prisma/client';

@Injectable()
export class FileDAO {
  constructor(private prismaService: PrismaService) {}

  async createFile(file: CreateFileDTO): Promise<File> {
    return this.prismaService.file.create({
      data: {
        ...file,
      },
    });
  }

  async findFileById(fileId: number): Promise<File> {
    const fileFromDb = await this.prismaService.file.findFirst({
      where: {
        id: fileId,
      },
    });

    if (!fileFromDb) {
      throw new NotFoundException();
    }

    return fileFromDb;
  }

  async deleteFile(fileId: number): Promise<void> {
    await this.findFileById(fileId);
    await this.prismaService.file.delete({
      where: { id: fileId },
    });
  }
}
