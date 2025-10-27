const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

const prisma = new PrismaClient();
const router = express.Router({ mergeParams: true });

const manutencaoSchema = z.object({
  data: z.string().datetime(),
  descricao: z.string(),
  km: z.number().int(),
  kmProximaTroca: z.number().int().optional(),
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { veiculoId } = req.params;
  const manutencoes = await prisma.manutencao.findMany({ where: { veiculoId: parseInt(veiculoId) } });
  res.json(manutencoes);
});

router.post('/', async (req, res) => {
  try {
    const { veiculoId } = req.params;
    const data = manutencaoSchema.parse(req.body);
    const manutencao = await prisma.manutencao.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(manutencao);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
