import type { ReactNode } from "react";
import styles from "./ProductEntityShell.module.css";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ProductEntityShell({ children, className }: Props) {
  return <section className={`page shell product-entity-page ${styles.shell}${className ? ` ${className}` : ""}`}>{children}</section>;
}
