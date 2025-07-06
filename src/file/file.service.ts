
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { resolve, join } from 'path';
import * as sanitize from 'sanitize-filename';

@Injectable()
export class FileService {
  private readonly uploadsPath = resolve('./static-files');

  getFileStream(filename: string) {
    const sanitizedFilename = sanitize(filename);
    if (sanitizedFilename !== filename) {
      throw new NotFoundException('Invalid filename');
    }

    const filePath = join(this.uploadsPath, sanitizedFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    try {
      return createReadStream(filePath);
    } catch (error) {
      throw new InternalServerErrorException('Could not read the file');
    }
  }
}
