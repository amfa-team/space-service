import { Quorum, SpacePage } from "@amfa-team/space-service";
import { DotLoader } from "@amfa-team/theme-service";
import {
  defaultLoginDictionary,
  defaultLogoutDictionary,
  defaultRegisterDictionary,
  defaultRestrictedPageDictionary,
} from "@amfa-team/user-service";
import type { ReactElement } from "react";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import { SpaceForm } from "../SpaceFeature/SpaceForm";

function QuorumFeature(): ReactElement {
  const { spaceName } = useParams<{ spaceName: string | undefined }>();

  const render = useCallback((space) => {
    if (space === null) {
      return <p>Not found</p>;
    }

    return <Quorum space={space} />;
  }, []);

  return (
    <div>
      <h3>Quorum Feature</h3>
      <SpaceForm />
      <SpacePage
        slug={spaceName ?? ""}
        loginDictionary={defaultLoginDictionary.fr}
        logoutDictionary={defaultLogoutDictionary.fr}
        registerDictionary={defaultRegisterDictionary.fr}
        dictionary={defaultRestrictedPageDictionary.fr}
        LoadingComponent={DotLoader}
      >
        {render}
      </SpacePage>
    </div>
  );
}

export default QuorumFeature;
