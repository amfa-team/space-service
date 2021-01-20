import { SpacePage } from "@amfa-team/space-service";
import { DotLoader } from "@amfa-team/theme-service";
import {
  defaultLoginDictionary,
  defaultLogoutDictionary,
  defaultRegisterDictionary,
  defaultRestrictedPageDictionary,
} from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { SpaceForm } from "./SpaceForm";

function SpaceFeature(): ReactElement {
  const { spaceName } = useParams<{ spaceName: string | undefined }>();

  return (
    <div>
      <h3>Space Feature</h3>
      <SpaceForm />
      <SpacePage
        slug={spaceName ?? ""}
        loginDictionary={defaultLoginDictionary.fr}
        logoutDictionary={defaultLogoutDictionary.fr}
        registerDictionary={defaultRegisterDictionary.fr}
        dictionary={defaultRestrictedPageDictionary.fr}
        LoadingComponent={DotLoader}
      >
        {(space) => {
          if (space === null) {
            return <p>Not found</p>;
          }

          return (
            <div
              style={{
                display: "inline-block",
                width: "300px",
                height: "300px",
              }}
            >
              {space.name}({space._id})
              {space.imageUrl && (
                <img src={space.imageUrl} width={300} alt="space" />
              )}
            </div>
          );
        }}
      </SpacePage>
    </div>
  );
}

export default SpaceFeature;
