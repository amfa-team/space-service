import { atom } from "recoil";
import type { ApiSettings } from "./api";

export const apiSettingsAtom = atom<ApiSettings | null>({
  key: "space-service/useApi/apiSettings",
  default: null,
});
