import { IsOptional, IsInt } from 'class-validator';

export class QueryDayUserDto {
  @IsOptional()
  @IsInt()
  dayId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
