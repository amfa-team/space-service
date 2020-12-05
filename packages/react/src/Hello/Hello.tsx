import type { ReactElement } from "react";
import React from "react";
import { apiContext } from "../api/useApi";
import { Async } from "../Loading/Loading";
import { HelloFromReact } from "./HelloFromReact/HelloFromReact";
import { HelloFromShared } from "./HelloFromShared/HelloFromShared";
import { HelloYouFromApi } from "./HelloYouFromApi/HelloYouFromApi";
import { WhoAreYou } from "./WhoAreYou/WhoAreYou";

interface HelloProps {
  endpoint: string;
}

export function Hello(props: HelloProps): ReactElement {
  return (
    <apiContext.Provider value={{ endpoint: props.endpoint }}>
      <HelloFromReact />
      <Async>
        <HelloFromShared />
      </Async>
      <WhoAreYou />
      <Async>
        <HelloYouFromApi />
      </Async>
    </apiContext.Provider>
  );
}
