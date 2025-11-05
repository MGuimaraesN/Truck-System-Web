import express, { Response } from 'express';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

const abastecimentoSchema = z.object({
  data: z.string().datetime(),
  posto: z.string(),
  cidade: z.string(),
  kmAtual: z.number().int(),
  valorDiesel: z.number(),
  litros: z.number(),
  valorTotal: z.number(),
});

// Get all abastecimentos for a veiculo
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const abastecimentos = await prisma.abastecimento.findMany({
      where: { veiculoId: parseInt(veiculoId) },
    });
    res.json(abastecimentos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new abastecimento
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const data = abastecimentoSchema.parse(req.body);
    const abastecimento = await prisma.abastecimento.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(abastecimento);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single abastecimento by id
router.get('/:abastecimentoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { abastecimentoId } = req.params;
    const abastecimento = await prisma.abastecimento.findUnique({
      where: { id: parseInt(abastecimentoId) },
    });
    if (!abastecimento) {
      return res.status(404).json({ error: 'Abastecimento not found' });
    }
    res.json(abastecimento);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an abastecimento
router.put('/:abastecimentoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { abastecimentoId } = req.params;
    const data = abastecimentoSchema.parse(req.body);
    const abastecimento = await prisma.abastecimento.update({
      where: { id: parseInt(abastecimentoId) },
      data,
    });
    res.json(abastecimento);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an abastecimento
router.delete('/:abastecimentoId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { abastecimentoId } = req.params;
    await prisma.abastecimento.delete({
      where: { id: parseInt(abastecimentoId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
