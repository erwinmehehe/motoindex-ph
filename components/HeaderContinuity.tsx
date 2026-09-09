"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function matchesSection(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/motorcycles") return pathname.startsWith("/motorcycles");
  if (href === "/finder") return pathname.startsWith("/finder");
  if (href === "/commute") return pathname.startsWith("/commute");
  if (href === "/compare") return pathname.startsWith("/compare");
  if (href === "/recommendations") return pathname.startsWith("/recommendations");
  if (href === "/gear/helmets") return pathname.startsWith("/gear/helmets");
  if (href === "/tires") return pathname.startsWith("/tires");
  if (href === "/accessories") return pathname.startsWith("/accessories");
  if (href === "/ownership") return pathname.startsWith("/ownership");
  if (href === "/dealers") return pathname.startsWith("/dealers") || pathname.startsWith("/sellers/");
  if (href === "/search") return pathname.startsWith("/search");
  if (href === "/shortlist") return pathname.startsWith("/shortlist");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderContinuity() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!header) return;

    const allMenus = Array.from(header.querySelectorAll<HTMLDetailsElement>("details"));
    const desktopMenus = Array.from(header.querySelectorAll<HTMLDetailsElement>(".nav-links details.nav-more"));
    const closeMenus = (except?: HTMLDetailsElement) => {
      allMenus.forEach(details => { if (details !== except && details.open) details.removeAttribute("open"); });
    };

    closeMenus();
    header.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach(link => {
      const href = link.getAttribute("href") || "";
      const active = matchesSection(pathname, href);
      link.classList.toggle("nav-current", active);
      if (active) link.setAttribute("aria-current", pathname === href ? "page" : "location");
      else link.removeAttribute("aria-current");
    });

    const gearSummary = header.querySelector<HTMLElement>(".nav-gear>summary");
    const gearActive = pathname.startsWith("/gear/") || pathname.startsWith("/tires") || pathname.startsWith("/accessories");
    gearSummary?.classList.toggle("nav-current", gearActive);
    if (gearActive) gearSummary?.setAttribute("aria-current", "location"); else gearSummary?.removeAttribute("aria-current");

    const moreSummary = header.querySelector<HTMLElement>(".nav-moremenu>summary");
    const moreActive = pathname.startsWith("/ownership") || pathname.startsWith("/dealers") || pathname.startsWith("/sellers/") || pathname.startsWith("/commute") || pathname.startsWith("/tools") || pathname.startsWith("/fitment") || pathname.startsWith("/maintenance");
    moreSummary?.classList.toggle("nav-current", moreActive);
    if (moreActive) moreSummary?.setAttribute("aria-current", "location"); else moreSummary?.removeAttribute("aria-current");

    const handleMenuToggle = (event: Event) => { const current = event.currentTarget as HTMLDetailsElement; if (current.open) closeMenus(current); };
    desktopMenus.forEach(menu => menu.addEventListener("toggle", handleMenuToggle));
    const handleClick = (event: Event) => { const target = event.target as Element | null; if (target?.closest("a[href]")) closeMenus(); };
    const handleOutsidePointer = (event: PointerEvent) => { const target = event.target as Node | null; if (target && !header.contains(target)) closeMenus(); };
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { closeMenus(); header.querySelector<HTMLElement>(".nav-more>summary:focus")?.focus(); } };

    header.addEventListener("click", handleClick);
    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      desktopMenus.forEach(menu => menu.removeEventListener("toggle", handleMenuToggle));
      header.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);
  return null;
}
