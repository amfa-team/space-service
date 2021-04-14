import type { ReactNode } from "react";
import React from "react";
import type { ApiSettings } from "../api/api";
import { useSpaceService } from "../api/settings/useApiSettings";
import type { SpaceDictionary } from "../i18n/dictionary";
import { defaultSpaceDictionary, useSetDictionary } from "../i18n/dictionary";

export interface SpaceServiceSettingsProps {
  children: JSX.Element | JSX.Element[] | ReactNode;
  settings: ApiSettings;
  dictionary: SpaceDictionary;
}

export function SpaceServiceSettings({
  settings,
  children,
  dictionary,
}: SpaceServiceSettingsProps): JSX.Element {
  useSpaceService(settings);
  useSetDictionary(dictionary);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
SpaceServiceSettings.defaultProps = {
  dictionary: defaultSpaceDictionary.en,
};
