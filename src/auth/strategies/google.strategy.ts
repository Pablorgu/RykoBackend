
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserType } from 'src/user/userType.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['profile', 'email'],
    });
  }



  async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function) {
    const email = profile.emails?.[0]?.value;
    console.log('Google profile:', profile);
    if (!email) {
      throw new Error('Google email is required');
    }
    const user = await this.authService.validateGoogleLogin({
      googleId: profile.id,
      email,
      username: profile.displayName,
    });
    done(null, user);
  }
}
