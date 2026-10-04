import { databaseConfigured, prisma } from "@/lib/db";

function boundedDays(name:string,fallback:number,min=1,max=3650){
  const raw=Number(process.env[name]||fallback);
  return Number.isFinite(raw)?Math.max(min,Math.min(max,Math.round(raw))):fallback;
}

export function privacyRetentionConfigured(){
  return Boolean(
    process.env.PRIVACY_RETENTION_ENABLED==="true" &&
    process.env.PRIVACY_RETENTION_CRON_CONFIGURED==="true" &&
    process.env.PRIVACY_RETENTION_CRON_SECRET &&
    databaseConfigured()
  );
}

export function privacyRetentionPolicy(){
  return {
    closedDealerLeadDays:boundedDays("PRIVACY_CLOSED_LEAD_DAYS",180),
    rejectedDealerApplicationDays:boundedDays("PRIVACY_REJECTED_APPLICATION_DAYS",365),
    closedUsedInquiryDays:boundedDays("PRIVACY_CLOSED_USED_INQUIRY_DAYS",180),
    unsubscribedPriceAlertDays:boundedDays("PRIVACY_UNSUBSCRIBED_ALERT_DAYS",30),
    expiredAuthArtifactDays:boundedDays("PRIVACY_EXPIRED_AUTH_DAYS",30),
    outboundClickDays:boundedDays("PRIVACY_CLICK_EVENT_DAYS",365)
  };
}

function cutoff(days:number,now:Date){
  return new Date(now.getTime()-days*24*60*60*1000);
}

export async function runPrivacyRetention(now=new Date()){
  if(!databaseConfigured())throw new Error("Database unavailable.");
  const policy=privacyRetentionPolicy();
  const [
    dealerLeads,
    dealerApplications,
    usedInquiries,
    priceAlerts,
    ownerMagicLinks,
    ownerSessions,
    dealerMagicLinks,
    dealerSessions,
    clickEvents
  ]=await prisma.$transaction([
    prisma.dealerLead.deleteMany({where:{status:"closed",updatedAt:{lt:cutoff(policy.closedDealerLeadDays,now)}}}),
    prisma.dealerApplication.deleteMany({where:{status:"rejected",updatedAt:{lt:cutoff(policy.rejectedDealerApplicationDays,now)}}}),
    prisma.usedListingInquiry.deleteMany({where:{status:"closed",createdAt:{lt:cutoff(policy.closedUsedInquiryDays,now)}}}),
    prisma.priceAlertSubscription.deleteMany({where:{status:"unsubscribed",updatedAt:{lt:cutoff(policy.unsubscribedPriceAlertDays,now)}}}),
    prisma.ownerMagicLink.deleteMany({where:{expiresAt:{lt:cutoff(policy.expiredAuthArtifactDays,now)}}}),
    prisma.ownerSession.deleteMany({where:{expiresAt:{lt:cutoff(policy.expiredAuthArtifactDays,now)}}}),
    prisma.dealerMagicLink.deleteMany({where:{expiresAt:{lt:cutoff(policy.expiredAuthArtifactDays,now)}}}),
    prisma.dealerSession.deleteMany({where:{expiresAt:{lt:cutoff(policy.expiredAuthArtifactDays,now)}}}),
    prisma.outboundClickEvent.deleteMany({where:{createdAt:{lt:cutoff(policy.outboundClickDays,now)}}})
  ]);

  return {
    policy,
    deleted:{
      dealerLeads:dealerLeads.count,
      dealerApplications:dealerApplications.count,
      usedInquiries:usedInquiries.count,
      priceAlerts:priceAlerts.count,
      ownerMagicLinks:ownerMagicLinks.count,
      ownerSessions:ownerSessions.count,
      dealerMagicLinks:dealerMagicLinks.count,
      dealerSessions:dealerSessions.count,
      clickEvents:clickEvents.count
    }
  };
}
