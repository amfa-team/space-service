import type { ISpace } from "@amfa-team/space-service-types";
import { useEffect, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import type { ApiSettings } from "./api";
import { apiGet } from "./api";

const apiSettingsAtom = atom<ApiSettings | null>({
  key: "room-service/useApi/apiSettings",
  default: null,
});

export function useSpaceService(settings: ApiSettings) {
  const [s, setSettings] = useRecoilState(apiSettingsAtom);
  useEffect(() => {
    setSettings(settings);
  }, [setSettings, settings]);

  return s !== null;
}

export function useApiSettings(): ApiSettings | null {
  const settings = useRecoilValue(apiSettingsAtom);
  return settings;
}

export function useSpaceList() {
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      apiGet<"list">(settings, "list", abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpaces(result.spaces);
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            setError(e);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [settings]);

  if (error) {
    throw error;
  }

  return {
    spaces,
  };
}
