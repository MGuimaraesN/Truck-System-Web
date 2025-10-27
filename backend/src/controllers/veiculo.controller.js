const db = require('../config/database');
const { z } = require('zod');

const veiculoSchema = z.object({
  placa: z.string().min(7).max(8),
  apelido: z.string().optional(),
  modelo: z.string().min(2),
  ano: z.number().int().min(1950).max(new Date().getFullYear() + 1),
});

exports.create = async (req, res, next) => {
  try {
    const { placa, apelido, modelo, ano } = veiculoSchema.parse(req.body);
    const user_id = req.user.id;

    const placaExists = await db('veiculos').where({ placa }).first();
    if (placaExists) {
      return res.status(400).json({ message: 'Placa já registada.' });
    }

    const [newVeiculo] = await db('veiculos').insert({
      placa,
      apelido,
      modelo,
      ano,
      user_id
    }).returning('*');

    res.status(201).json(newVeiculo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validação falhou', errors: error.errors });
    }
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const veiculos = await db('veiculos').where({ user_id: req.user.id });
    res.json(veiculos);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const veiculo = await db('veiculos').where({ id, user_id: req.user.id }).first();

    if (!veiculo) {
      return res.status(404).json({ message: 'Veículo não encontrado.' });
    }

    res.json(veiculo);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = veiculoSchema.parse(req.body);

        const [updatedVeiculo] = await db('veiculos')
            .where({ id, user_id: req.user.id })
            .update(data)
            .returning('*');

        if (!updatedVeiculo) {
            return res.status(404).json({ message: 'Veículo não encontrado.' });
        }

        res.json(updatedVeiculo);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: 'Validação falhou', errors: error.errors });
        }
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedCount = await db('veiculos')
            .where({ id, user_id: req.user.id })
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Veículo não encontrado.' });
        }

        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
};
