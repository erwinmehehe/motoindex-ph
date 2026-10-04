ALTER TABLE "DealerLead"
ADD COLUMN "buyerAccessTokenHash" TEXT;

ALTER TABLE "DealerLeadDelivery"
ALTER COLUMN "deliveryToken" DROP NOT NULL,
ALTER COLUMN "deliveryToken" DROP DEFAULT,
ADD COLUMN "deliveryTokenHash" TEXT;

ALTER TABLE "PriceAlertSubscription"
ALTER COLUMN "unsubscribeToken" DROP NOT NULL,
ADD COLUMN "confirmTokenHash" TEXT,
ADD COLUMN "unsubscribeTokenHash" TEXT;

CREATE UNIQUE INDEX "DealerLead_buyerAccessTokenHash_key" ON "DealerLead"("buyerAccessTokenHash");
CREATE UNIQUE INDEX "DealerLeadDelivery_deliveryTokenHash_key" ON "DealerLeadDelivery"("deliveryTokenHash");
CREATE UNIQUE INDEX "PriceAlertSubscription_confirmTokenHash_key" ON "PriceAlertSubscription"("confirmTokenHash");
CREATE UNIQUE INDEX "PriceAlertSubscription_unsubscribeTokenHash_key" ON "PriceAlertSubscription"("unsubscribeTokenHash");
