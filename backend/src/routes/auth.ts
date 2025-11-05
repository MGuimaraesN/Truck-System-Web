import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';

const router = express.Router();

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not defined');
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
