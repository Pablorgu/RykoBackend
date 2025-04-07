import { InjectRepository } from "@nestjs/typeorm";
import { DayService } from "src/day/day.service";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { DayUser } from "./dayUser.entity";
import { Injectable } from "@nestjs/common";
import { CreateDayUserDto } from "./dto/createDayUser.dto";

@Injectable()
export class DayUserService {
  constructor(
    @InjectRepository(DayUser)
    private readonly dayUserRepository: Repository<DayUser>,
    private readonly dayService: DayService,
    private readonly userService: UserService,
  ) { }

  async create(createDayUserDTo: CreateDayUserDto): Promise<DayUser> {
    const { userId, dayId } = createDayUserDTo;

    // Searching the entities
    const user = await this.userService.findOneById(userId);
    const day = await this.dayService.findOneById(dayId);

    // Checking that the entities exist
    if (!user || !day) {
      throw new Error('User or Day not found');
    }

    // Creating the DayUser entity
    const dayUser = this.dayUserRepository.create({
      user,
      day,
    });

    return this.dayUserRepository.save(dayUser);
  }
  // Find all Days associated with a specific User
  async findByUserId(userId: number): Promise<DayUser[]> {
    return this.dayUserRepository.find({
      where: { user: { id: userId } }, // Access the id inside the related User entity
      relations: ['user', 'day'], // Load related entities if needed
    });
  }
  // Find all Users associated with a specific Day
  async findByDayId(dayId: number): Promise<DayUser[]> {
    return this.dayUserRepository.find({
      where: { day: { id: dayId } }, // Access the id inside the related Day entity
      relations: ['user', 'day'], // Load related entities if needed
    });
  }
  // Delete a DayUser entry
  async remove(id: number): Promise<string> {
    const result = await this.dayUserRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('DayUser not found');
    }
    return 'DayUser deleted successfully';
  }
}
