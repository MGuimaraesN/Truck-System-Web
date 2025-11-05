import express, { Response } from 'express';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

const despesaSchema = z.object({
  data: z.string().datetime(),
  descricao: z.string(),
  valor: z.number(),
});

// Get all despesas for a veiculo
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const despesas = await prisma.despesa.findMany({
      where: { veiculoId: parseInt(veiculoId) },
    });
    res.json(despesas);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new despesa
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const data = despesaSchema.parse(req.body);
    const despesa = await prisma.despesa.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(despesa);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single despesa by id
router.get('/:despesaId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { despesaId } = req.params;
    const despesa = await prisma.despesa.findUnique({
      where: { id: parseInt(despesaId) },
    });
    if (!despesa) {
      return res.status(404).json({ error: 'Despesa not found' });
    }
    res.json(despesa);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a despesa
router.put('/:despesaId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { despesaId } = req.params;
    const data = despesaSchema.parse(req.body);
    const despesa = await prisma.despesa.update({
      where: { id: parseInt(despesaId) },
      data,
    });
    res.json(despesa);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a despesa
router.delete('/:despesaId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { despesaId } = req.params;
    await prisma.despesa.delete({
      where: { id: parseInt(despesaId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
