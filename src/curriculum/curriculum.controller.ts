import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/portfolio/enum/UserRole';
import { editFileName } from 'src/utils/file-upload.utils';

@ApiTags('Curriculum')
@Controller('curriculum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/curriculum',
        filename: editFileName,
      }),
    }),
  )
  create(
    @Body() createCurriculumDto: CreateCurriculumDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5 MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    const fileUrl = `/uploads/curriculum/${file.filename}`;
    return this.curriculumService.create(
      { ...createCurriculumDto, fileUrl },
      userId,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    const userId = req.user?.userId;
    return this.curriculumService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.curriculumService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCurriculumDto: UpdateCurriculumDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.curriculumService.update(id, updateCurriculumDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    return this.curriculumService.remove(id, userId);
  }
}
