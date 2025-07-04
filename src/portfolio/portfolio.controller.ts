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
import { Request } from 'express';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UserRole } from './enum/UserRole';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCENTE)
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @Req() req: RequestWithUser,
  ) {
    return this.portfolioService.create(createPortfolioDto, req.user.userId);
  }

  @Get()
  async findAll(@Req() req: RequestWithUser) {
    return this.portfolioService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.portfolioService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Req() req: RequestWithUser,
  ) {
    return this.portfolioService.update(
      id,
      updatePortfolioDto,
      req.user.userId,
    );
  }
}
