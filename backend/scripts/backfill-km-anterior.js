const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const veiculos = await prisma.veiculo.findMany({
      select: { id: true },
      where: { ativo: true }
    });

    for (const { id: veiculoId } of veiculos) {
      const abs = await prisma.abastecimento.findMany({
        where: { veiculoId },
        orderBy: { data: 'asc' },
        select: { id: true, kmAtual: true, kmAnterior: true }
      });

      let prevKm = null;
      for (const a of abs) {
        if (prevKm !== null && (a.kmAnterior === null || a.kmAnterior === undefined)) {
          await prisma.abastecimento.update({
            where: { id: a.id },
            data: { kmAnterior: prevKm }
          });
        }
        prevKm = a.kmAtual;
      }
    }

    console.log('✅ Backfill de kmAnterior concluído.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no backfill:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
