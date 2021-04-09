import type { GetSpacePayload, ISpace } from "@amfa-team/space-service-types";
import { useToken as useJwtToken, useUser } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useEffect, useState } from "react";
import type { ApiSettings } from "../api";
import { apiGet, apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export async function getSpaces(
  settings: ApiSettings,
  signal?: AbortSignal,
): Promise<ISpace[]> {
  const result = await apiGet<"list">(settings, "list", signal);
  return result.spaces;
}

export async function getSpace(
  settings: ApiSettings,
  slug: string,
  token: string,
  signal?: AbortSignal,
): Promise<GetSpacePayload> {
  const result = await apiPost<"get">(settings, "get", { slug, token }, signal);
  return result;
}

export function useSpaceList(
  initialSpaces: ISpace[],
  profile: boolean = false,
) {
  const [spaces, setSpaces] = useState<ISpace[]>(initialSpaces);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const token = useJwtToken();
  const user = useUser();
  const settings = useApiSettings();

  useEffect(() => {
    if (!profile) {
      setSpaces(initialSpaces);
    }
    setRetryCount(0);
  }, [initialSpaces, profile]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    if (settings) {
      if (!profile) {
        getSpaces(settings, abortController.signal)
          .then((result) => {
            if (!abortController.signal.aborted) {
              setSpaces((prev) => {
                return isEqual(prev, result) ? prev : result;
              });
            }
          })
          .catch((e) => {
            if (!abortController.signal.aborted) {
              if (retryCount < 3) {
                setRetryCount(retryCount + 1);
              } else {
                setError(e);
              }
            }
          });
      } else {
        Promise.allSettled(
          Object.keys(user?.permissions ?? []).map(async (slug: string) => {
            return getSpace(
              settings,
              slug,
              token ?? "",
              abortController.signal,
            );
          }),
        )
          .then((userSpaces) => {
            if (!abortController.signal.aborted) {
              const result = userSpaces.reduce(
                // @ts-ignore
                (acc, item) => [
                  ...acc,
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  (({ createdAt, updatedAt, __v, id, ...rest }): ISpace =>
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    ({ ...rest }))(
                    // @ts-ignore
                    item.value.space,
                  ),
                ],
                [],
              );
              // @ts-ignore
              setSpaces(result);
            }
          })
          .catch((e) => {
            if (!abortController.signal.aborted) {
              if (retryCount < 3) {
                setRetryCount(retryCount + 1);
              } else {
                setError(e);
              }
            }
          });
      }
    }

    return () => {
      abortController.abort();
    };
  }, [settings, retryCount, profile, token, user]);

  if (error) {
    throw error;
  }

  return {
    spaces,
  };
}
