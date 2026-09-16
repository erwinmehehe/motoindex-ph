import type { ReactNode } from "react";
import { HelmetGridRepairStyle } from "./HelmetGridRepairStyle";

export default function HelmetRoutesLayout({ children }: { children: ReactNode }) {
  return <><HelmetGridRepairStyle />{children}</>;
}
