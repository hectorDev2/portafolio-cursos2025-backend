import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  create(createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data: createFeedbackDto });
  }

  findAll() {
    return this.prisma.feedback.findMany();
  }

  findOne(id: string) {
    return this.prisma.feedback.findUnique({ where: { id } });
  }

  update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    return this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });
  }

  remove(id: string) {
    return this.prisma.feedback.delete({ where: { id } });
  }
}