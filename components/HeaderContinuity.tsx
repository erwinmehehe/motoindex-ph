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
    const mobileGroups = Array.from(header.querySelectorAll<HTMLDetailsElement>(".mobile-menu-group"));
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

    const motorcyclesSummary = header.querySelector<HTMLElement>(".nav-motorcycles>summary");
    const motorcyclesActive = pathname.startsWith("/motorcycles") || pathname.startsWith("/used-motorcycles");
    motorcyclesSummary?.classList.toggle("nav-current", motorcyclesActive);
    if (motorcyclesActive) motorcyclesSummary?.setAttribute("aria-current", "location"); else motorcyclesSummary?.removeAttribute("aria-current");

    const guidesSummary = header.querySelector<HTMLElement>(".nav-guides>summary");
    const guidesActive = pathname.startsWith("/recommendations") || pathname.startsWith("/guides");
    guidesSummary?.classList.toggle("nav-current", guidesActive);
    if (guidesActive) guidesSummary?.setAttribute("aria-current", "location"); else guidesSummary?.removeAttribute("aria-current");

    const ownershipSummary = header.querySelector<HTMLElement>(".nav-ownership>summary");
    const ownershipActive = ["/ownership", "/dealers", "/service-centers", "/commute", "/tools", "/maintenance", "/my", "/garage"].some(prefix => pathname === prefix || pathname.startsWith(prefix + "/"));
    ownershipSummary?.classList.toggle("nav-current", ownershipActive);
    if (ownershipActive) ownershipSummary?.setAttribute("aria-current", "location"); else ownershipSummary?.removeAttribute("aria-current");

    const handleMenuToggle = (event: Event) => {
      const current = event.currentTarget as HTMLDetailsElement;
      if (!current.open) return;
      // Mobile accordion groups must not close their parent mobile menu.
      const peers = current.classList.contains("mobile-menu-group") ? mobileGroups : desktopMenus;
      peers.forEach(menu => { if (menu !== current && menu.open) menu.removeAttribute("open"); });
    };
    [...desktopMenus, ...mobileGroups].forEach(menu => menu.addEventListener("toggle", handleMenuToggle));
    const handleClick = (event: Event) => { const target = event.target as Element | null; if (target?.closest("a[href]")) closeMenus(); };
    const handleOutsidePointer = (event: PointerEvent) => { const target = event.target as Node | null; if (target && !header.contains(target)) closeMenus(); };
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { closeMenus(); header.querySelector<HTMLElement>(".nav-more>summary:focus")?.focus(); } };

    header.addEventListener("click", handleClick);
    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      [...desktopMenus, ...mobileGroups].forEach(menu => menu.removeEventListener("toggle", handleMenuToggle));
      header.removeEventListener("click", handleClick);
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);
  return null;
}
