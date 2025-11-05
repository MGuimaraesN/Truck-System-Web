import express, { Response } from 'express';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

const manutencaoSchema = z.object({
  data: z.string().datetime(),
  descricao: z.string(),
  km: z.number().int(),
  kmProximaTroca: z.number().int().optional(),
});

// Get all manutencoes for a veiculo
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const manutencoes = await prisma.manutencao.findMany({
      where: { veiculoId: parseInt(veiculoId) },
    });
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new manutencao
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const data = manutencaoSchema.parse(req.body);
    const manutencao = await prisma.manutencao.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(manutencao);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single manutencao by id
router.get('/:manutencaoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { manutencaoId } = req.params;
    const manutencao = await prisma.manutencao.findUnique({
      where: { id: parseInt(manutencaoId) },
    });
    if (!manutencao) {
      return res.status(404).json({ error: 'Manutencao not found' });
    }
    res.json(manutencao);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a manutencao
router.put('/:manutencaoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { manutencaoId } = req.params;
    const data = manutencaoSchema.parse(req.body);
    const manutencao = await prisma.manutencao.update({
      where: { id: parseInt(manutencaoId) },
      data,
    });
    res.json(manutencao);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a manutencao
router.delete('/:manutencaoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { manutencaoId } = req.params;
    await prisma.manutencao.delete({
      where: { id: parseInt(manutencaoId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
