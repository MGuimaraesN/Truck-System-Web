const express = require('express');
const prisma = require('../config/prisma');
const authMiddleware = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

const veiculoSchema = z.object({
  placa: z.string().min(7).max(8),
  modelo: z.string().optional(),
  ano: z.number().int().optional(),
  apelido: z.string().optional(),
});

// Get all veiculos
router.get('/', authMiddleware, async (req, res) => {
  const veiculos = await prisma.veiculo.findMany();
  res.json(veiculos);
});

// Get a single veiculo by id
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const veiculo = await prisma.veiculo.findUnique({ where: { id: parseInt(id) } });
  if (!veiculo) {
    return res.status(404).json({ error: 'Veiculo not found' });
  }
  res.json(veiculo);
});

// Create a new veiculo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = veiculoSchema.parse(req.body);
    const veiculo = await prisma.veiculo.create({ data });
    res.status(201).json(veiculo);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Update a veiculo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = veiculoSchema.parse(req.body);
    const veiculo = await prisma.veiculo.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(veiculo);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Delete a veiculo
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await prisma.veiculo.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});

module.exports = router;
