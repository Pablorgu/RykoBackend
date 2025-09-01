import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  Param,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './strategies/local.strategy';
import { RegisterLocalDto } from './dto/registerLocal.dto';
import { AuthGuard } from '@nestjs/passport';
import { BaseUser } from 'src/user/baseUser.entity';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth-guard';

function decodeState(raw?: string): { redirect_uri?: string } | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function isAllowedRedirect(uri: string) {
  const allow = (process.env.AUTH_REDIRECT_ALLOWLIST || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (process.env.DEFAULT_APP_REDIRECT)
    allow.push(process.env.DEFAULT_APP_REDIRECT);
  return allow.some((a) => uri.startsWith(a));
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

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
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    /* Passport automatically redirects to Google */
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') state?: string,
    @Query('redirect_uri') fallback?: string,
  ) {
    const user = req.user as BaseUser | undefined;
    if (!user)
      return res.status(401).json({ message: 'Usuario no autenticado' });

    const token = this.auth.tokenFor(user);

    let redirectUri =
      decodeState(state)?.redirect_uri ||
      fallback ||
      process.env.DEFAULT_APP_REDIRECT;

    if (!redirectUri) return res.status(400).send('Missing redirect_uri');

    if (!isAllowedRedirect(redirectUri)) {
      return res.status(400).send('Invalid redirect');
    }

    const url = new URL(redirectUri);
    url.searchParams.set('token', token);
    return res.redirect(url.toString());
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUserFromToken(@Req() req: any) {
    const userId = req.user.sub || req.user.id;
    return this.auth.getUserFromToken(userId);
  }
}
