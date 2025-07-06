import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UserRole } from './enum/UserRole';

import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
@ApiTags('Portfolio')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.portfolioService.create(createPortfolioDto, userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user?.userId;
    return this.portfolioService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    return this.portfolioService.findOne(id, userId, userRole);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.portfolioService.update(id, updatePortfolioDto, userId);
  }
}
