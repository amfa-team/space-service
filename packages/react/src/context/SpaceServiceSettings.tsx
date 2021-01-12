import type { ReactNode } from "react";
import React from "react";
import type { ApiSettings } from "../api/api";
import { useSpaceService } from "../api/settings/useApiSettings";

interface UserServiceSettingsProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
  settings: ApiSettings;
}

export function SpaceServiceSettings(
  props: UserServiceSettingsProps,
): JSX.Element {
  useSpaceService(props.settings);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{props.children}</>;
}
