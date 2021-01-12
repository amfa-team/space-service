import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import type { ApiSettings } from "../api";
import { apiSettingsAtom } from "../atoms";

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
