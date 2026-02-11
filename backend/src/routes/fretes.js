const express = require('express');
const prisma = require('../config/prisma');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

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

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { veiculoId } = req.params;
  const fretes = await prisma.frete.findMany({ where: { veiculoId: parseInt(veiculoId) } });
  res.json(fretes);
});

router.post('/', async (req, res) => {
  try {
    const { veiculoId } = req.params;
    const data = freteSchema.parse(req.body);
    const frete = await prisma.frete.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(frete);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
