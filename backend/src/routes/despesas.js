const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

const prisma = new PrismaClient();
const router = express.Router({ mergeParams: true });

const despesaSchema = z.object({
  data: z.string().datetime(),
  descricao: z.string(),
  valor: z.number(),
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { veiculoId } = req.params;
  const despesas = await prisma.despesa.findMany({ where: { veiculoId: parseInt(veiculoId) } });
  res.json(despesas);
});

router.post('/', async (req, res) => {
  try {
    const { veiculoId } = req.params;
    const data = despesaSchema.parse(req.body);
    const despesa = await prisma.despesa.create({
      data: { ...data, veiculoId: parseInt(veiculoId) },
    });
    res.status(201).json(despesa);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
