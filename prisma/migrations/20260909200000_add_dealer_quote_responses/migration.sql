CREATE TABLE "DealerQuoteResponse" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "cashPricePhp" DECIMAL(12,2),
    "downPaymentPhp" DECIMAL(12,2),
    "monthlyPhp" DECIMAL(12,2),
    "termMonths" INTEGER,
    "availability" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "dealerNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerQuoteResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DealerQuoteResponse_deliveryId_key" ON "DealerQuoteResponse"("deliveryId");
CREATE INDEX "DealerQuoteResponse_submittedAt_idx" ON "DealerQuoteResponse"("submittedAt");
ALTER TABLE "DealerQuoteResponse" ADD CONSTRAINT "DealerQuoteResponse_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "DealerLeadDelivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
