-- AlterTable: SaleItem.productId becomes nullable, add serviceId
ALTER TABLE "SaleItem" DROP CONSTRAINT "SaleItem_productId_fkey";

ALTER TABLE "SaleItem" ALTER COLUMN "productId" DROP NOT NULL;

ALTER TABLE "SaleItem" ADD COLUMN "serviceId" TEXT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "category" TEXT,
    "costPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price" DOUBLE PRECISION NOT NULL,
    "durationMinutes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_businessId_idx" ON "Service"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_businessId_code_key" ON "Service"("businessId", "code");

-- CreateIndex
CREATE INDEX "SaleItem_serviceId_idx" ON "SaleItem"("serviceId");

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enforce exactly one of productId / serviceId is set on each SaleItem
ALTER TABLE "SaleItem" ADD CONSTRAINT "SaleItem_product_or_service_chk"
    CHECK (
        ("productId" IS NOT NULL AND "serviceId" IS NULL)
        OR ("productId" IS NULL AND "serviceId" IS NOT NULL)
    );
