import { Body, Controller, Post, UseGuards, Get, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./strategies/local.strategy";
import { RegisterLocalDto } from "./dto/registerLocal.dto";
import { AuthGuard } from "@nestjs/passport";
import { BaseUser } from "src/user/baseUser.entity";
import { Request, Response } from 'express';

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
  login(@Req() req: any) {
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
  googleCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const token = this.auth.tokenFor(req.user as BaseUser);
    console.log(token);
    // return res.redirect(`ryko://auth?token=${token}`);
    return res.redirect(`https://auth.expo.io/@blose/RykoFrontend?token=${token}`);
  }
}
