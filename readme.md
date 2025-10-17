## Monolítico Node (FullCycle)

Aplicação monolítica em Node.js/TypeScript utilizando Express, Sequelize (com SQLite em memória), Jest e Umzug para migrações. O domínio é organizado em módulos (client-adm, product-adm, store-catalog, invoice, payment e checkout) e expõe algumas rotas HTTP para operações básicas.

### Sumário
- **O que é**
- **Requisitos**
- **Instalação**
- **Execução (dev)**
- **Variáveis de ambiente**
- **Banco de dados e migrações**
- **Testes**
- **Endpoints**
- **Estrutura de pastas (visão geral)**

## O que é
Projeto monolítico com arquitetura modular, APIs HTTP via Express e camada de persistência com Sequelize. O banco padrão é SQLite em memória (reiniciado a cada execução), adequado para testes e desenvolvimento rápido.

## Requisitos
- Node.js 16+ (recomendado 18+)
- npm 8+

## Instalação
```bash
npm install
```

## Execução (dev)
```bash
npm run start:dev
```
- O servidor inicia por padrão na porta `3000`.
- Você pode alterar a porta definindo `PORT` (ex.: `PORT=4000 npm run start:dev`).

## Variáveis de ambiente
Crie um arquivo `.env` na raiz (opcional):
```ini
PORT=3000
```

## Banco de dados e migrações
- ORM: Sequelize (via `sequelize-typescript`).
- Banco: SQLite em memória (valor `storage: ":memory:"`). Cada execução começa com um banco vazio.

Migrações são gerenciadas pelo Umzug através do wrapper `migrate.js`:
```bash
# aplicar migrações pendentes
node migrate.js up

# reverter a última migração
node migrate.js down

# criar um arquivo de migração (utiliza template padrão)
node migrate.js create --name minha-migracao
```
Observação: Para persistência em arquivo, ajuste `storage` em `src/infra/db/sequelize/config/umzug.ts` para apontar para um caminho físico (ex.: `storage: "./database.sqlite"`).

## Testes
```bash
npm test
```
Os testes utilizam Jest com `@swc/jest` para transformação de TypeScript.

## Endpoints
Base URL: `http://localhost:3000`

### Clientes
- **POST** `/clients`
  - Body JSON:
    ```json
    {
      "name": "Fulano",
      "email": "fulano@email.com",
      "state": "SP",
      "city": "São Paulo",
      "complement": "Apto 101",
      "document": "00000000000",
      "number": "100",
      "street": "Rua X",
      "zipCode": "00000-000"
    }
    ```

### Produtos
- **POST** `/products`
  - Body JSON:
    ```json
    {
      "name": "Camiseta",
      "description": "Camiseta 100% algodão",
      "purchasePrice": 50,
      "stock": 10
    }
    ```

### Faturas
- **GET** `/invoice/:id`

### Checkout
- **POST** `/checkout`
  - Body JSON (exemplo):
    ```json
    {
      "clientId": "<id-do-cliente>",
      "products": [
        { "productId": "<id-produto-1>" },
        { "productId": "<id-produto-2>" }
      ]
    }
    ```

## Estrutura de pastas (visão geral)
```
src/
  infra/
    api/
      server.ts        # inicialização do servidor
      express.ts       # criação do app Express e registro das rotas
      routes/          # rotas HTTP (clients, products, invoice, checkout)
    db/
      sequelize/
        config/umzug.ts   # configuração do Sequelize/Umzug
        migrations/       # migrações
        template/         # template para novas migrações
  modules/
    @shared/             # entidades base e contratos
    client-adm/          # módulo de clientes
    product-adm/         # módulo de produtos (admin)
    store-catalog/       # catálogo de loja
    invoice/             # faturas
    payment/             # pagamentos
    checkout/            # orquestração do pedido
```

## Scripts úteis
```json
{
  "start:dev": "nodemon src/infra/api/server.ts",
  "test": "npm run tsc -- --noEmit && jest",
  "tsc": "tsc"
}
```

---
Se algo não funcionar como esperado, verifique sua versão do Node/npm e se as dependências foram instaladas corretamente (`npm install`).
