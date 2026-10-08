"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { PublicFormAction } from "@/lib/publicFormChallenge";

type TurnstileApi = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    action: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
    "response-field": boolean;
  }) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window { turnstile?: TurnstileApi }
}

export function PublicFormChallenge({
  action,
  onToken,
  resetKey = 0
}: {
  action: PublicFormAction;
  onToken: (token: string) => void;
  resetKey?: number;
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => { onTokenRef.current = onToken; }, [onToken]);

  useEffect(() => {
    const api = window.turnstile;
    if (!siteKey || !scriptReady || !container.current || !api) return;
    const id = api.render(container.current, {
      sitekey: siteKey,
      action,
      callback: token => onTokenRef.current(token),
      "expired-callback": () => onTokenRef.current(""),
      "error-callback": () => onTokenRef.current(""),
      "response-field": false
    });
    widgetId.current = id;
    return () => {
      widgetId.current = null;
      api.remove(id);
    };
  }, [action, scriptReady, siteKey]);

  useEffect(() => {
    if (resetKey > 0 && widgetId.current) {
      window.turnstile?.reset(widgetId.current);
      onTokenRef.current("");
    }
  }, [resetKey]);

  if (!siteKey) return null;
  return <div className="public-form-challenge" aria-label="Spam protection verification">
    <Script
      src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      strategy="afterInteractive"
      onReady={() => setScriptReady(true)}
    />
    <div ref={container} />
  </div>;
}
