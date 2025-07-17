
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, Req, ParseFilePipe, MaxFileSizeValidator, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto } from './dto/create-curriculum.dto';
import { UpdateCurriculumDto } from './dto/update-curriculum.dto';

import { ApiTags } from '@nestjs/swagger';

// Helper function to edit file name
const editFileName = (req: any, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = file.originalname.split('.').pop();
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  callback(null, `${name}-${uniqueSuffix}.${fileExtName}`);
};

@ApiTags('Curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Post()
  create(@Body() createCurriculumDto: CreateCurriculumDto) {
    return this.curriculumService.create(createCurriculumDto);
  }

  @Get()
  findAll() {
    return this.curriculumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.curriculumService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCurriculumDto: UpdateCurriculumDto) {
    return this.curriculumService.update(id, updateCurriculumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.curriculumService.remove(id);
  }
  


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
  async uploadCurriculum(
    @Param('portfolioId') portfolioId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.curriculumService.uploadCurriculum(portfolioId, userId, file);
  }

}
