# v3

A Next.js app with Prisma 8 ORM and PostgreSQL.

## Run locally

1. Set up your `.env` file with your PostgreSQL database URL:
```bash
cp .env.example .env
```

2. Generate contract artifacts:
```bash
pnpm run contract:emit
```

3. Initialize database tables:
```bash
pnpm run db:init
```

4. Start development server:
```bash
pnpm run dev
```

## Prisma

- Contract: `prisma/contract.prisma`
- Prisma config: `prisma.config.ts`
- Database client: `prisma/db.ts`

After changing the contract, run:

```bash
pnpm run contract:emit
```
