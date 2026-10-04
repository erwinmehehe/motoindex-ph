ALTER TABLE "DealerLead"
ADD COLUMN "buyerAccessTokenHash" TEXT;

ALTER TABLE "DealerLeadDelivery"
ALTER COLUMN "deliveryToken" DROP NOT NULL,
ADD COLUMN "deliveryTokenHash" TEXT;

ALTER TABLE "PriceAlertSubscription"
ALTER COLUMN "unsubscribeToken" DROP NOT NULL;

CREATE UNIQUE INDEX "DealerLead_buyerAccessTokenHash_key" ON "DealerLead"("buyerAccessTokenHash");
CREATE UNIQUE INDEX "DealerLeadDelivery_deliveryTokenHash_key" ON "DealerLeadDelivery"("deliveryTokenHash");
