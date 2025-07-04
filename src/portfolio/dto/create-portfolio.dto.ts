import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
  @IsString({ message: 'The title must be a string.' })
  @IsNotEmpty({ message: 'The title cannot be empty.' })
  @MaxLength(255, { message: 'The title cannot exceed 255 characters.' })
  title: string;

  @IsString({ message: 'The description must be a string.' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'The semester must be a string.' })
  @IsNotEmpty({ message: 'The semester cannot be empty.' })
  @MaxLength(50, { message: 'The semester cannot exceed 50 characters.' })
  semester: string;

  @IsString({ message: 'The course name must be a string.' })
  @IsNotEmpty({ message: 'The course name cannot be empty.' })
  @MaxLength(255, {
    message: 'The course name cannot exceed 255 characters.',
  })
  courseName: string;

  @IsString({ message: 'The course code must be a string.' })
  @IsOptional()
  @MaxLength(50, {
    message: 'The course code cannot exceed 50 characters.',
  })
  courseCode?: string;
}
