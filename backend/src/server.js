const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./config/prisma');
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const veiculosRoutes = require('./routes/veiculos');
const fretesRoutes = require('./routes/fretes');
const abastecimentosRoutes = require('./routes/abastecimentos');
const manutencoesRoutes = require('./routes/manutencoes');
const despesasRoutes = require('./routes/despesas');

app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculosRoutes);

// Nested routes
const veiculoRouter = express.Router();
veiculoRouter.use('/:veiculoId/fretes', fretesRoutes);
veiculoRouter.use('/:veiculoId/abastecimentos', abastecimentosRoutes);
veiculoRouter.use('/:veiculoId/manutencoes', manutencoesRoutes);
veiculoRouter.use('/:veiculoId/despesas', despesasRoutes);
app.use('/api/veiculos', veiculoRouter);

app.get('/', (req, res) => {
  res.send('Frota Sapiens API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
