import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import HomeFeature from "./HomeFeature/HomeFeature";
import Menu from "./Menu/Menu";
import SpaceFeature from "./SpaceFeature/SpaceFeature";

const endpoint = process.env.API_ENDPOINT ?? "";
const settings = { endpoint };

function Public(): ReactElement | null {
  return (
    <SpaceServiceSettings settings={settings}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <HomeFeature />
        </Route>
        <Route path="/space/:spaceName">
          <SpaceFeature />
        </Route>
        <Route path="/space">
          <SpaceFeature />
        </Route>
      </Switch>
    </SpaceServiceSettings>
  );
}

export default Public;
