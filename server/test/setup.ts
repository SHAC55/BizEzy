// This file is loaded by bunfig.toml [test] preload BEFORE any test or service
// imports. It rewrites DATABASE_URL so that the production prisma client at
// server/config/db.ts connects to the test database instead.
//
// MUST be a pure side-effect import — no top-level awaits, no imports of code
// that would itself try to instantiate prisma.

import "dotenv/config";

if (!process.env.DATABASE_URL_TEST) {
  throw new Error(
    "DATABASE_URL_TEST is not set.\n" +
      "Create a Neon test branch (or separate test DB) and add the URL to server/.env.\n" +
      "See server/test/README.md for the one-time setup.",
  );
}

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

// Safety: refuse to run if the URL doesn't look like a test database.
const url = process.env.DATABASE_URL;
const looksLikeTest = /test|staging/i.test(url);
if (!looksLikeTest) {
  throw new Error(
    "DATABASE_URL_TEST does not contain 'test' or 'staging' in the URL.\n" +
      "Refusing to run tests against what might be production. Rename the DB or branch.",
  );
}
