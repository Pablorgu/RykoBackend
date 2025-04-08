import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UserMealTypeService } from "./userMealType.service";
import { CreateUserMealTypeDto } from "./dto/createUserMealType.dto";
import { UserMealType } from "./userMealType.entity";
import { QueryUserMealTypeDto } from "./dto/queryUserMealType.dto";

@Controller('mealType')
export class UserMealTypeController {
  constructor(private readonly usermealTypeService: UserMealTypeService) { }

  @Post()
  async create(@Body() createMealTypeDto: CreateUserMealTypeDto): Promise<UserMealType> {
    return this.usermealTypeService.create(createMealTypeDto);
  }

  @Get()
  async findAll(): Promise<UserMealType[]> {
    return this.usermealTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserMealType | null> {
    return this.usermealTypeService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMealTypeDto: QueryUserMealTypeDto,
  ): Promise<UserMealType | null> {
    return this.usermealTypeService.update(id, updateMealTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<string> {
    return this.usermealTypeService.remove(id);
  }
}

