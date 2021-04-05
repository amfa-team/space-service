import type {
  IQuorum,
  ISpace,
  WsServerEvents,
} from "@amfa-team/space-service-types";
import { useToken } from "@amfa-team/user-service";
import isEqual from "lodash.isequal";
import { useCallback, useEffect, useState } from "react";
import type { Ws } from "../../websocket/Ws";
import type { WsEvent } from "../../websocket/WsEvent";
import type { ApiSettings } from "../api";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

export async function getQuorum(
  settings: ApiSettings | null | void,
  token: string | null,
  spaceSlug: string,
  save: boolean,
  signal?: AbortSignal,
): Promise<IQuorum | null> {
  if (!token || !settings) {
    return null;
  }

  const result = await apiPost<"quorum/get">(
    settings,
    "quorum/get",
    {
      token,
      spaceSlug,
      save,
    },
    signal,
  );

  return result.quorum;
}

export async function getQuorums(
  settings: ApiSettings | null | void,
  token: string | null,
  spaceSlug: string,
  signal?: AbortSignal,
): Promise<IQuorum[]> {
  if (!token || !settings) {
    return [];
  }

  const result = await apiPost<"quorum/list">(
    settings,
    "quorum/list",
    {
      token,
      spaceSlug,
    },
    signal,
  );

  return result.quorums;
}

export function useQuorums(space: ISpace, websocket: Ws | null) {
  const token = useToken();
  const [quorums, setQuorums] = useState<IQuorum[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const settings = useApiSettings();

  useEffect(() => {
    setQuorums([]);
    setIsLoading(true);
  }, [space]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    setIsLoading(true);

    const update = () => {
      getQuorums(settings, token, space._id, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setQuorums((prev) => {
              return isEqual(prev, result) ? prev : result;
            });
            setError(null);
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            setError(e);
          }
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setIsLoading(!(settings && token));
          }
        });
    };

    const listener = (event: WsEvent<"server", WsServerEvents>) => {
      if (event.data.name === "quorum/saved") {
        update();
      }
    };

    websocket?.addEventListener("server", listener);

    update();

    return () => {
      websocket?.removeEventListener("server", listener);
      abortController.abort();
    };
  }, [settings, space._id, token, websocket]);

  if (error) {
    throw error;
  }

  return {
    isLoading,
    quorums,
  };
}

export function useLiveQuorum(space: ISpace, websocket: Ws | null) {
  const token = useToken();
  const [liveQuorum, setLiveQuorum] = useState<IQuorum | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const settings = useApiSettings();

  useEffect(() => {
    setLiveQuorum(null);
    setIsLoading(true);
    setIsSaving(false);
  }, [space]);

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);

    setIsLoading(true);

    const update = () => {
      getQuorum(settings, token, space._id, false, abortController.signal)
        .then((result) => {
          if (!abortController.signal.aborted) {
            setLiveQuorum((prev) => {
              return isEqual(prev, result) ? prev : result;
            });
            setError(null);
          }
        })
        .catch((e) => {
          if (!abortController.signal.aborted) {
            setError(e);
          }
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setIsLoading(!(settings && token));
          }
        });
    };

    const listener = (event: WsEvent<"server", WsServerEvents>) => {
      if (event.data.name === "quorum/live") {
        update();
      }
    };

    websocket?.addEventListener("server", listener);

    update();

    return () => {
      abortController.abort();
    };
  }, [settings, space._id, token, websocket]);

  const saveQuorum = useCallback(async () => {
    setIsSaving(true);
    await getQuorum(settings, token, space._id, true)
      .catch((e) => {
        if (e) {
          setError(e);
        }
      })
      .finally(() => {
        setIsSaving(false);
      });
  }, [settings, token, space._id]);

  if (error) {
    throw error;
  }

  return {
    isLoading,
    liveQuorum,
    saveQuorum,
    isSaving,
  };
}
