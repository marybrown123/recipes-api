import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileService } from '../file/file.service';
import { FileResponse } from '../file/responses/file.response';
import { S3Service } from '../file/s3.service';

@Controller('/file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new file' })
  @ApiCreatedResponse({ type: FileResponse })
  @ApiUnauthorizedResponse({ description: 'Not logged in' })
  async createFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponse> {
    const fileKey = await this.s3Service.uploadFile(file);
    return this.fileService.createFile({
      name: file.originalname,
      key: fileKey,
    });
  }
}
