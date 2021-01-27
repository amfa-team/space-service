import {
  LoginAction,
  RegisterAction,
  defaultLoginDictionary,
  defaultLogoutDictionary,
  defaultRegisterDictionary,
  useConnect,
  useUser,
} from "@amfa-team/user-service";
import type { IPublicUserData } from "@amfa-team/user-service-types";
import React from "react";
import classes from "./menu.module.css";

function getStatus(
  isConnecting: boolean,
  isReady: boolean,
  user: IPublicUserData | null,
) {
  if (!isReady) {
    return "Checking...";
  }

  if (isConnecting) {
    return "Connecting...";
  }

  if (user === null) {
    return "Not connected";
  }

  return `Connected as ${user.email ?? "annonymous"} (${user.id})`;
}

export default function Menu() {
  const user = useUser();
  const { connect, isConnecting, isReady } = useConnect();

  return (
    <div className={classes.root}>
      <div>Menu</div>
      <div>{getStatus(isConnecting, isReady, user)}</div>
      <div className={classes.actions}>
        <div>
          <button type="button" onClick={connect} disabled={isConnecting}>
            Connect
          </button>
        </div>
        <RegisterAction dictionary={defaultRegisterDictionary.fr} />
        <LoginAction
          loginDictionary={defaultLoginDictionary.fr}
          logoutDictionary={defaultLogoutDictionary.fr}
        />
      </div>
    </div>
  );
}
