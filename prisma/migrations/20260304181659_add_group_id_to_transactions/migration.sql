-- DropIndex
DROP INDEX "Transactions_walletId_createdAt_idx";

-- CreateIndex
CREATE INDEX "Transactions_walletId_createdAt_groupId_idx" ON "Transactions"("walletId", "createdAt", "groupId");
