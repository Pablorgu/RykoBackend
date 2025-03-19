import { IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class QueryDishDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    image?: string;

    @IsInt()
    @IsOptional()
    UserId?: number;
}
