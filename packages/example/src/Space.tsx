import { useSpace } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { useParams } from "react-router-dom";

function Space(): ReactElement {
  const { spaceName } = useParams<{ spaceName: string }>();
  const { space } = useSpace(spaceName);

  if (!space) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "inline-block", width: "300px", height: "300px" }}>
      {space.name}({space._id})
      {space.imageUrl && <img src={space.imageUrl} width={300} alt="space" />}
    </div>
  );
}

export default Space;
