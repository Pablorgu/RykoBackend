import { IsInt } from 'class-validator';

export class CreateDayUserDto {
  @IsInt()
  dayId: number;

  @IsInt()
  userId: number;
}
