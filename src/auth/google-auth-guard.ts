import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

function encodeState(obj: unknown) {
  // URL-safe base64
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>() as any;
    const redirectUri =
      (req?.query?.redirect_uri as string) || process.env.DEFAULT_APP_REDIRECT!;
    const state = encodeState({ redirect_uri: redirectUri });

    return {
      session: false,
      state,
      scope: ['profile', 'email'],
    };
  }
}
