"use client";

import { useState } from "react";

export function ShareModelButton({ label = "Share" }: { label?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      }
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // User-cancelled native share dialogs should not create an error state.
    }
  }

  return <button type="button" className="button ghost on-light share-model-button" onClick={share}>{copied ? "Link copied ✓" : label}</button>;
}
