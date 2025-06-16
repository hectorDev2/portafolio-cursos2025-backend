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
      storage: diskStorage({
        destination: './uploads/silabos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(
            new Error('Invalid file type. Only PDF documents are allowed.'),
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
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({
          //   // --- MODIFIED: Allow only application/pdf using RegExp ---
          //   fileType: /^application\/pdf$/,
          //   // --- END MODIFIED ---
          // }),
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

    // // --- TEMPORARY TEST: Manually write the buffer ---
    // const tempManualPath = `./uploads/silabos/temp_manual_${file.originalname}`;
    // try {
    //   fs.writeFileSync(tempManualPath, file.buffer);
    //   console.log(`Manually written temp file: ${tempManualPath}`);
    // } catch (writeError) {
    //   console.error(`Error manually writing file: ${writeError.message}`);
    // }
    // // --- END TEMPORARY TEST ---
    // Keep these logs; they confirm mimetype is correctly identified by Multer
    console.log('--- Deep Debugging FileTypeValidator ---');
    const expectedMimeRegex = /^application\/pdf$/;
    console.log(`Actual MIME type received (raw): "${file.mimetype}"`);
    console.log(`Length of actual MIME type: ${file.mimetype.length}`);
    console.log(
      `Expected MIME type regex (source): "${expectedMimeRegex.source}"`,
    );
    console.log(`Regex test result: ${expectedMimeRegex.test(file.mimetype)}`);
    console.log(
      `Direct string equality test: ${file.mimetype === 'application/pdf'}`,
    );
    console.log(
      'Actual MIME type character codes:',
      Array.from(file.mimetype).map((char) => char.charCodeAt(0)),
    );
    console.log(
      'Expected "application/pdf" character codes:',
      Array.from('application/pdf').map((char) => char.charCodeAt(0)),
    );
    console.log('--------------------------------------');

    const localFilePath = file.path; // This is the path Multer has already written the file to
    const contentUrl = `http://localhost:3000/${localFilePath}`; // Construct URL based on Multer's saved path

    if (!uploadSilaboDto.portfolioId || !uploadSilaboDto.version) {
      throw new Error('portfolioId and version are required.');
    }

    const fullCreateSilaboDto = {
      portfolioId: uploadSilaboDto.portfolioId as string,
      version: uploadSilaboDto.version as string,
      contentUrl: contentUrl,
    };

    return this.silaboService.create(fullCreateSilaboDto, req.user.userId);
  }
}
