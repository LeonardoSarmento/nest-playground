import { registerAs } from "@nestjs/config";

export const tokenName = 'playground.token';
export const refreshTokenName = 'playground.refreshToken';
export const tokenConfiguration = {
  httpOnly: false,
  secure: true,
  sameSite: 'none',
  path: '/',
} as const;

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SHA256,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TTL ?? '3600'),
    jwtRefreshTtl: Number(process.env.JWT_REFRESH_TTL ?? '86400'),
  };
});
