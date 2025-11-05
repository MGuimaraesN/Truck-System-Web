import express, { Response } from 'express';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

const veiculoSchema = z.object({
  placa: z.string().min(7).max(7),
  modelo: z.string().optional(),
  ano: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  apelido: z.string().optional(),
});

// Get all veiculos for the logged-in user
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const veiculos = await prisma.veiculo.findMany({
      where: { userId: req.userId },
    });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new veiculo
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const data = veiculoSchema.parse(req.body);
    const veiculo = await prisma.veiculo.create({
      data: { ...data, userId: req.userId! },
    });
    res.status(201).json(veiculo);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single veiculo by id, including related data
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: parseInt(id),
        userId: req.userId,
      },
      include: {
        fretes: { orderBy: { data: 'desc' } },
        abastecimentos: { orderBy: { data: 'desc' } },
        manutencoes: { orderBy: { data: 'desc' } },
        despesas: { orderBy: { data: 'desc' } },
      },
    });

    if (!veiculo) {
      return res.status(404).json({ error: 'Veiculo not found' });
    }

    res.json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a veiculo
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = veiculoSchema.parse(req.body);

    const existingVeiculo = await prisma.veiculo.findFirst({
        where: {
            id: parseInt(id),
            userId: req.userId,
        },
    });

    if (!existingVeiculo) {
        return res.status(404).json({ error: 'Veiculo not found or you do not have permission to update it.' });
    }

    const veiculo = await prisma.veiculo.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(veiculo);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a veiculo
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingVeiculo = await prisma.veiculo.findFirst({
        where: {
            id: parseInt(id),
            userId: req.userId,
        },
    });

    if (!existingVeiculo) {
        return res.status(404).json({ error: 'Veiculo not found or you do not have permission to delete it.' });
    }

    await prisma.veiculo.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
