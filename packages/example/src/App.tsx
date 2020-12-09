import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Admin from "./Admin";
import Public from "./Public";
import Space from "./Space";

const endpoint = process.env.API_ENDPOINT ?? "";

const settings = { endpoint };

function App(): ReactElement {
  return (
    <Switch>
      <Route path="/admin">
        <SpaceServiceSettings settings={settings}>
          <Admin />
        </SpaceServiceSettings>
      </Route>
      <Route path={`/:spaceName`}>
        <SpaceServiceSettings settings={settings}>
          <Space />
        </SpaceServiceSettings>
      </Route>
      <Route path={`/`}>
        <Public />
      </Route>
    </Switch>
  );
}

export default App;
