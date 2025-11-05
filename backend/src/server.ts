import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth';
import veiculosRoutes from './routes/veiculos';
import fretesRoutes from './routes/fretes';
import abastecimentosRoutes from './routes/abastecimentos';
import manutencoesRoutes from './routes/manutencoes';
import despesasRoutes from './routes/despesas';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculosRoutes);

// Nested routes
const veiculoRouter = express.Router({ mergeParams: true });
veiculoRouter.use('/:veiculoId/fretes', fretesRoutes);
veiculoRouter.use('/:veiculoId/abastecimentos', abastecimentosRoutes);
veiculoRouter.use('/:veiculoId/manutencoes', manutencoesRoutes);
veiculoRouter.use('/:veiculoId/despesas', despesasRoutes);
app.use('/api/veiculos', veiculoRouter);


app.get('/', (req: Request, res: Response) => {
  res.send('Frota Sapiens API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
