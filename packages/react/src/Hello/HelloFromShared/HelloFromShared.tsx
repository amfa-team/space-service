import React from "react";
import { useHelloMessage } from "../../api/useApi";
import styles from "./helloFromShared.module.css";

export function HelloFromShared(): JSX.Element {
  const message = useHelloMessage();
  return (
    <div className={styles.box}>
      <h4 className={styles.title}>{message}</h4>
      <p className={styles.text}>
        This title is generated using Shared module.
      </p>
    </div>
  );
}
