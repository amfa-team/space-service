import type {
  IPoll,
  IPollVote,
  WsServerEvents,
} from "@amfa-team/space-service-types";
import { useToken } from "@amfa-team/user-service";
import { useCallback, useEffect, useState } from "react";
import type { Ws } from "../../websocket/Ws";
import type { WsEvent } from "../../websocket/WsEvent";
import type { ApiSettings } from "../api";
import { apiPost } from "../api";
import { useApiSettings } from "../settings/useApiSettings";

async function getVote(
  settings: ApiSettings | null | void,
  token: string | null,
  poll: IPoll,
  signal?: AbortSignal,
): Promise<IPollVote | null> {
  if (!token || !settings) {
    return null;
  }

  const result = await apiPost<"polls/vote/get">(
    settings,
    "polls/vote/get",
    {
      token,
      pollId: poll._id,
    },
    signal,
  );

  return result.vote;
}

async function submitVote(
  settings: ApiSettings | null | void,
  token: string | null,
  poll: IPoll,
  choice: string,
  signal?: AbortSignal,
): Promise<boolean> {
  if (!token || !settings || !poll.choices.find((c) => c === choice)) {
    return false;
  }

  const result = await apiPost<"polls/vote/submit">(
    settings,
    "polls/vote/submit",
    {
      token,
      pollId: poll._id,
      spaceSlug: poll.spaceSlug,
      choice,
    },
    signal,
  );

  return result.success;
}

export function useVote(poll: IPoll, websocket: Ws | null) {
  const token = useToken();
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [choice, setChoice] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const settings = useApiSettings();

  const checkVoteStatus = useCallback(
    async (
      s: ApiSettings | null | void,
      t: string | null,
      p: IPoll,
      signal?: AbortSignal,
    ) => {
      try {
        const vote = await getVote(s, t, p, signal);
        if (!signal?.aborted) {
          setHasVoted(vote !== null);
          if (vote !== null) {
            setChoice(vote.choice);
          }
        }
      } catch (err) {
        if (!signal?.aborted) {
          setError(err);
        }
      } finally {
        if (!signal?.aborted) {
          // loading is completed only if settings & token were set
          setIsLoading(!(s && t));
        }
      }
    },
    [],
  );

  const onSubmitVote = useCallback(async () => {
    try {
      setIsVoting(true);
      await submitVote(settings, token, poll, choice);
      await checkVoteStatus(settings, token, poll);
    } catch (e) {
      setError(e);
    } finally {
      setIsVoting(false);
    }
  }, [settings, token, poll, choice, checkVoteStatus]);

  useEffect(() => {
    const abortController = new AbortController();

    setIsLoading(false);
    setHasVoted(false);
    checkVoteStatus(settings, token, poll, abortController.signal).catch(
      (err) => {
        setError(err);
      },
    );
    const listener = (event: WsEvent<"server", WsServerEvents>) => {
      if (event.data.name === "polls/vote" && event.data.pollId === poll._id) {
        checkVoteStatus(settings, token, poll, abortController.signal).catch(
          (err) => {
            setError(err);
          },
        );
      }
    };

    websocket?.addEventListener("server", listener);

    return () => {
      websocket?.removeEventListener("server", listener);
      abortController.abort();
    };
  }, [settings, token, poll, checkVoteStatus, websocket]);

  if (error) {
    throw error;
  }

  return {
    isLoading,
    onSubmitVote,
    setChoice,
    isVoting,
    choice,
    hasVoted,
    canVote: !hasVoted && poll.status === "started",
  };
}
