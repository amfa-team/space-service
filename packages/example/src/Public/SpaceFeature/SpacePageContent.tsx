import type { ISpace } from "@amfa-team/space-service-types";
import React from "react";

export function SpacePageContent({ space }: ISpace) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "300px",
        height: "300px",
      }}
    >
      {space.name}({space._id})
      {space.imageUrl && <img src={space.imageUrl} width={300} alt="space" />}
    </div>
  );
}
