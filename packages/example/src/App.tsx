import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Admin from "./Admin";
import Public from "./Public";
import Space from "./Space";

const endpoint = process.env.API_ENDPOINT ?? "";

const settings = { endpoint };

function App(): ReactElement {
  return (
    <Switch>
      <Route path="/admin/:pageName">
        <Admin />
      </Route>
      <Route path="/admin">
        <Redirect to="/admin/space" />
      </Route>
      <SpaceServiceSettings settings={settings}>
        <Route path={`/:spaceName`}>
          <Space />
        </Route>
        <Route path={`/`}>
          <Public />
        </Route>
      </SpaceServiceSettings>
    </Switch>
  );
}

export default App;
