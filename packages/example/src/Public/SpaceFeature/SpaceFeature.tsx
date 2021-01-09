import { useSpace } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { SpaceForm } from "./SpaceForm";

function SpaceFeature(): ReactElement {
  const { spaceName } = useParams<{ spaceName: string | undefined }>();
  const { space, loading } = useSpace(spaceName ?? "");

  if (!space) {
    return (
      <div>
        <h3>Space Feature</h3>
        <SpaceForm />
        <div>{loading ? "Loading..." : "Not found"}</div>
      </div>
    );
  }

  return (
    <div>
      <h3>Space Feature</h3>
      <SpaceForm />
      <div style={{ display: "inline-block", width: "300px", height: "300px" }}>
        {space.name}({space._id})
        {space.imageUrl && <img src={space.imageUrl} width={300} alt="space" />}
      </div>
    </div>
  );
}

export default SpaceFeature;
