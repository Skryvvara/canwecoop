import styles from "@/styles/components/searchMenu.module.scss";
import { PropsWithChildren } from "react";

export function SearchMenu(props: PropsWithChildren) {
  return (
    <section aria-label="search" className={styles.searchMenu}>
      {props.children}
    </section>
  );
}
