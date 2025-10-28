import bcrypt from 'bcryptjs';

import { signAccessToken, signRefreshToken } from '@/auth/token';
import { prisma } from '@/lib/prisma';

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return null;
  }

  const accessToken = signAccessToken({ sub: String(user.id), role: user.role });
  const refreshToken = signRefreshToken({ sub: String(user.id), role: user.role });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
    },
  });

  return { user, accessToken, refreshToken };
};

export const refreshSession = async (token: string) => {
  const users = await prisma.user.findMany({ where: { refreshTokenHash: { not: null } } });
  for (const user of users) {
    if (user.refreshTokenHash && (await bcrypt.compare(token, user.refreshTokenHash))) {
      const accessToken = signAccessToken({ sub: String(user.id), role: user.role });
      const refreshToken = signRefreshToken({ sub: String(user.id), role: user.role });
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshTokenHash: await bcrypt.hash(refreshToken, 10) },
      });
      return { user, accessToken, refreshToken };
    }
  }
  return null;
};
