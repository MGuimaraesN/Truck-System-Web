import { Router } from 'express';

import { abastecimentosRouter } from './abastecimentos.routes';
import { alertasRouter } from './alertas.routes';
import { authRouter } from './auth.routes';
import { despesasRouter } from './despesas.routes';
import { documentosRouter } from './documentos.routes';
import { fretesRouter } from './fretes.routes';
import { dashboardsRouter } from './kpis.routes';
import { manutencoesRouter } from './manutencoes.routes';
import { motoristasRouter } from './motoristas.routes';
import { pneusRouter } from './pneus.routes';
import { veiculosRouter } from './veiculos.routes';
import { viagensRouter } from './viagens.routes';

const router = Router();

router.use('/abastecimentos', abastecimentosRouter);
router.use('/alertas', alertasRouter);
router.use('/auth', authRouter);
router.use('/despesas', despesasRouter);
router.use('/documentos', documentosRouter);
router.use('/fretes', fretesRouter);
router.use('/dashboards', dashboardsRouter);
router.use('/manutencoes', manutencoesRouter);
router.use('/motoristas', motoristasRouter);
router.use('/pneus', pneusRouter);
router.use('/veiculos', veiculosRouter);
router.use('/viagens', viagensRouter);

export { router };
