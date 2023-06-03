import styles from "@/styles/components/apiError.module.scss";
import { AlertCircle } from "react-feather";

export function ApiError() {
  return (
    <div className="container">
      <section className={styles.error}>
        <h2>
          <AlertCircle />
          Oh no!
        </h2>
      </section>
    </div>
  );
}
