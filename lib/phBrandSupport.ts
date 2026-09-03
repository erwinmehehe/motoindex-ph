export type PhBrandSupport = {
  makeSlug: string;
  officialName: string;
  officialUrl: string;
  dealerUrl?: string;
  serviceUrl?: string;
  ownerUrl?: string;
  recallUrl?: string;
  supportNote: string;
  checkedAt: string;
};

const checkedAt = "2026-08-27";

// Philippines-first ownership links. These are intentionally brand-level resources:
// a model page never invents maintenance intervals or recall status when the exact
// model/manual is not stored yet.
export const phBrandSupport: PhBrandSupport[] = [
  { makeSlug:"rusi", officialName:"RUSI Motors", officialUrl:"https://rusimotors.ruscomotorsgroup.net/", serviceUrl:"https://rusimotors.ruscomotorsgroup.net/", supportNote:"RUSI's site publishes parts, repair and maintenance services; confirm the branch and exact model before booking.", checkedAt },
  { makeSlug:"motorstar", officialName:"MotorStar Philippines", officialUrl:"https://motorstar.com.ph/", dealerUrl:"https://motorstar.com.ph/", supportNote:"Use MotorStar's Philippine network directly for current stock, parts and service availability; branch coverage can vary by model.", checkedAt },
  { makeSlug:"kymco", officialName:"KYMCO Philippines", officialUrl:"https://kymco.com.ph/", dealerUrl:"https://kymco.com.ph/find-kymco/", serviceUrl:"https://kymco.com.ph/services/", supportNote:"KYMCO publishes Philippine dealer and service-center locators; use them to verify local after-sales support before purchase.", checkedAt },
  { makeSlug:"sym", officialName:"SYM / Sanyang Motor", officialUrl:"https://www.sym-global.com/", dealerUrl:"https://www.sym-global.com/global-distributors", supportNote:"SYM lists Philippine distributors on its global distributor directory. Confirm the current local distributor and service point for the exact unit.", checkedAt },
  { makeSlug:"cfmoto", officialName:"CFMOTO Philippines", officialUrl:"https://www.cfmotoph.com/", dealerUrl:"https://www.cfmoto.ph/find-a-dealer/", serviceUrl:"https://www.cfmoto.ph/find-a-dealer/", supportNote:"Use the official Philippine dealer/service network for parts, warranty and model-specific service questions.", checkedAt },
  { makeSlug:"bristol", officialName:"Bristol Motorcycles", officialUrl:"https://www.bristol-motorcycles.com/", dealerUrl:"https://www.bristol-motorcycles.com/dealer-locator", serviceUrl:"https://www.bristol-motorcycles.com/dealer-locator", supportNote:"Bristol publishes a Philippine branch network across Luzon, Visayas and Mindanao. Confirm that the branch services the exact model.", checkedAt },
  { makeSlug:"benelli", officialName:"Benelli Philippines", officialUrl:"https://www.benelli.com/ph-en/", dealerUrl:"https://www.benelli.com/ph-en/", serviceUrl:"https://www.benelli.com/ph-en/", supportNote:"Confirm the current Philippine Benelli dealer and after-sales contact before purchase, especially for parts lead time and scheduled service.", checkedAt },
  { makeSlug:"ktm", officialName:"KTM Philippines", officialUrl:"https://www.ktm.com/en-ph.html", dealerUrl:"https://www.ktm.com/en-ph/dealer-search.html", serviceUrl:"https://www.ktm.com/en-ph/service.html", recallUrl:"https://www.ktm.com/en-ph/service.html", supportNote:"KTM's Philippine service hub links manuals, maintenance, spare-parts tools, service/safety checks and recall information.", checkedAt },
  { makeSlug:"royal-enfield", officialName:"Royal Enfield Philippines", officialUrl:"https://www.royalenfield.com/ph/en/home/", dealerUrl:"https://www.royalenfield.com/ph/en/locate-us/dealers/", serviceUrl:"https://www.royalenfield.com/ph/en/locate-us/service-centres/", ownerUrl:"https://www.royalenfield.com/ph/en/locate-us/", supportNote:"Royal Enfield publishes Philippine store, service-centre and owner-manual entry points; use the exact model/year manual for intervals.", checkedAt },
  { makeSlug:"bmw-motorrad", officialName:"BMW Motorrad Philippines", officialUrl:"https://www.bmwmotorrad.com.ph/", dealerUrl:"https://www.bmwmotorrad.com.ph/en/contact.html", serviceUrl:"https://www.bmwmotorrad.com.ph/en/contact.html", supportNote:"BMW Motorrad Philippines lists authorized motorcycle contacts and dealers across Luzon, Visayas and Mindanao.", checkedAt },
  { makeSlug:"ducati", officialName:"Ducati Philippines", officialUrl:"https://ducati.com.ph/", dealerUrl:"https://www.ducati.com/ww/en/dealers", serviceUrl:"https://www.ducati.com/ww/en/dealers", supportNote:"Use Ducati's dealer locator to confirm an authorized Philippine sales/service point and the exact maintenance program for the model year.", checkedAt },
  { makeSlug:"triumph", officialName:"Triumph Motorcycles Philippines", officialUrl:"https://www.triumphmotorcycles.ph/", dealerUrl:"https://www.triumphmotorcycles.ph/dealers/dealer-search", serviceUrl:"https://www.triumphmotorcycles.ph/owners", recallUrl:"https://www.triumphmotorcycles.ph/owners", supportNote:"Triumph's Philippine owner support includes servicing, dealer search and recall-check support through authorized dealers.", checkedAt },
  { makeSlug:"vespa", officialName:"Vespa Philippines", officialUrl:"https://www.vespa.com/ph_EN/", dealerUrl:"https://www.vespa.com/ph_EN/", serviceUrl:"https://www.vespa.com/ph_EN/after-sales/", ownerUrl:"https://www.vespa.com/ph_EN/customer-care/", recallUrl:"https://www.vespa.com/ph_EN/customer-care/", supportNote:"Vespa Philippines links authorized service centres, scheduled-maintenance information, manuals and recall-campaign resources.", checkedAt },
  { makeSlug:"aprilia", officialName:"Aprilia Philippines", officialUrl:"https://www.aprilia.com/ph_EN/", dealerUrl:"https://www.aprilia.com/ph_EN/", serviceUrl:"https://www.aprilia.com/ph_EN/", supportNote:"Confirm the current Philippine Aprilia importer/dealer for model-specific service, parts and warranty support before purchase.", checkedAt },
  { makeSlug:"husqvarna", officialName:"Husqvarna Motorcycles Philippines", officialUrl:"https://www.husqvarna-motorcycles.com/en-ph.html", dealerUrl:"https://www.husqvarna-motorcycles.com/en-ph/dealer-search.html", serviceUrl:"https://www.husqvarna-motorcycles.com/en-ph/service.html", supportNote:"Use Husqvarna Motorcycles' Philippines dealer search and service resources for the exact motorcycle; do not confuse them with Husqvarna Forest & Garden support.", checkedAt },
];

export function phBrandSupportFor(makeSlug: string) {
  return phBrandSupport.find((row) => row.makeSlug === makeSlug);
}
