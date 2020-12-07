import { SpaceList, SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";

const endpoint = process.env.API_ENDPOINT ?? "";

const settings = { endpoint };

function Public(): ReactElement {
  return (
    <SpaceServiceSettings settings={settings}>
      <SpaceList>
        {(space) => (
          <div
            style={{ display: "inline-block", width: "300px", height: "300px" }}
          >
            {space.name}({space._id})
            {space.imageUrl && (
              <img src={space.imageUrl} width={300} alt="space" />
            )}
          </div>
        )}
      </SpaceList>
    </SpaceServiceSettings>
  );
}

export default Public;
