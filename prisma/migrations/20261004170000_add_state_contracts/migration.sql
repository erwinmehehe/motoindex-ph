-- Enforce known application state contracts for new/updated rows without
-- blocking deployment on historical rows that may predate these contracts.
ALTER TABLE "Seller"
  ADD CONSTRAINT "Seller_type_check" CHECK ("type" IN ('dealer','retailer','marketplace','official')) NOT VALID,
  ADD CONSTRAINT "Seller_status_check" CHECK ("status" IN ('research','verified')) NOT VALID;

ALTER TABLE "SellerOffer"
  ADD CONSTRAINT "SellerOffer_entityType_check" CHECK ("entityType" IN ('motorcycle','helmet','tire','topbox')) NOT VALID,
  ADD CONSTRAINT "SellerOffer_status_check" CHECK ("status" IN ('review','verified','expired','dealer_published')) NOT VALID,
  ADD CONSTRAINT "SellerOffer_publicationSource_check" CHECK ("publicationSource" IN ('reviewed_ingestion','dealer_portal')) NOT VALID;

ALTER TABLE "PriceAlertSubscription"
  ADD CONSTRAINT "PriceAlertSubscription_status_check" CHECK ("status" IN ('pending','active','unsubscribed')) NOT VALID;

ALTER TABLE "OfferImportBatch"
  ADD CONSTRAINT "OfferImportBatch_status_check" CHECK ("status" IN ('staged','review','published')) NOT VALID;

ALTER TABLE "OfferImportRow"
  ADD CONSTRAINT "OfferImportRow_status_check" CHECK ("status" IN ('staged','needs_review','approved','rejected','published')) NOT VALID;

ALTER TABLE "DealerLead"
  ADD CONSTRAINT "DealerLead_purchaseType_check" CHECK ("purchaseType" IN ('cash','installment')) NOT VALID,
  ADD CONSTRAINT "DealerLead_status_check" CHECK ("status" IN ('new','matched','quoted','buyer_interested','contacted','closed')) NOT VALID;

ALTER TABLE "DealerApplication"
  ADD CONSTRAINT "DealerApplication_status_check" CHECK ("status" IN ('new','approved','rejected')) NOT VALID;

ALTER TABLE "DealerLeadDelivery"
  ADD CONSTRAINT "DealerLeadDelivery_status_check" CHECK ("status" IN ('pending','ready','opened','quoted','contacted','closed','cancelled')) NOT VALID;

ALTER TABLE "DealerQuoteResponse"
  ADD CONSTRAINT "DealerQuoteResponse_buyerDecision_check" CHECK ("buyerDecision" IS NULL OR "buyerDecision" IN ('interested','declined')) NOT VALID;

ALTER TABLE "UsedListing"
  ADD CONSTRAINT "UsedListing_status_check" CHECK ("status" IN ('review','submitted','verified','rejected','expired')) NOT VALID,
  ADD CONSTRAINT "UsedListing_condition_check" CHECK ("condition" IN ('fair','good','excellent')) NOT VALID;

ALTER TABLE "UsedListingInquiry"
  ADD CONSTRAINT "UsedListingInquiry_status_check" CHECK ("status" IN ('new','pending_delivery','sent','delivery_failed','closed')) NOT VALID;

ALTER TABLE "DealerMembership"
  ADD CONSTRAINT "DealerMembership_role_check" CHECK ("role" IN ('owner','manager','staff')) NOT VALID;
