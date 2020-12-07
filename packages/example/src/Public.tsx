import { SpaceList } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";

function Public(): ReactElement {
  return (
    <SpaceList>
      {(space) => (
        <div
          style={{ display: "inline-block", width: "300px", height: "300px" }}
        >
          <a href={`/${space._id}`}>
            {space.name}({space._id})
          </a>
          {space.imageUrl && (
            <img src={space.imageUrl} width={300} alt="space" />
          )}
        </div>
      )}
    </SpaceList>
  );
}

export default Public;
