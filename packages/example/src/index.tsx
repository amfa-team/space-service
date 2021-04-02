import {
  DotLoader,
  ModalRoot,
  SbsThemeProvider,
} from "@amfa-team/theme-service";
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "normalize.css/normalize.css";
import "react-datepicker/dist/react-datepicker.css";
import "@amfa-team/theme-service/dist/index.css";
// import "@amfa-team/space-service/dist/index.css";
import "@amfa-team/user-service/dist/index.css";
import "./global.css";

init({
  dsn: process.env.SENTRY_DNS,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.1,
  environment: process.env.SENTRY_ENVIRONMENT,
  enabled: Boolean(process.env.SENTRY_ENVIRONMENT),
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RecoilRoot>
        <SbsThemeProvider>
          <Suspense fallback={DotLoader}>
            <ModalRoot />
            <App />
          </Suspense>
        </SbsThemeProvider>
      </RecoilRoot>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);
