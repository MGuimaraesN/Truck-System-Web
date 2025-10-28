import { parseISO } from 'date-fns';
import { Request } from 'express';

export const extractCommonFilters = (req: Request) => {
  const { from, to, veiculoId, motoristaId, viagemId } = req.query;
  return {
    from: typeof from === 'string' ? parseISO(from) : undefined,
    to: typeof to === 'string' ? parseISO(to) : undefined,
    veiculoId: veiculoId ? Number(veiculoId) : undefined,
    motoristaId: motoristaId ? Number(motoristaId) : undefined,
    viagemId: viagemId ? Number(viagemId) : undefined,
  };
};
