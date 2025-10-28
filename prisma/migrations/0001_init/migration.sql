-- CreateTable
CREATE TABLE "Veiculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "placa" TEXT,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Frete" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "motoristaId" INTEGER,
    "viagemId" INTEGER,
    "data" DATETIME NOT NULL,
    "descricao" TEXT,
    "origem" TEXT,
    "destino" TEXT,
    "taxaValor" DECIMAL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataPagamento" DATETIME,
    "meioPagamento" TEXT,
    "valorTotal" DECIMAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashImportacao" TEXT,
    CONSTRAINT "Frete_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Frete_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Frete_viagemId_fkey" FOREIGN KEY ("viagemId") REFERENCES "Viagem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Abastecimento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "motoristaId" INTEGER,
    "viagemId" INTEGER,
    "data" DATETIME NOT NULL,
    "posto" TEXT,
    "litros" DECIMAL NOT NULL,
    "valorUnitario" DECIMAL,
    "valorTotal" DECIMAL,
    "kmAnterior" INTEGER,
    "kmAtual" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashImportacao" TEXT,
    CONSTRAINT "Abastecimento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Abastecimento_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Abastecimento_viagemId_fkey" FOREIGN KEY ("viagemId") REFERENCES "Viagem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "motoristaId" INTEGER,
    "data" DATETIME NOT NULL,
    "tipo" TEXT,
    "descricao" TEXT,
    "custo" DECIMAL,
    "kmAtual" INTEGER,
    "kmProximaTroca" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashImportacao" TEXT,
    CONSTRAINT "Manutencao_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Manutencao_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Despesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "motoristaId" INTEGER,
    "viagemId" INTEGER,
    "data" DATETIME NOT NULL,
    "categoria" TEXT,
    "descricao" TEXT,
    "valor" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "dataPagamento" DATETIME,
    "meioPagamento" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashImportacao" TEXT,
    CONSTRAINT "Despesa_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Despesa_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Despesa_viagemId_fkey" FOREIGN KEY ("viagemId") REFERENCES "Viagem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Motorista" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnh" TEXT NOT NULL,
    "validadeCnh" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Viagem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "veiculoId" INTEGER NOT NULL,
    "motoristaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Viagem_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Viagem_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "Motorista" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pneu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numSerie" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT,
    "dataCompra" DATETIME NOT NULL,
    "valorCompra" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MovimentacaoPneu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pneuId" INTEGER NOT NULL,
    "veiculoId" INTEGER,
    "data" DATETIME NOT NULL,
    "kmVeiculo" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "posicao" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MovimentacaoPneu_pneuId_fkey" FOREIGN KEY ("pneuId") REFERENCES "Pneu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MovimentacaoPneu_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataVencimento" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'motorista',
    "motoristaId" INTEGER,
    "refreshTokenHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "correlationId" TEXT,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_key" ON "Veiculo"("placa");

-- CreateIndex
CREATE INDEX "Veiculo_ativo_idx" ON "Veiculo"("ativo");

-- CreateIndex
CREATE UNIQUE INDEX "Frete_hashImportacao_key" ON "Frete"("hashImportacao");

-- CreateIndex
CREATE INDEX "Frete_veiculoId_data_idx" ON "Frete"("veiculoId", "data");

-- CreateIndex
CREATE INDEX "Frete_motoristaId_data_idx" ON "Frete"("motoristaId", "data");

-- CreateIndex
CREATE INDEX "Frete_viagemId_idx" ON "Frete"("viagemId");

-- CreateIndex
CREATE INDEX "Frete_status_idx" ON "Frete"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Abastecimento_hashImportacao_key" ON "Abastecimento"("hashImportacao");

-- CreateIndex
CREATE INDEX "Abastecimento_veiculoId_data_idx" ON "Abastecimento"("veiculoId", "data");

-- CreateIndex
CREATE INDEX "Abastecimento_motoristaId_data_idx" ON "Abastecimento"("motoristaId", "data");

-- CreateIndex
CREATE INDEX "Abastecimento_viagemId_idx" ON "Abastecimento"("viagemId");

-- CreateIndex
CREATE UNIQUE INDEX "Manutencao_hashImportacao_key" ON "Manutencao"("hashImportacao");

-- CreateIndex
CREATE INDEX "Manutencao_veiculoId_data_idx" ON "Manutencao"("veiculoId", "data");

-- CreateIndex
CREATE INDEX "Manutencao_kmProximaTroca_idx" ON "Manutencao"("kmProximaTroca");

-- CreateIndex
CREATE UNIQUE INDEX "Despesa_hashImportacao_key" ON "Despesa"("hashImportacao");

-- CreateIndex
CREATE INDEX "Despesa_veiculoId_data_idx" ON "Despesa"("veiculoId", "data");

-- CreateIndex
CREATE INDEX "Despesa_motoristaId_data_idx" ON "Despesa"("motoristaId", "data");

-- CreateIndex
CREATE INDEX "Despesa_viagemId_idx" ON "Despesa"("viagemId");

-- CreateIndex
CREATE INDEX "Despesa_status_idx" ON "Despesa"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Motorista_cpf_key" ON "Motorista"("cpf");

-- CreateIndex
CREATE INDEX "Viagem_veiculoId_dataInicio_idx" ON "Viagem"("veiculoId", "dataInicio");

-- CreateIndex
CREATE INDEX "Viagem_motoristaId_dataInicio_idx" ON "Viagem"("motoristaId", "dataInicio");

-- CreateIndex
CREATE UNIQUE INDEX "Pneu_numSerie_key" ON "Pneu"("numSerie");

-- CreateIndex
CREATE INDEX "Pneu_status_idx" ON "Pneu"("status");

-- CreateIndex
CREATE INDEX "MovimentacaoPneu_pneuId_data_idx" ON "MovimentacaoPneu"("pneuId", "data");

-- CreateIndex
CREATE INDEX "MovimentacaoPneu_veiculoId_data_idx" ON "MovimentacaoPneu"("veiculoId", "data");

-- CreateIndex
CREATE INDEX "MovimentacaoPneu_tipo_idx" ON "MovimentacaoPneu"("tipo");

-- CreateIndex
CREATE INDEX "Documento_dataVencimento_idx" ON "Documento"("dataVencimento");

-- CreateIndex
CREATE INDEX "Documento_veiculoId_dataVencimento_idx" ON "Documento"("veiculoId", "dataVencimento");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

