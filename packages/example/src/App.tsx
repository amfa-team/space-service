import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Admin from "./Admin";
import Public from "./Public";
import Space from "./Space";

function App(): ReactElement {
  return (
    <Switch>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path={`/:spaceName`}>
        <Space />
      </Route>
      <Route path={`/`}>
        <Public />
      </Route>
    </Switch>
  );
}

export default App;
