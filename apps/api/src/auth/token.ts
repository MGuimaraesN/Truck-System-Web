import jwt from 'jsonwebtoken';

import { env } from '@/env';

interface TokenPayload {
  sub: string;
  role: string;
}

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m` });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: `${env.REFRESH_TOKEN_TTL_DAYS}d` });

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as TokenPayload;
