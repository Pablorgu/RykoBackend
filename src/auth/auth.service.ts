import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseUser } from "src/user/baseUser.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(BaseUser)
    private repo: Repository<BaseUser>,
    private jwt: JwtService,
  ) { }

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
