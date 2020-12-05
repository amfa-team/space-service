import React from "react";
import { useHelloYouMessage } from "../../api/useApi";
import styles from "../HelloFromShared/helloFromShared.module.css";

export function HelloYouFromApi(): JSX.Element {
  const message = useHelloYouMessage();
  return (
    <div className={styles.box}>
      <h4 className={styles.title}>{message}</h4>
      <p className={styles.text}>This title is generated using API.</p>
    </div>
  );
}
