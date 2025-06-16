import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserType } from 'src/user/userType.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    const options = {
      clientID: config.get<string>('google.clientID'),
      clientSecret: config.get<string>('google.clientSecret'),
      callbackURL: config.get<string>('google.callbackURL'),
    } as StrategyOptions;

    super(options);
  }

  async validate(
    profile: any,
    done: VerifyCallback,
  ) {
    const { id: googleId, emails, displayName: username } = profile;
    const email = emails[0].value;
    const user = await this.authService.validateGoogleLogin({ googleId, email, username, userType: UserType.USER });
    done(null, user);
  }
}
