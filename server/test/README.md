# Server tests

Tests use `bun:test` (Bun's built-in Vitest-compatible runner) and run against
a real Postgres database — the same Prisma stack as production.

## One-time setup

1. **Create a test database.**

   On Neon: dashboard → your project → Branches → "Create branch" → name it
   `test`. Copy its connection string.

   (Any separate Postgres works — local Docker, another Neon project, etc.
   The URL must contain `test` or `staging` somewhere or the test suite
   refuses to run, as a safeguard against pointing at production.)

2. **Add to `server/.env`:**

   ```
   DATABASE_URL_TEST="postgresql://...your test branch...?sslmode=require"
   ```

3. **Apply the schema to the test database:**

   ```
   bun run test:setup
   ```

   This runs `prisma migrate deploy` against `DATABASE_URL_TEST`. Re-run it
   any time a new migration is added.

## Running tests

```
bun test                  # one-shot
bun test --watch          # watch mode
bun test test/sale-creation.test.ts   # single file
bun test -t "GST"         # by test-name pattern
```

## What's covered

| File | Area | Tests |
|---|---|---|
| `sale-totals.test.ts` | Canonical GST/discount formula (`utils/saleMath.ts`) | 9 |
| `sale-creation.test.ts` | `createSale` stock decrement, low-stock detection, rollback safety | 8 |
| `sale-payments.test.ts` | `createSalePayment` due math, status transitions, overpay rejection | 10 |
| `account-deletion.test.ts` | `deleteAccount` anonymization, session revocation, email reuse | 7 |

## How the test database is wired

- `bunfig.toml` preloads `test/setup.ts` before any test code runs.
- `setup.ts` rewrites `process.env.DATABASE_URL` to point at the test URL.
- All subsequent imports of `config/db` (production prisma) see the test URL.
- Each test calls `resetDatabase()` in `beforeEach` to truncate all tables
  with `RESTART IDENTITY CASCADE` — fully isolated state.

## Adding new tests

Use the factories in `test/factories.ts`:

```ts
import { resetDatabase, seedUserWithBusiness, seedProduct } from "./factories";

beforeEach(resetDatabase);

it("does something", async () => {
  const { user, business } = await seedUserWithBusiness();
  const product = await seedProduct(business.id, { quantity: 50 });
  // ...
});
```

If you need a model not covered by a factory, add one. Keep factories small
and one-purpose — don't pile features into them.

## Parity with mobile/web

`sale-totals.test.ts` tests the canonical formula in `server/utils/saleMath.ts`.
Mobile (`app/src/pages/AddSalePage.tsx`) and web (`client/src/pages/AddTransaction.jsx`)
currently inline the same arithmetic. If you ever change the formula on one
side, update all three or the tests will catch the server side immediately.
A future refactor could publish `saleMath.ts` as a shared package.
