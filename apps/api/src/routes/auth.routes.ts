import { Router } from 'express';
import { z } from 'zod';

import { authenticate } from '@/auth/middleware';
import { authenticateUser, refreshSession } from '@/services/auth.service';
import { serializeEntity } from '@/utils/serialization';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = credentialsSchema.parse(req.body);
    const auth = await authenticateUser(email, password);
    if (!auth) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: serializeEntity(auth.user),
    });
  } catch (error) {
    next(error);
  }
});

const refreshSchema = z.object({ refreshToken: z.string() });

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const session = await refreshSession(refreshToken);
    if (!session) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    return res.json({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: serializeEntity(session.user),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json({
    id: req.user.id,
    role: req.user.role,
  });
});

export { router as authRouter };
