import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import HomeFeature from "./HomeFeature/HomeFeature";
import Menu from "./Menu/Menu";
import PollsFeature from "./PollsFeature/PollsFeature";
import QuorumFeature from "./QuorumFeature/QuorumFeature";
import SpaceFeature from "./SpaceFeature/SpaceFeature";
import VoteFeature from "./VoteFeature/VoteFeature";

const endpoint = process.env.API_ENDPOINT ?? "";
const wsEndpoint = process.env.WS_ENDPOINT ?? "";
const settings = { endpoint, wsEndpoint };

function Public(): ReactElement | null {
  return (
    <SpaceServiceSettings settings={settings}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <HomeFeature />
        </Route>
        <Route path="/space/:spaceName/quorum">
          <QuorumFeature />
        </Route>
        <Route path="/space/:spaceName/vote">
          <VoteFeature />
        </Route>
        <Route path="/space/:spaceName/polls">
          <PollsFeature />
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
