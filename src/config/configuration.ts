export default () => {
  const portStr = process.env.PORT ?? '3000';
  return {
    port: parseInt(portStr, 10),
    jwt: {
      secret: process.env.JWT_SECRET ?? 'changeme',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    },
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL ?? '',
    },
  };
};
