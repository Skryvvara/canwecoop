import styles from "@/styles/components/loadingSpinner.module.scss";
import { Loader } from "react-feather";

export function LoadingSpinner() {
  return (
    <span className={styles.loader}>
      <Loader />
    </span>
  );
}
