import { Hello } from "@amfa-team/hello-service";
import type { ReactElement } from "react";
import React from "react";

const endpoint = process.env.API_ENDPOINT ?? "";

function App(): ReactElement {
  return (
    <div>
      <Hello endpoint={endpoint} />
    </div>
  );
}

export default App;
