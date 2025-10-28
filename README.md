# Frota Sapiens Monorepo

Sistema completo de gestão de frotas composto por API REST, painel administrativo web e worker de jobs em Node.js. O projeto atende aos requisitos de observabilidade, importação de planilhas Excel, autenticação JWT com RBAC e execução via Docker Compose.

## Estrutura do projeto

```
.
├── apps
│   ├── api      # Express + Prisma
│   ├── web      # React + Ant Design
│   └── worker   # Jobs com node-cron
├── prisma       # schema, migrations e seeds compartilhados
├── infra        # nginx reverse proxy
├── docker-compose.yml
└── README.md
```

## Pré-requisitos

* Node.js 20+
* Docker e Docker Compose

## Configuração

1. Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.
2. Coloque a planilha `Frete.xlsx` na pasta `data/input` (criada automaticamente pelo Docker compose).

## Executando com Docker

```bash
docker compose up --build
```

Serviços disponíveis:

* API: http://localhost:3000/api
* Documentação OpenAPI: http://localhost:3000/api/docs
* Painel Web: http://localhost:5173
* Prometheus metrics: http://localhost:3000/api/metrics

O volume `sqlite_data` mantém o banco SQLite em `/data/dev.db`.

## Scripts úteis (npm workspaces)

```bash
npm run dev            # docker compose up --build
npm run build          # build de todos os apps via turbo
npm run lint           # lint em todos os pacotes
npm run test           # testes unitários
npm run migrate        # aplica migrations prisma
npm run seed           # executa seeds
npm run import:excel -- --veiculo=1  # executa importador da planilha
```

### API (apps/api)

* `npm run dev --workspace api` – inicia API em modo watch.
* `npm run test --workspace api` – roda testes unitários.
* `npm run import:excel --workspace api -- --veiculo=1` – importa a planilha.

### Web (apps/web)

* `npm run dev --workspace web` – executa Vite no modo desenvolvimento.

### Worker (apps/worker)

* `npm run dev --workspace worker` – inicia cron jobs em modo watch.

## Importador Excel

O comando `npm run import:excel -- --veiculo=ID` lê `data/input/Frete.xlsx` e realiza o upsert dos dados de Fretes, Abastecimentos, Despesas e Manutenções. O script também backfill o campo `kmAnterior` conforme especificação.

## Migrations e Seeds

* Migrations localizadas em `prisma/migrations`.
* Script de seed em `apps/api/prisma/seed.ts` cria usuários padrão e dados de exemplo.

## Observabilidade

* Logs estruturados com Pino.
* Métricas Prometheus via `prom-client` em `/api/metrics`.
* Healthcheck em `/api/health` e readiness em `/api/readiness`.

## CI

Workflows GitHub Actions residem em `.github/workflows` (ci, build de imagens e deploy). **Certifique-se de configurar os segredos necessários antes de habilitar o pipeline.**

## Autenticação

* Login via `/api/auth/login` com JWT.
* Roles suportadas: `admin`, `gestor`, `financeiro`, `motorista`.

## Importante

* Não commit os arquivos `.env` com credenciais reais.
* Utilize `npm run lint` e `npm run test` antes de abrir PRs.
