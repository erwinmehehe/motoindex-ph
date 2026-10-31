"use client";
import { useState } from "react";

const requiredItems = [
  { id: "apl", name: "Completed Application for Permits and Licenses (APL) form" },
  { id: "affidavit", name: "Original Affidavit of Loss for the lost license" },
  { id: "id", name: "Original valid ID bearing your photo and signature" },
  { id: "copy", name: "One photocopy of that valid photo-and-signature ID" }
] as const;

/** Session-only checklist: selections stay in React state, with no collection or persistence. */
export function LostLicenseChecklist() {
  const [ready, setReady] = useState<string[]>([]);
  return <section className="info-card" aria-labelledby="lost-license-checklist" data-lto-duplicate-checklist>
    <span className="section-kicker">LTO document checklist · 2024 Citizen's Charter</span>
    <h2 id="lost-license-checklist">Prepare for an LTO duplicate-license application</h2>
    <p>Mark the documents you have. This checklist does not send or save personal information, and it does not replace the receiving LTO office's instructions.</p>
    <fieldset style={{border:0,padding:0,margin:"18px 0"}}>
      <legend className="section-kicker">Original LTO requirements</legend>
      <div style={{display:"grid",gap:12,marginTop:12}}>
        {requiredItems.map(item=><label key={item.id} style={{display:"flex",alignItems:"start",gap:12,cursor:"pointer",lineHeight:1.6}}>
          <input type="checkbox" checked={ready.includes(item.id)}
            onChange={e=>setReady(prev=>e.target.checked?[...prev,item.id]:prev.filter(x=>x!==item.id))}
            style={{width:20,height:20,marginTop:2,flexShrink:0}} />
          <span>{item.name}</span>
        </label>)}
      </div>
    </fieldset>
    <p aria-live="polite"><strong>{ready.length} of {requiredItems.length} documents ready</strong> · Verify your license expiry and fees with the LTO.</p>
    {ready.length>0 && <button type="button" onClick={()=>setReady([])} style={{padding:"8px 12px",borderRadius:8,border:"1px solid currentColor",background:"transparent",color:"inherit",cursor:"pointer"}}>Clear checklist</button>}
    <p><small>Source: <a href="https://lto.gov.ph/wp-content/uploads/2024/05/LTO_CC_05-30-2024.pdf" target="_blank" rel="noopener noreferrer">LTO Citizen's Charter, duplicate license checklist</a>. Changes or exceptional applications may require additional documents.</small></p>
  </section>;
}
