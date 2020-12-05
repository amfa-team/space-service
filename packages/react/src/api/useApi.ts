import type { HelloPayload } from "@amfa-team/hello-service-types";
import { createContext, useContext } from "react";
import { atom, selectorFamily, useRecoilValue } from "recoil";
import type { ApiSettings } from "./api";
import { apiGet, apiPost } from "./api";

export const helloQuery = selectorFamily<HelloPayload, ApiSettings>({
  key: "react/api/hello",
  get: (setting) => async () => {
    return apiGet(setting, "hello");
  },
});

export const whoamiState = atom<null | string>({
  key: "react/whoamiState",
  default: null,
});

export const helloYouQuery = selectorFamily<HelloPayload, ApiSettings>({
  key: "react/api/hello/you",
  get: (setting) => async ({ get }) => {
    const name = get(whoamiState);
    return apiPost(setting, "hello", { name });
  },
});

export const apiContext = createContext<ApiSettings | null>(null);

export function useApiSettings(): ApiSettings {
  const settings = useContext(apiContext);
  if (!settings) {
    throw new Error("useApiSettings: Settings are not set");
  }
  return settings;
}

export function useHelloMessage(): string {
  const settings = useApiSettings();
  const { message } = useRecoilValue(helloQuery(settings));

  return message;
}

export function useHelloYouMessage(): string {
  const settings = useApiSettings();
  const { message } = useRecoilValue(helloYouQuery(settings));

  return message;
}
