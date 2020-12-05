import { SpaceList, SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";

const endpoint = process.env.API_ENDPOINT ?? "";

const settings = { endpoint };

function App(): ReactElement {
  return (
    <SpaceServiceSettings settings={settings}>
      <SpaceList>
        {(space) => (
          <div>
            {space.name}({space.id})
          </div>
        )}
      </SpaceList>
    </SpaceServiceSettings>
  );
}

export default App;
