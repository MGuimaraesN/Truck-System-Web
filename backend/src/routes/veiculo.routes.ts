const express = require('express');
const router = express.Router();
const veiculoController = require('../controllers/veiculo.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Todas as rotas aqui são protegidas e requerem um token JWT válido
router.use(authMiddleware);

// @route   POST /api/veiculos
// @desc    Criar um novo veículo
router.post('/', veiculoController.create);

// @route   GET /api/veiculos
// @desc    Obter todos os veículos do utilizador logado
router.get('/', veiculoController.getAll);

// @route   GET /api/veiculos/:id
// @desc    Obter um veículo específico
router.get('/:id', veiculoController.getById);

// @route   PUT /api/veiculos/:id
// @desc    Atualizar um veículo
router.put('/:id', veiculoController.update);

// @route   DELETE /api/veiculos/:id
// @desc    Apagar um veículo
router.delete('/:id', veiculoController.delete);

module.exports = router;
