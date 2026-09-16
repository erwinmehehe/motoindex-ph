import type { SellerProfile } from "@/lib/types";

const CHECKED_AT="2026-09-16";
const YAMAHA_QC="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/quezon-city";
const YAMAHA_QC_PAGE2="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/quezon-city?page=2";
const YAMAHA_PASIG_CITY="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/pasig-city";
const YAMAHA_PASIG="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/pasig";
const YAMAHA_MAKATI="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/makati";
const YAMAHA_MAKATI_CITY="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/makati-city";
const YAMAHA_PARANAQUE="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/paranaque-city";
const YAMAHA_CALOOCAN="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/caloocan";
const YAMAHA_TAGUIG_CITY="https://find-dealer.yamaha-motor.com.ph/Metro%20Manila-Taguig%20City";
const YAMAHA_TAGUIG="https://find-dealer.yamaha-motor.com.ph/Metro%20Manila-Taguig";
const YAMAHA_PASAY="https://find-dealer.yamaha-motor.com.ph/location/metro-manila/pasay-city";
const KAWASAKI_DEALERS="https://www.kawasaki.ph/dealers/motorcycle";

function yamahaDealer(input:{id:string;name:string;slug:string;city:string;address:string;phone:string;source:string}):SellerProfile{
  return {
    id:input.id,name:input.name,slug:input.slug,type:"dealer",city:input.city,province:"Metro Manila",region:"National Capital Region",
    addressLabel:input.address,website:input.source,phoneLabel:input.phone,
    description:`Yamaha dealer in ${input.city}. This branch is listed on Yamaha Motor Philippines' official dealer locator.`,
    brands:["Yamaha"],categories:["Motorcycles","Parts and service"],isDemo:false,status:"verified",lastChecked:CHECKED_AT,
    sourceLabel:"Yamaha Motor Philippines dealer locator",sourceUrl:input.source,
    verificationNote:"Branch name, address and contact number were checked against Yamaha Motor Philippines' official dealer locator."
  };
}

function kawasakiDealer(input:{id:string;name:string;slug:string;city:string;address:string;phone?:string}):SellerProfile{
  return {
    id:input.id,name:input.name,slug:input.slug,type:"dealer",city:input.city,province:"Metro Manila",region:"National Capital Region",
    addressLabel:input.address,website:KAWASAKI_DEALERS,phoneLabel:input.phone,
    description:`Kawasaki dealer in ${input.city}. Kawasaki Philippines includes this dealer in its current motorcycle dealer directory.`,
    brands:["Kawasaki"],categories:["Motorcycles","Parts and service"],isDemo:false,status:"verified",lastChecked:CHECKED_AT,
    sourceLabel:"Kawasaki Philippines motorcycle dealer directory",sourceUrl:KAWASAKI_DEALERS,
    verificationNote:"The Kawasaki dealer relationship was checked on Kawasaki Philippines. Address and contact details were cross-checked against a current public business listing when the official directory did not expose them."
  };
}

export const ncrDealers:SellerProfile[]=[
  yamahaDealer({id:"seller-yamaha-fmn-kamias-quezon-city",name:"Yamaha 3S Shop - FMN Kamias",slug:"yamaha-fmn-kamias-quezon-city",city:"Quezon City",address:"No. 59 Advance Credit Corp. Building, Kamias Road, Pinyahan, Quezon City 1102",phone:"+63 928 168 1755",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-wheeltek-timog-quezon-city",name:"Yamaha Revzone - Wheeltek Timog",slug:"yamaha-wheeltek-timog-quezon-city",city:"Quezon City",address:"No. 52, Laging Handa, Timog, Quezon City 1103",phone:"+63 933 827 1943",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-cyclemar-baesa-quezon-city",name:"Yamaha 3S Shop - Cyclemar Baesa",slug:"yamaha-cyclemar-baesa-quezon-city",city:"Quezon City",address:"Convenience Plaza, Main Street, Quirino Highway, Novaliches, Baesa, Quezon City 1106",phone:"+63 932 846 4246",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-motortrade-mindanao-quezon-city",name:"Yamaha 3S Shop - Motortrade Mindanao",slug:"yamaha-motortrade-mindanao-quezon-city",city:"Quezon City",address:"JB & P Building, Bahay Toro, Mindanao Avenue, Quezon City 1106",phone:"+63 999 992 0364",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-fmn-cubao-quezon-city",name:"Yamaha 3S Shop - FMN Cubao",slug:"yamaha-fmn-cubao-quezon-city",city:"Quezon City",address:"No. 973 Aurora Boulevard, Cubao, Quezon City 1109",phone:"+63 997 496 7534",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-motortrade-mayon-quezon-city",name:"Yamaha 3S Shop - Motortrade Mayon",slug:"yamaha-motortrade-mayon-quezon-city",city:"Quezon City",address:"No. 488 Mayon Street, Maharlika, Quezon City 1114",phone:"+63 935 240 0785",source:YAMAHA_QC}),
  yamahaDealer({id:"seller-yamaha-wheeltek-bagbag-quezon-city",name:"Yamaha 3S Shop - Wheeltek Bagbag",slug:"yamaha-wheeltek-bagbag-quezon-city",city:"Quezon City",address:"No. 606 Quirino Highway, Novaliches, Bagbag, Quezon City 1116",phone:"+63 933 851 2197",source:YAMAHA_QC_PAGE2}),
  yamahaDealer({id:"seller-yamaha-motortrade-tandang-sora-quezon-city",name:"Yamaha 3S Shop - Motortrade Tandang Sora",slug:"yamaha-motortrade-tandang-sora-quezon-city",city:"Quezon City",address:"No. 242 Tandang Sora Avenue, Quezon City 1116",phone:"+63 960 364 2503",source:YAMAHA_QC_PAGE2}),
  yamahaDealer({id:"seller-yamaha-freiburg-novaliches-quezon-city",name:"Yamaha 3S Shop - Freiburg Novaliches",slug:"yamaha-freiburg-novaliches-quezon-city",city:"Quezon City",address:"No. 810 Gulod, Kalayaan Street, Novaliches, Quezon City 1117",phone:"+63 966 138 1020",source:YAMAHA_QC_PAGE2}),
  yamahaDealer({id:"seller-yamaha-motortrade-east-fairview-quezon-city",name:"Yamaha 3S Shop - Motortrade East Fairview",slug:"yamaha-motortrade-east-fairview-quezon-city",city:"Quezon City",address:"No. 72 Marcos Avenue, Camaro Street corner Don Mariano, East Fairview, Quezon City 1118",phone:"+63 985 916 5778",source:YAMAHA_QC_PAGE2}),
  yamahaDealer({id:"seller-yamaha-premiumbikes-north-fairview-quezon-city",name:"Yamaha 3S Shop - Premiumbikes North Fairview",slug:"yamaha-premiumbikes-north-fairview-quezon-city",city:"Quezon City",address:"Lot 10 & 12, Block 43, Regalado Highway, North Fairview, Quezon City 1118",phone:"+63 917 833 0465",source:YAMAHA_QC_PAGE2}),
  yamahaDealer({id:"seller-yamaha-motortrade-quirino-highway-quezon-city",name:"Yamaha 3S Shop - Motortrade Quirino Highway",slug:"yamaha-motortrade-quirino-highway-quezon-city",city:"Quezon City",address:"No. 1039 E&V Building, Quirino Highway, Novaliches, Quezon City 1123",phone:"+63 933 811 6629",source:YAMAHA_QC_PAGE2}),

  yamahaDealer({id:"seller-yamaha-motortrade-dela-paz-pasig",name:"Yamaha 3S Shop - Motortrade Dela Paz",slug:"yamaha-motortrade-dela-paz-pasig",city:"Pasig City",address:"No. 1264, Dela Paz, Amang Rodriguez Avenue, Pasig City 1600",phone:"+63 976 371 4105",source:YAMAHA_PASIG_CITY}),
  yamahaDealer({id:"seller-yamaha-premiumbikes-caniogan-pasig",name:"Yamaha 3S Shop - Premiumbikes Caniogan",slug:"yamaha-premiumbikes-caniogan-pasig",city:"Pasig City",address:"Ground Floor, Mercedes Avenue, Raymundo Avenue corner C.M., Caniogan, Pasig City 1606",phone:"+63 998 840 4919",source:YAMAHA_PASIG_CITY}),
  yamahaDealer({id:"seller-yamaha-motoaccess-buting-pasig",name:"Yamaha 3S Shop - Motoaccess Buting",slug:"yamaha-motoaccess-buting-pasig",city:"Pasig City",address:"Ground Floor, San Guillermo, Delos Santos Street, Buting, Pasig City 1600",phone:"+63 970 770 9650",source:YAMAHA_PASIG}),

  yamahaDealer({id:"seller-yamaha-super-bikes-olympia-makati",name:"Yamaha 3S Shop - Super Bikes Olympia",slug:"yamaha-super-bikes-olympia-makati",city:"Makati City",address:"No. 491 Jose P. Rizal Street, Olympia, Makati City 1207",phone:"+63 936 435 6862",source:YAMAHA_MAKATI}),
  yamahaDealer({id:"seller-yamaha-freiburg-pasong-tamo-makati",name:"Yamaha 3S Shop - Freiburg Pasong Tamo",slug:"yamaha-freiburg-pasong-tamo-makati",city:"Makati City",address:"No. 2326 Chino Roces Avenue, Pasong Tamo Extension, Makati City 1231",phone:"+63 946 711 9456",source:YAMAHA_MAKATI}),
  yamahaDealer({id:"seller-yamaha-kart-plaza-buendia-makati",name:"Yamaha 3S Shop - Kart Plaza Buendia",slug:"yamaha-kart-plaza-buendia-makati",city:"Makati City",address:"No. 43 Sen. Gil Puyat Avenue, Buendia Avenue, Makati City 1235",phone:"+63 937 239 5282",source:YAMAHA_MAKATI_CITY}),

  yamahaDealer({id:"seller-yamaha-motortrade-sucat-paranaque",name:"Yamaha 3S Shop - Motortrade Sucat",slug:"yamaha-motortrade-sucat-paranaque",city:"Paranaque City",address:"No. 8284 Sucat Road, Parañaque City 1700",phone:"+63 999 991 4702",source:YAMAHA_PARANAQUE}),
  yamahaDealer({id:"seller-yamaha-kart-plaza-tambo-paranaque",name:"Yamaha 3S Shop - Kart Plaza Tambo",slug:"yamaha-kart-plaza-tambo-paranaque",city:"Paranaque City",address:"No. 0803 Quirino Avenue corner Pio de Jesus Street, Tambo, Parañaque City 1701",phone:"+63 915 279 1197",source:YAMAHA_PARANAQUE}),
  yamahaDealer({id:"seller-yamaha-transcycle-better-living-paranaque",name:"Yamaha 3S Shop - Transcycle Better Living",slug:"yamaha-transcycle-better-living-paranaque",city:"Paranaque City",address:"Capistrano Building, Dona Soledad Avenue, Better Living Subdivision, Don Bosco, Parañaque City 1711",phone:"+63 995 987 8483",source:YAMAHA_PARANAQUE}),
  yamahaDealer({id:"seller-yamaha-freiburg-bf-homes-paranaque",name:"Yamaha 3S Shop - Freiburg BF Homes",slug:"yamaha-freiburg-bf-homes-paranaque",city:"Paranaque City",address:"No. 19 President Avenue, Teoville Subdivision, BF Homes, Parañaque City 1720",phone:"+63 965 237 2727",source:YAMAHA_PARANAQUE}),

  yamahaDealer({id:"seller-yamaha-motortrade-edsa-caloocan",name:"Yamaha 3S Shop - Motortrade EDSA Caloocan",slug:"yamaha-motortrade-edsa-caloocan",city:"Caloocan City",address:"No. 283 EDSA corner General Tinio Street, Morning Breeze Subdivision, Caloocan City 1400",phone:"+63 999 992 1330",source:YAMAHA_CALOOCAN}),
  yamahaDealer({id:"seller-yamaha-transcycle-sangandaan-caloocan",name:"Yamaha 3S Shop - Transcycle Sangandaan",slug:"yamaha-transcycle-sangandaan-caloocan",city:"Caloocan City",address:"A. Mabini Street, Zone 1, Barangay 5, Sangandaan, Caloocan City 1400",phone:"+63 966 294 4667",source:YAMAHA_CALOOCAN}),
  kawasakiDealer({id:"seller-motorsave-caloocan-kawasaki",name:"Motorsave Caloocan",slug:"motorsave-caloocan-kawasaki",city:"Caloocan City",address:"588 Bonifacio Circle, Morning Breeze Subdivision, Caloocan City 1400",phone:"+63 933 811 6605"}),

  yamahaDealer({id:"seller-yamaha-motortrade-bagong-bayan-taguig",name:"Yamaha 3S Shop - Motortrade Bagong Bayan",slug:"yamaha-motortrade-bagong-bayan-taguig",city:"Taguig City",address:"Monico Building, Quezon Avenue, Bagong Bayan, Taguig City 1630",phone:"+63 999 991 6456",source:YAMAHA_TAGUIG_CITY}),
  yamahaDealer({id:"seller-yamaha-kart-plaza-taguig",name:"Yamaha 3S Shop - Kart Plaza Taguig",slug:"yamaha-kart-plaza-taguig",city:"Taguig City",address:"No. 75 Zone 3B, MRT Avenue, Cuasay Street, Taguig City 1630",phone:"+63 965 554 3188",source:YAMAHA_TAGUIG}),
  kawasakiDealer({id:"seller-excellent-peoples-taguig-kawasaki",name:"Excellent People's Taguig City",slug:"excellent-peoples-taguig-kawasaki",city:"Taguig City",address:"2/F Sample Shop Building, AFP RSBS Industrial Park, Km. 12 East Service Road, C5, Western Bicutan, Taguig City"}),

  yamahaDealer({id:"seller-yamaha-premio-edsa-pasay",name:"Yamaha 3S Shop - Premio EDSA Pasay",slug:"yamaha-premio-edsa-pasay",city:"Pasay City",address:"No. 641 EDSA, Malibay, Pasay City 1300",phone:"+63 917 582 7390",source:YAMAHA_PASAY}),
  yamahaDealer({id:"seller-yamaha-motortrade-fb-harrison-pasay",name:"Yamaha 3S Shop - Motortrade F.B. Harrison",slug:"yamaha-motortrade-fb-harrison-pasay",city:"Pasay City",address:"No. 2316 F.B. Harrison Street, Barangay 27, Pasay City 1300",phone:"+63 999 992 3672",source:YAMAHA_PASAY}),
  kawasakiDealer({id:"seller-alliance-motor-pasay-kawasaki",name:"Alliance Motor Pasay City",slug:"alliance-motor-pasay-kawasaki",city:"Pasay City",address:"2325 Taft Avenue, Libertad, Pasay City 1304"})
];
