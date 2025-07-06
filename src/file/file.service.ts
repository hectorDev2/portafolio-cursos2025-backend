import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { resolve, join } from 'path';

// Simple sanitize function to allow only safe filenames (alphanumeric, dash, underscore, dot)
function sanitize(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '');
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException('Could not read the file');
    }
  }
}
