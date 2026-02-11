import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@test.com' },
  });

  if (!adminExists) {
    console.log('Admin user not found, seeding database...');
    const adminPassword = await bcrypt.hash('password', 10);
    const userPassword = await bcrypt.hash('password', 10);

    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: adminPassword,
        role: 'admin',
      },
    });

    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        password: userPassword,
        role: 'user',
      },
    });

    const veiculo1 = await prisma.veiculo.create({
      data: {
        placa: 'ABC-1234',
        modelo: 'Scania R450',
        ano: 2021,
        apelido: 'Caminhão Principal',
      },
    });

    const veiculo2 = await prisma.veiculo.create({
      data: {
        placa: 'DEF-5678',
        modelo: 'Volvo FH540',
        ano: 2022,
        apelido: 'Caminhão Secundário',
      },
    });

    await prisma.frete.create({
      data: {
        veiculoId: veiculo1.id,
        data: new Date(),
        origem: 'São Paulo',
        destino: 'Rio de Janeiro',
        valorBruto: 5000.0,
      },
    });

    await prisma.abastecimento.create({
      data: {
        veiculoId: veiculo1.id,
        data: new Date(),
        posto: 'Posto Ipiranga',
        cidade: 'São Paulo',
        kmAtual: 10000,
        valorDiesel: 5.5,
        litros: 200,
        valorTotal: 1100.0,
      },
    });

    await prisma.manutencao.create({
      data: {
        veiculoId: veiculo2.id,
        data: new Date(),
        descricao: 'Troca de óleo e filtros',
        km: 15000,
      },
    });

    await prisma.despesa.create({
      data: {
        veiculoId: veiculo2.id,
        data: new Date(),
        descricao: 'Pedágio',
        valor: 50.0,
      },
    });

    console.log('Database seeded successfully!');
  } else {
    console.log('Admin user already exists, skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
