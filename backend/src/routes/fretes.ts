import express, { Response } from 'express';
import prisma from '../config/prisma';
import { z, ZodError } from 'zod';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router({ mergeParams: true });

const freteSchema = z.object({
  data: z.string().datetime(),
  notaFiscal: z.string().optional(),
  origem: z.string(),
  destino: z.string(),
  valorBruto: z.number(),
  comissao: z.number().optional(),
  pesoKg: z.number().optional(),
  observacoes: z.string().optional(),
});

// Get all fretes for a veiculo
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const fretes = await prisma.frete.findMany({
      where: { veiculoId: parseInt(veiculoId) },
    });
    res.json(fretes);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new frete
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { veiculoId } = req.params;
    const data = freteSchema.parse(req.body);
    const frete = await prisma.frete.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(frete);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single frete by id
router.get('/:freteId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { freteId } = req.params;
    const frete = await prisma.frete.findUnique({
      where: { id: parseInt(freteId) },
    });
    if (!frete) {
      return res.status(404).json({ error: 'Frete not found' });
    }
    res.json(frete);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a frete
router.put('/:freteId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { freteId } = req.params;
    const data = freteSchema.parse(req.body);
    const frete = await prisma.frete.update({
      where: { id: parseInt(freteId) },
      data,
    });
    res.json(frete);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a frete
router.delete('/:freteId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { freteId } = req.params;
    await prisma.frete.delete({
      where: { id: parseInt(freteId) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
