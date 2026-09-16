import type { ReactNode } from "react";
import { RecommendationDetailStyle } from "./RecommendationDetailStyle";

export default function RecommendationDetailLayout({ children }: { children: ReactNode }) {
  return <div className="recommendation-detail-scope"><RecommendationDetailStyle />{children}</div>;
}
