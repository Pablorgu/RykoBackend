import { IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateDishDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsUrl()
    image: string;

    @IsInt()
    @IsNotEmpty()
    UserId: number;
}
