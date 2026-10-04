import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  session:vi.fn(),
  inventoryFind:vi.fn(), inventoryCreate:vi.fn(), inventoryUpdate:vi.fn(), inventoryFindUnique:vi.fn(), observationCreate:vi.fn(),
  deliveryFind:vi.fn(), transaction:vi.fn(),
  quoteUpsert:vi.fn(), deliveryUpdate:vi.fn(), leadUpdate:vi.fn()
}));

vi.mock("@/lib/dealerAuth",()=>({
  getDealerSession:mocks.session,
  dealerRequestOriginAllowed:()=>true
}));
vi.mock("@/lib/data",()=>({
  getModelById:(id:string)=>id==="honda-adv-160"?{id,marketStatus:"current"}:undefined
}));
vi.mock("@/lib/db",()=>({
  prisma:{
    sellerOffer:{findFirst:mocks.inventoryFind,create:mocks.inventoryCreate,update:mocks.inventoryUpdate,findUnique:mocks.inventoryFindUnique},
    offerPriceObservation:{create:mocks.observationCreate},
    dealerLeadDelivery:{findUnique:mocks.deliveryFind},
    $transaction:mocks.transaction
  }
}));

import { POST as createInventory, DELETE as expireInventory } from "../app/api/dealer-portal/inventory/route";
import { PUT as submitQuote } from "../app/api/dealer-portal/leads/[deliveryId]/quote/route";

const membership={sellerId:"seller-1",seller:{slug:"dealer-one",status:"verified",website:"https://dealer.example"}};
const session={account:{memberships:[membership]}};

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.session.mockResolvedValue(session);
  mocks.inventoryFind.mockResolvedValue(null);
  mocks.inventoryCreate.mockResolvedValue({id:"offer-1"});
  mocks.observationCreate.mockResolvedValue({});
});

describe("dealer branch authorization",()=>{
  it("rejects inventory writes for a branch outside the signed-in dealer account",async()=>{
    const request=new Request("http://localhost/api/dealer-portal/inventory",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
      sellerId:"seller-2",entityId:"honda-adv-160",pricePhp:"160000",availability:"in_stock",expiresAt:"2099-01-01"
    })});
    const response=await createInventory(request);
    expect(response.status).toBe(403);
    expect(mocks.inventoryCreate).not.toHaveBeenCalled();
  });

  it("rejects dealer inventory that avoids the 45-day freshness ceiling",async()=>{
    const far=new Date(Date.now()+60*24*60*60*1000).toISOString().slice(0,10);
    const request=new Request("http://localhost/api/dealer-portal/inventory",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
      sellerId:"seller-1",entityId:"honda-adv-160",pricePhp:"160000",availability:"in_stock",expiresAt:far
    })});
    const response=await createInventory(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ok:false});
  });

  it("lets a dealer expire only its own portal inventory",async()=>{
    mocks.inventoryFindUnique.mockResolvedValue({id:"offer-1",sellerId:"seller-2",publicationSource:"dealer_portal"});
    const response=await expireInventory(new Request("http://localhost/api/dealer-portal/inventory",{method:"DELETE",headers:{"content-type":"application/json"},body:JSON.stringify({id:"offer-1"})}));
    expect(response.status).toBe(403);
    expect(mocks.inventoryUpdate).not.toHaveBeenCalled();
  });
});

describe("dealer quote authorization",()=>{
  it("hides another dealer's lead instead of accepting a cross-dealer quote",async()=>{
    mocks.deliveryFind.mockResolvedValue({id:"delivery-2",sellerSlug:"dealer-two",status:"opened",expiresAt:new Date(Date.now()+86400000),leadId:"lead-1",openedAt:new Date()});
    const request=new Request("http://localhost/api/dealer-portal/leads/delivery-2/quote",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({cashPricePhp:160000,availability:"in_stock"})});
    const response=await submitQuote(request,{params:Promise.resolve({deliveryId:"delivery-2"})});
    expect(response.status).toBe(404);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("persists a structured quote for an authorized dealer lead",async()=>{
    const delivery={id:"delivery-1",sellerSlug:"dealer-one",status:"opened",expiresAt:new Date(Date.now()+86400000),leadId:"lead-1",openedAt:null};
    mocks.deliveryFind.mockResolvedValue(delivery);
    mocks.transaction.mockImplementation(async(fn:(tx:any)=>Promise<any>)=>fn({
      dealerQuoteResponse:{upsert:mocks.quoteUpsert},
      dealerLeadDelivery:{update:mocks.deliveryUpdate},
      dealerLead:{update:mocks.leadUpdate}
    }));
    mocks.quoteUpsert.mockResolvedValue({cashPricePhp:160000,downPaymentPhp:null,monthlyPhp:null,termMonths:null,availability:"in_stock",validUntil:null,dealerNote:null});
    const request=new Request("http://localhost/api/dealer-portal/leads/delivery-1/quote",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({cashPricePhp:160000,availability:"in_stock"})});
    const response=await submitQuote(request,{params:Promise.resolve({deliveryId:"delivery-1"})});
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ok:true,status:"quoted"});
    expect(mocks.quoteUpsert).toHaveBeenCalled();
    expect(mocks.deliveryUpdate).toHaveBeenCalled();
    expect(mocks.leadUpdate).toHaveBeenCalled();
  });
});
