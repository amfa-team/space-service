import { useCallback, useEffect, useState } from "react";
import { apiPost } from "../../api";
import { useApiSettings } from "../../settings/useApiSettings";

export type SpaceUpdateData = {
  slug: string;
  name: string;
  enabled: boolean;
  public: boolean;
  home: boolean;
  random: boolean;
  order: number;
  image: File | string | null;
};

function useUploadImage() {
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

export function useAdminSpaceUpdate() {
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
          public: data.public,
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
