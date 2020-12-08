import type { ISpace } from "@amfa-team/space-service-types";
import { useCallback, useEffect, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import type { ApiSettings } from "./api";
import { apiGet, apiPost } from "./api";

const apiSettingsAtom = atom<ApiSettings | null>({
  key: "space-service/useApi/apiSettings",
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

export function useSpace(slug: string) {
  const [space, setSpace] = useState<ISpace | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      apiPost<"get">(settings, "get", { slug }, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setSpace(result);
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
  }, [settings, slug]);

  if (error) {
    throw error;
  }

  return {
    space,
  };
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

export function useUploadImage() {
  const settings = useApiSettings();
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] = useState(new AbortController());
  const [imageUrl, setImageUrl] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsUploading(false);
    setAbortController(controller);

    return () => {
      controller.abort();
    };
  }, []);

  const upload = useCallback(
    async (name: string, file: File) => {
      if (settings) {
        const { uploadUrl } = await apiPost(
          settings,
          "admin/image/upload",
          { secret: settings.secret ?? "", name },
          abortController.signal,
        );

        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          credentials: "omit",
          headers: {
            "Cache-Control": "public, must-revalidate",
          },
        });

        const img = uploadUrl.split("?")[0];
        setImageUrl(img);
        return img;
      }

      return "";
    },
    [settings, abortController],
  );

  return {
    ready: settings !== null,
    isUploading,
    upload,
    imageUrl,
  };
}

export type SpaceUpdateData = {
  slug: string;
  name: string;
  enabled: boolean;
  home: boolean;
  random: boolean;
  order: number;
  image: File | string | null;
};

export function useSpaceUpdate() {
  const settings = useApiSettings();
  const { upload } = useUploadImage();

  const validate = useCallback((data: SpaceUpdateData | null) => {
    return Boolean(data?.name && data.slug);
  }, []);

  const update = useCallback(
    async (data: SpaceUpdateData | null) => {
      if (settings && data !== null && validate(data)) {
        const imageUrl =
          data.image instanceof File
            ? await upload(data.slug, data.image)
            : data.image;

        const space = {
          _id: data.slug,
          name: data.name,
          enabled: data.enabled,
          home: data.home,
          random: data.random,
          order: data.order,
          imageUrl,
        };

        return apiPost(settings, "admin/space/update", {
          secret: settings.secret ?? "",
          space,
        });
      }

      return null;
    },
    [upload, settings, validate],
  );

  return {
    update,
    validate,
  };
}
