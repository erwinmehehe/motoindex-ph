import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ProductEntityShell({ children, className }: Props) {
  return <section className={`page shell product-entity-page${className ? ` ${className}` : ""}`}>{children}</section>;
}
