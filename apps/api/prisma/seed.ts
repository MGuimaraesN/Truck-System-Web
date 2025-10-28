import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

const main = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const veiculo = await prisma.veiculo.upsert({
    where: { placa: 'ABC-1234' },
    update: {},
    create: {
      placa: 'ABC-1234',
      descricao: 'Cavalo Mecânico 6x2',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@frota.local' },
    update: {},
    create: {
      email: 'admin@frota.local',
      passwordHash,
      role: Role.admin,
    },
  });

  await prisma.user.upsert({
    where: { email: 'gestor@frota.local' },
    update: {},
    create: {
      email: 'gestor@frota.local',
      passwordHash,
      role: Role.gestor,
    },
  });

  const motorista = await prisma.motorista.upsert({
    where: { cpf: '12345678901' },
    update: {},
    create: {
      nome: 'João Motorista',
      cpf: '12345678901',
      cnh: 'MG1234567',
      validadeCnh: new Date('2026-12-31'),
    },
  });

  await prisma.viagem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      descricao: 'Viagem inaugural',
      dataInicio: new Date('2024-01-01'),
      veiculoId: veiculo.id,
      motoristaId: motorista.id,
    },
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
