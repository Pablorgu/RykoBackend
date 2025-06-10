import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) { super({ usernameField: 'email' }); }
  async validate(email: string, pass: string) {
    const user = await this.auth.validateLocal(email, pass);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    return user;
  }
}

export class LocalAuthGuard extends AuthGuard('local') { }
