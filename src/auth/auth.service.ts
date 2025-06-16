import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseUser } from "src/user/baseUser.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RegisterLocalDto } from "./dto/registerLocal.dto";
import { UserService } from "src/user/user.service";
import { UserType } from "src/user/userType.enum";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>,
    private jwt: JwtService,
  ) { }

  async register(dto: RegisterLocalDto): Promise<{ access_token: string }> {
    const exist = await this.userService.findOneByEmail(dto.email)
    if (exist) throw new ConflictException('User already exists');

    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ ...dto, password: hash, type: UserType.USER });
    await this.repo.save(user);

    const token = this.tokenFor(user);
    return { access_token: token };
  }

  async validateLocal(email: string, pass: string) {
    const u = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email=:email', { email })
      .getOne();
    if (!u) return null;
    return (await bcrypt.compare(pass, u.password)) ? u : null;
  }

  tokenFor(u: BaseUser) {
    return this.jwt.sign({ sub: u.id, email: u.email, type: (u as any).type });
  }
}
