export const tokenName = 'playground.token';
export const refreshTokenName = 'playground.refreshToken';
export const tokenConfiguration = {
  httpOnly: false,
  secure: true,
  sameSite: 'none',
  path: '/',
} as const;
