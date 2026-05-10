-- Add soft-delete column for accounts
ALTER TABLE "User" ADD COLUMN "archivedAt" TIMESTAMP(3);

-- Index helps quickly excluding archived users from auth lookups
CREATE INDEX "User_archivedAt_idx" ON "User"("archivedAt");
