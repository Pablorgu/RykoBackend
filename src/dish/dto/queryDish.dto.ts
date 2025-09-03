import { IsInt, IsOptional, IsString, IsUrl, ValidateIf } from "class-validator";

export class QueryDishDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @ValidateIf((o) => o.image !== '' && o.image != null)
    @IsUrl()
    @IsOptional()
    image?: string;

    @IsInt()
    @IsOptional()
    UserId?: number;
}
