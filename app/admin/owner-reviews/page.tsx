import type { Metadata } from "next";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { OwnerReviewModeration } from "@/components/OwnerReviewModeration";

export const metadata:Metadata={title:"Owner Review Moderation",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";

export default async function OwnerReviewModerationPage(){
  const reviewsResult=databaseConfigured()?await prisma.ownerReview.findMany({
    include:{owner:{select:{email:true}}},
    orderBy:{updatedAt:"desc"},
    take:100
  }).catch(()=>null):[];
  const loadError=reviewsResult===null;
  const reviews=reviewsResult||[];

  return <section className="page shell">
    <div className="page-head"><h1>Garage-verified owner reviews</h1><p>Review usefulness, plausibility and privacy before publishing. Garage verification confirms only a signed-in account with a matching cloud Garage motorcycle; it is not document verification.</p></div>
    <div className="health-summary">
      <div><span>Reviews</span><strong>{reviews.length}</strong></div>
      <div><span>Pending</span><strong>{reviews.filter(review=>review.status==="pending").length}</strong></div>
      <div><span>Published</span><strong>{reviews.filter(review=>review.status==="published").length}</strong></div>
      <div><span>Rejected</span><strong>{reviews.filter(review=>review.status==="rejected").length}</strong></div>
    </div>
    {!databaseConfigured()?<div className="note-box"><h2>Production database is not configured</h2><p>Owner reviews require DATABASE_URL and the owner-review Prisma migration.</p></div>:
    loadError?<div className="note-box"><h2>Owner review storage is not ready</h2><p>Apply the owner-review Prisma migration before using moderation.</p></div>:
    !reviews.length?<div className="note-box"><h2>No owner reviews yet</h2><p>Garage-linked submissions will appear here after the feature is enabled.</p></div>:
    <div className="dealer-application-list">{reviews.map(review=>{
      const model=getModelById(review.modelExternalId);
      return <article className="dealer-application-card" key={review.id}>
        <div className="dealer-application-main">
          <span>{review.status} · submitted {review.submittedAt.toISOString().slice(0,10)}</span>
          <h2>{model?model.make+" "+model.model:review.modelExternalId}{review.modelYear?" · "+review.modelYear:""}{review.variantLabel?" · "+review.variantLabel:""}</h2>
          <p>{review.ownershipMonths} months · {review.odometerKm.toLocaleString("en-PH")} km · account {review.owner.email}</p>
          <div className="seller-tags">
            <span>Comfort {review.comfortRating}/5</span>
            <span>City {review.cityTrafficRating}/5</span>
            <span>Maintenance {review.maintenanceRating}/5</span>
            {review.passengerRating&&<span>Passenger {review.passengerRating}/5</span>}
            {review.highwayRating&&<span>Highway {review.highwayRating}/5</span>}
          </div>
          <dl className="dealer-application-details">
            <div><dt>Fuel economy</dt><dd>{review.fuelEconomyKmpl?review.fuelEconomyKmpl.toFixed(1)+" km/L":"Not supplied"}</dd></div>
            <div><dt>Annual maintenance</dt><dd>{review.annualMaintenancePhp?"₱"+Number(review.annualMaintenancePhp).toLocaleString("en-PH"):"Not supplied"}</dd></div>
            <div><dt>Unscheduled repairs</dt><dd>{review.unscheduledRepairsCount}</dd></div>
            <div><dt>Garage verified</dt><dd>{review.garageVerifiedAt.toISOString()}</dd></div>
          </dl>
          <h3>Summary</h3><p>{review.summary}</p>
          <h3>Likes</h3><p>{review.likes}</p>
          <h3>Dislikes</h3><p>{review.dislikes}</p>
        </div>
        <OwnerReviewModeration id={review.id} status={review.status} initialNote={review.moderatorNote||""}/>
      </article>;
    })}</div>}
  </section>;
}
