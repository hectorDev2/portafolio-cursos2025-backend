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
} from '@nestjs/common';
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
  @Roles(UserRole.DOCENTE) // Only DOCENTES can upload files
  @HttpCode(HttpStatus.CREATED) // 201 Created for successful upload
  @UseInterceptors(FileInterceptor('file')) // Assuming you're using multer for file uploads
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('File uploaded:', file);
    return {
      message: 'File uploaded successfully',
    };
    // Assuming the upload logic is handled in the service
    // return this.silaboService.uploadFile(createSilaboDto, req.user.userId);
  }
}
