// src/silabo/silabo.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  Req,
  UseGuards,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SilaboService } from './silabo.service';
import { CreateSilaboDto } from './dto/create-silabo.dto';
import { UpdateSilaboDto } from './dto/update-silabo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/portafolio-de-cursos/enum/UserRole';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
  constructor(private readonly silaboService: SilaboService) {}

  @Post()
  @Roles(UserRole.DOCENTE) // Only DOCENTES can create silabos
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createSilaboDto: CreateSilaboDto,
    @Req() req: RequestWithUser,
  ) {
    return this.silaboService.create(createSilaboDto, req.user.userId);
  }

  @Get('portfolio/:portfolioId')
  @Roles(UserRole.ADMINISTRADOR, UserRole.DOCENTE, UserRole.EVALUADOR) // All roles can list silabos if authorized
  async findAllByPortfolio(
    @Param('portfolioId') portfolioId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.silaboService.findAllByPortfolio(
      portfolioId,
      req.user.userId,
      req.user.role,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMINISTRADOR, UserRole.DOCENTE, UserRole.EVALUADOR) // All roles can view a specific silabo if authorized
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.silaboService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @Roles(UserRole.DOCENTE) // Only DOCENTES can update silabos
  async update(
    @Param('id') id: string,
    @Body() updateSilaboDto: UpdateSilaboDto,
    @Req() req: RequestWithUser,
  ) {
    return this.silaboService.update(id, updateSilaboDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserRole.DOCENTE) // Only DOCENTES can delete silabos
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content for successful deletion
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    await this.silaboService.remove(id, req.user.userId);
  }

  @Post('upload')
  @Roles(UserRole.DOCENTE)
  @UseInterceptors(
    FileInterceptor('silaboFile', {
      // --- LOCAL STORAGE CONFIGURATION ---
      storage: diskStorage({
        // Destination where files will be stored
        destination: './uploads/silabos', // Create this folder in your project root
        // Custom filename to avoid collisions
        filename: (req, file, cb) => {
          // Generate a unique filename using timestamp and original extension
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      // --- END LOCAL STORAGE CONFIGURATION ---

      // Keep the file size and type validators
      fileFilter: (req, file, cb) => {
        // Manual file type validation because ParseFilePipe runs AFTER Multer accepts the file
        const allowedMimes = [
          'application/pdf',
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Invalid file type. Only PDFs and Word documents are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: false }))
  async uploadSilabo(
    @Body() uploadSilaboDto: UpdateSilaboDto,
    @UploadedFile(
      // Keep ParseFilePipe for strict validation after Multer stores the file
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // FileTypeValidator is less critical here as we have fileFilter in Multer config,
          // but keeping it adds an extra layer of validation.
          new FileTypeValidator({
            fileType:
              'application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new Error('No file uploaded.');
    }

    // The file is now saved locally, and `file.path` contains its path
    // Example path: "uploads/silabos/silaboFile-1701234567-890123.pdf"
    const localFilePath = file.path;

    // Create a URL that the frontend can use to access the file
    // Assumes your static files are served from /uploads
    const contentUrl = `http://localhost:3000/${localFilePath}`; // Adjust base URL as needed

    // No Cloudinary calls needed here anymore.

    const fullCreateSilaboDto = {
      portfolioId: uploadSilaboDto.portfolioId ?? '',
      version: uploadSilaboDto.version,
      contentUrl: contentUrl, // Store the local URL
    };

    return this.silaboService.create(fullCreateSilaboDto, req.user.userId);
  }
}
