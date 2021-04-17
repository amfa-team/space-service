import type { ISpace } from "@amfa-team/space-service-types";
import fetchRetry from "fetch-retry";
import originalFetch from "node-fetch";

// @ts-ignore
const fetch = fetchRetry(originalFetch, {
  retries: 5,
  retryDelay: 300,
});

export async function getSpace(
  slug: string,
  token: null | string,
): Promise<ISpace | null> {
  const endpoint = process.env.SPACE_SERVICE_API_ENDPOINT;

  const res = await fetch(`${endpoint}get`, {
    retryOn(attempt, error, response) {
      // retry on any network error, or 4xx or 5xx status codes
      if (
        error !== null ||
        !response ||
        response.status >= 500 ||
        response.status === 429
      ) {
        return true;
      }
      return false;
    },
    method: "POST",
    body: JSON.stringify({ slug, token }),
  });

  const result = await res.json();

  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error(result);
    throw new Error("[space-service-node/getSpace]: unexpected error");
  }

  return result.payload.space;
}
