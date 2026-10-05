import type { ReactNode } from "react";
import "./helmet-review.css";

export default function HelmetDetailLayout({ children }: { children: ReactNode }) {
  return <div className="mx-review mx-helmet-detail">{children}</div>;
}
