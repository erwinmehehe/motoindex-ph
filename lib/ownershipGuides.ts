import type { OwnershipGuide } from "./types";

export const ownershipGuides: OwnershipGuide[] = [
  {
    slug: "registration-renewal",
    kicker: "LTO registration",
    title: "Motorcycle registration renewal Philippines: requirements, fees and LTMS",
    description: "A source-dated LTO motorcycle registration renewal guide covering what to prepare, early renewal, online LTMS eligibility and fee checks.",
    lastChecked: "2026-08-25",
    sections: [
      {
        heading: "Prepare the current registration, insurance and inspection requirements",
        body: "Keep the motorcycle's registration record and current official receipt available. LTO guidance also requires active compulsory motor-vehicle insurance and the applicable inspection or emissions process for renewal. Confirm the current transaction checklist before visiting or paying."
      },
      {
        heading: "Check the renewal window before the registration expires",
        body: "LTO states that vehicle registration may be renewed up to two months before expiry. Use the current registration record or LTMS information to confirm the transaction timing instead of relying on a remembered plate schedule."
      },
      {
        heading: "Online plain renewal exists",
        body: "LTO has implemented online plain renewal through LTMS for eligible transactions. Eligibility and inspection requirements can vary, so check the LTMS portal and the latest LTO issuances before paying or travelling to an office."
      },
      {
        heading: "Registration fees and late charges depend on the actual transaction",
        body: "Fees, system charges and penalties can change or depend on the vehicle and transaction status. MotoIndex does not hard-code one evergreen renewal price; use the current LTO assessment and the planning calculator as an estimate only."
      }
    ],
    sources: [
      { label: "LTO: renew registration up to two months early", url: "https://lto.gov.ph/news/did-you-know-you-can-renew-your-vehicle-registration-up-to-2months-before-it-expires/", publisher: "Land Transportation Office", checkedAt: "2026-08-25" },
      { label: "LTMS online portal", url: "https://portal.lto.gov.ph/", publisher: "Land Transportation Office", checkedAt: "2026-08-25" },
      { label: "LTO issuances index", url: "https://lto.gov.ph/issuances/", publisher: "Land Transportation Office", checkedAt: "2026-08-25" }
    ]
  },
  {
    slug: "transfer-of-ownership",
    kicker: "Ownership transfer",
    title: "Motorcycle transfer of ownership in the Philippines",
    description: "A current-source motorcycle ownership-transfer checklist using the 2025 LTO rules and Citizen’s Charter.",
    lastChecked: "2026-08-26",
    sections: [
      {
        heading: "Prepare the general transfer requirements",
        body: "The 2025 LTO motorcycle ownership rules list a duly notarized deed of conveyance or agreement such as a deed of sale, the OR/CR, valid HPG clearance and one valid government-issued ID among the general requirements. A secretary certificate is added when the motorcycle is owned by a corporation."
      },
      {
        heading: "Unregistered-for-the-year motorcycles can still be transferred",
        body: "The 2025 rules state that transfer may be processed even if the motorcycle is not registered for the current year, but the Certificate of Registration is not released until registration is renewed."
      },
      {
        heading: "Online submission is contemplated by the current rule",
        body: "The 2025 rules allow the buyer to cause the transfer in person or through online submission, with scanned requirements accepted for online filing subject to originals being produced when required. An affidavit of authenticity is required for online submissions."
      },
      {
        heading: "Repo and dealer resale has a reporting path",
        body: "For a repossessed motorcycle, the 2025 rules require the dealer to report repossession. A later sale or disposition must then comply with the reporting and registration requirements for the new owner."
      }
    ],
    sources: [
      { label: "LTO IRR of RA 12209 — motorcycle transfer and repossession rules", url: "https://lto.gov.ph/wp-content/uploads/2025/07/IRR-RA-12209.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" },
      { label: "LTO 2025 Citizen’s Charter — motor vehicle transaction requirements", url: "https://lto.gov.ph/wp-content/uploads/2025/11/MV-CC-2025.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" },
      { label: "LTO issuances index", url: "https://lto.gov.ph/issuances/", publisher: "Land Transportation Office", checkedAt: "2026-08-26" }
    ]
  },
  {
    slug: "deed-of-sale-motorcycle-philippines",
    kicker: "Deed of sale",
    title: "Motorcycle deed of sale in the Philippines: what the LTO transfer process requires",
    description: "How a notarized motorcycle deed of sale fits the current LTO ownership-transfer process, what to verify, and why an incomplete open deed is risky.",
    lastChecked: "2026-08-26",
    sections: [
      {
        heading: "The current LTO rule requires a duly notarized deed or conveyance agreement",
        body: "The 2025 motorcycle ownership rules list a duly notarized deed of conveyance or agreement, including a deed of sale or deed of donation, among the general transfer requirements. The rule says the substance of the document controls rather than its title."
      },
      {
        heading: "The deed is only one part of ownership transfer",
        body: "A deed of sale does not replace the full LTO transaction. The same general requirement list includes the OR/CR, valid HPG clearance and valid government-issued identification, with additional requirements depending on the transaction."
      },
      {
        heading: "Match the deed to the actual motorcycle and parties",
        body: "Before signing or paying, make sure the parties and the motorcycle details in the transaction documents match the seller, OR/CR and physical unit. Engine and chassis mismatches should be resolved before the purchase proceeds."
      },
      {
        heading: "Avoid relying on an incomplete open deed as the end state",
        body: "The safer goal is a completed, notarized transaction document followed by the formal LTO transfer. Leaving blanks or postponing the ownership transfer can create identity, liability and processing problems. For unusual transactions or disputed ownership, obtain qualified legal advice."
      }
    ],
    sources: [
      { label: "LTO IRR of RA 12209 — general motorcycle transfer requirements", url: "https://lto.gov.ph/wp-content/uploads/2025/07/IRR-RA-12209.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" },
      { label: "LTO 2025 Citizen’s Charter — deed of sale and HPG clearance references", url: "https://lto.gov.ph/wp-content/uploads/2025/11/MV-CC-2025.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" }
    ]
  },
  {
    slug: "dl-code-b-motorcycle-philippines",
    kicker: "Driver’s license codes",
    title: "Can you drive a motorcycle with DL Code B in the Philippines?",
    description: "No: DL Code B by itself is for passenger vehicles, while motorcycles use DL Code A. See the current LTO code table, clutch-code note and what to check on your license.",
    lastChecked: "2026-08-26",
    sections: [
      {
        heading: "DL Code B by itself does not cover motorcycles",
        body: "LTO’s driver-license code table assigns DL Code B to M1 passenger vehicles. Motorcycles are assigned to DL Code A, covering the motorcycle vehicle categories listed by LTO. If your license only shows B and does not also show A, do not treat B as motorcycle authorization."
      },
      {
        heading: "For a motorcycle, look for DL Code A",
        body: "LTO materials identify Code A as Motorcycle and Code A1 as Tricycle. The exact vehicle category and any transmission limitation still matter, so read the codes printed on the actual license rather than relying on the older restriction-code system."
      },
      {
        heading: "Check the clutch or transmission authorization too",
        body: "LTO’s licensing information notes that a holder authorized for manual transmission may also operate automatic transmission vehicles, while an automatic-transmission authorization does not authorize manual transmission. Check the transmission/clutch code shown on your license for the vehicle you plan to use."
      },
      {
        heading: "If your license has B but not A",
        body: "Use the current LTO process for adding the appropriate driver’s-license code before riding a motorcycle on public roads. Requirements can change, so confirm the latest licensing transaction checklist directly with LTO or an authorized licensing center."
      }
    ],
    sources: [
      { label: "LTO Filipino Driver’s Manual: driver’s license classification and vehicle category", url: "https://lto.gov.ph/wp-content/uploads/2023/10/FDM-Vol.-1-2nd-Edition.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" },
      { label: "LTO CDE general information: driver’s license code and vehicle category summary", url: "https://www.lto.gov.ph/wp-content/uploads/2023/09/RO105-CDE-General-Information-10.22.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" },
      { label: "LTO licensing transaction table: DL Code A/A1 vehicle categories", url: "https://lto.gov.ph/wp-content/uploads/2023/10/MEMO_11102021_CitizenCharter_Licensing-Transaction.pdf", publisher: "Land Transportation Office", checkedAt: "2026-08-26" }
    ]
  },
  {
    slug: "motorcycle-insurance",
    kicker: "Insurance",
    title: "CTPL vs comprehensive motorcycle insurance in the Philippines",
    description: "What compulsory third-party liability covers, how it relates to registration, and how comprehensive insurance differs.",
    lastChecked: "2026-08-25",
    sections: [
      {
        heading: "CTPL is the compulsory registration cover",
        body: "Insurance Commission guidance identifies compulsory third-party liability cover as the mandatory motor-vehicle insurance used for registration or renewal."
      },
      {
        heading: "CTPL is not comprehensive own-damage cover",
        body: "CTPL is focused on liability for death or bodily injury to third parties, subject to the policy and applicable rules. Comprehensive motor insurance can add own-vehicle loss or damage and optional protections depending on the policy."
      },
      {
        heading: "Current compulsory liability limit",
        body: "Insurance Memorandum Circular 2024-01 increased the compulsory motor-vehicle third-party liability limit to ₱200,000 for all motor-vehicle types. Verify the policy schedule and current Insurance Commission rules when buying."
      },
      {
        heading: "Check the insurer, policy and dates",
        body: "Use an Insurance Commission-regulated insurer and make sure the coverage period aligns with the registration transaction. Do not treat a dealer quote or marketplace listing as proof of current coverage."
      }
    ],
    sources: [
      { label: "Insurance Commission: CTPL and comprehensive policy synchronization", url: "https://www.insurance.gov.ph/notice-to-the-public-guidelines-on-the-synchronization-of-the-period-of-coverage-of-comprehensive-motor-insurance-policies/", publisher: "Insurance Commission", checkedAt: "2026-08-25" },
      { label: "Insurance Commission: compulsory liability benefit increase", url: "https://www.insurance.gov.ph/ic-doubles-third-liability-insurance-coverage/", publisher: "Insurance Commission", checkedAt: "2026-08-25" }
    ]
  }
];

export function getOwnershipGuide(slug: string) {
  return ownershipGuides.find((guide) => guide.slug === slug);
}
