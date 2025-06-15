// src/silabo/silabo.controller.ts
import 'multer';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UsePipes, // <--- Import UsePipes
  ValidationPipe, // <--- Import ValidationPipe
} from '@nestjs/common';
import { SilaboService } from './silabo.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/portafolio-de-cursos/enum/UserRole';
import { Request } from 'express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadSilaboDto } from './dto/upload-silabo.dto';
import { RolesGuard } from 'src/auth/roles.guard';

// Define an interface to extend the Express Request object with user info
interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard) // Apply guards to all routes in this controller
@Controller('silabos')
export class SilaboController {
  constructor(
    private readonly silaboService: SilaboService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ... (Your existing create, findAllByPortfolio, findOne, update, remove methods) ...

  @Post('upload')
  @Roles(UserRole.DOCENTE)
  @UseInterceptors(FileInterceptor('silaboFile', { storage: memoryStorage() }))
  @HttpCode(HttpStatus.CREATED)
  // Add this pipe to specifically handle multipart/form-data for files
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: false })) // <--- ADD THIS LINE
  async uploadSilabo(
    @Body() uploadSilaboDto: UploadSilaboDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType:
              'application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File, // This type should now be recognized
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new Error('No file uploaded.');
    }
    console.log('--- Debugging File Buffer ---');
    console.log('Original filename:', file.originalname);
    console.log('Mime type:', file.mimetype);
    console.log('File size (bytes):', file.size);
    console.log('Buffer length:', file.buffer.length); // IMPORTANT: Check if this matches file.size
    // Optional: Save the buffer to a temporary file locally to verify its content
    // You'll need Node.js 'fs' module for this.
    // import * as fs from 'fs'; (add at the top of the file)
    // fs.writeFileSync(`temp_upload_${file.originalname}`, file.buffer);
    console.log('-----------------------------');

    try {
      const cloudinaryResult = await this.cloudinaryService.uploadFile(
        file,
        'portafolios/silabos',
        'raw',
      );

      const contentUrl = cloudinaryResult.secure_url;

      // Note: Here you're passing uploadSilaboDto.portfolioId and uploadSilaboDto.version,
      // but the createSilaboDto also expects contentUrl. Make sure your
      // createSilaboDto type aligns with what's being passed.
      // If CreateSilaboDto expects 'portfolioId', 'version', and 'contentUrl',
      // then you need to construct it like this:
      const fullCreateSilaboDto = {
        portfolioId: uploadSilaboDto.portfolioId,
        version: uploadSilaboDto.version,
        contentUrl: contentUrl,
      };

      return this.silaboService.create(fullCreateSilaboDto, req.user.userId);
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to Cloudinary.');
    }
  }
}
