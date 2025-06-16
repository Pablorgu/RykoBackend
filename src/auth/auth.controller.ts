import { Body, Controller, Post, UseGuards, Request, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseUser } from "src/user/baseUser.entity";
import { LocalAuthGuard } from "./strategies/local.strategy";
import { RegisterLocalDto } from "./dto/registerLocal.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterLocalDto) {
    return this.auth.register(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return { access_token: this.auth.tokenFor(req.user) };
  }
}
