const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

const prisma = new PrismaClient();
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

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { veiculoId } = req.params;
  const abastecimentos = await prisma.abastecimento.findMany({ where: { veiculoId: parseInt(veiculoId) } });
  res.json(abastecimentos);
});

router.post('/', async (req, res) => {
  try {
    const { veiculoId } = req.params;
    const data = abastecimentoSchema.parse(req.body);
    const abastecimento = await prisma.abastecimento.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(abastecimento);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
