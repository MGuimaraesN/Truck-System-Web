import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
      };
      correlationId?: string;
    }
  }
}

export {};
