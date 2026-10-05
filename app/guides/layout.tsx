import type { ReactNode } from "react";
export default function ReviewedLayout({ children }: { children: ReactNode }) {
  return <div className="reviewed-design">{children}</div>;
}
