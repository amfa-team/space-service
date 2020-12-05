import React from "react";
import { useRecoilState } from "recoil";
import { whoamiState } from "../../api/useApi";
import styles from "../HelloFromShared/helloFromShared.module.css";

export function WhoAreYou(): JSX.Element {
  const [whoami, setWhoami] = useRecoilState(whoamiState);
  return (
    <div className={styles.box}>
      <h4 className={styles.title}>{"What's your name?"}</h4>
      <p className={styles.text}>
        You need to give your name in order to fix API call.
      </p>
      <p className={styles.text}>
        <input
          value={whoami ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setWhoami(e.target.value || null)
          }
        />
      </p>
    </div>
  );
}
