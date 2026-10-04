import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function newBearerToken(){
  return randomBytes(32).toString("base64url");
}

export function hashBearerToken(token:string){
  return createHash("sha256").update(token).digest("hex");
}

function priceAlertSecret(){
  return process.env.PRICE_ALERT_TOKEN_SECRET || process.env.PRICE_ALERT_CRON_SECRET || "";
}

function alertPayload(id:string,email:string,purpose:"confirm"|"unsubscribe"){
  return `${purpose}:${id}:${email.trim().toLowerCase()}`;
}

export function priceAlertActionToken(id:string,email:string,purpose:"confirm"|"unsubscribe"){
  const secret=priceAlertSecret();
  if(!secret)throw new Error("Price alert token signing secret is not configured.");
  const signature=createHmac("sha256",secret).update(alertPayload(id,email,purpose)).digest("base64url");
  return `${id}.${signature}`;
}

export function verifyPriceAlertActionToken(token:string,email:string,purpose:"confirm"|"unsubscribe"){
  const dot=token.indexOf(".");
  if(dot<=0)return null;
  const id=token.slice(0,dot);
  const supplied=token.slice(dot+1);
  if(!id||!supplied)return null;
  let expected:string;
  try{expected=priceAlertActionToken(id,email,purpose).slice(id.length+1);}catch{return null;}
  const a=Buffer.from(supplied);
  const b=Buffer.from(expected);
  if(a.length!==b.length||!timingSafeEqual(a,b))return null;
  return id;
}
