import type { ISpace } from "@amfa-team/space-service-types";
import type { ReactNode } from "react";
import React from "react";
import { useSpaceList } from "../api/space/useSpaceList";

interface SpaceListProps {
  initialSpaces: ISpace[];
  profile: boolean;
  children: (space: ISpace) => ReactNode;
}

export function SpaceList(props: SpaceListProps) {
  const { spaces } = useSpaceList(props.initialSpaces, props.profile);

  return (
    <>
      {spaces.map((space) => {
        return (
          <React.Fragment key={space._id}>
            {props.children(space)}
          </React.Fragment>
        );
      })}
    </>
  );
}

SpaceList.defaultProps = {
  initialSpaces: [],
  profile: false,
};
