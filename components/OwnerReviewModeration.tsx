"use client";

import { useState } from "react";

export function OwnerReviewModeration({id,status,initialNote=""}:{id:string;status:string;initialNote?:string}){
  const [current,setCurrent]=useState(status);
  const [note,setNote]=useState(initialNote);
  const [working,setWorking]=useState(false);
  const [message,setMessage]=useState("");

  async function act(action:"publish"|"reject"){
    if(note.trim().length<10){setMessage("Add a moderation note explaining the decision.");return;}
    setWorking(true);setMessage("");
    try{
      const response=await fetch("/api/admin/owner-reviews/"+id,{
        method:"PATCH",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({action,moderatorNote:note})
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok){setMessage(data.error||"Update failed.");return;}
      setCurrent(data.status);
      setMessage(data.message||"Updated.");
    }catch{
      setMessage("Update failed.");
    }finally{
      setWorking(false);
    }
  }

  return <div className="dealer-application-review">
    <textarea rows={3} value={note} onChange={event=>setNote(event.target.value)} placeholder="What did you verify or reject in this owner review?"/>
    <div className="dealer-review-actions">
      <button type="button" disabled={working||current==="published"} onClick={()=>void act("publish")}>Publish review</button>
      <button type="button" disabled={working||current==="rejected"} onClick={()=>void act("reject")}>Reject</button>
    </div>
    <small className={current==="published"?"review-success":""}>{message||"Current status: "+current}</small>
  </div>;
}
