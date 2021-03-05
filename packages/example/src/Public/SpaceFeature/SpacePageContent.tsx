import type { ISpace } from "@amfa-team/space-service-types";
import React from "react";

export function SpacePageContent({ space }: { space: ISpace }) {
  return (
    <div
      style={{
        display: "inline-block",
        width: "300px",
        height: "300px",
      }}
    >
      <h2>
        {space.name}({space._id})
      </h2>
      {space.imageUrl && <img src={space.imageUrl} width={300} alt="space" />}
      <h3>highlight: </h3>
      <p>{space.highlight}</p>
      <h3>description: </h3>
      <div dangerouslySetInnerHTML={{ __html: space.description ?? "" }} />
      <h3>tags: </h3>
      <p>{space.tags?.join(", ")}</p>
    </div>
  );
}
