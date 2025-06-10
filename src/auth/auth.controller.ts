import { Body, Controller, Post, UseGuards, Request, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseUser } from "src/user/baseUser.entity";
import { LocalAuthGuard } from "./strategies/local.strategy";
import * as bcrypt from "bcrypt";

interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    @InjectRepository(BaseUser) private repo: Repository<BaseUser>,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.repo.create({ ...dto, password: hash });
    await this.repo.save(user);
    return { access_token: this.auth.tokenFor(user) };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return { access_token: this.auth.tokenFor(req.user) };
  }
}
