import { Body, Controller, Post, UseGuards, Request, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./strategies/local.strategy";
import { RegisterLocalDto } from "./dto/registerLocal.dto";
import { AuthGuard } from "@nestjs/passport";
import { BaseUser } from "src/user/baseUser.entity";

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates the Google OAuth2 login flow
    // The user will be redirected to Google's login page
    // After successful authentication, the user will be redirected to the callback URL
  }


  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(
    @Req() req: Request & { user: BaseUser }
  ) {
    const user = req.user;
    return { access_token: this.auth.tokenFor(user) };
  }

}
