import type { ReactElement } from "react";
import React from "react";
import { Hello } from "@amfa-team/space-service";

const endpoint = process.env.API_ENDPOINT ?? "";

function App(): ReactElement {
  return (
    <div>
      <Hello endpoint={endpoint} />
    </div>
  );
}

export default App;
