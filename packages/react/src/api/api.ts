import type {
  GetRoutes,
  PostRoutes,
  Response,
} from "@amfa-team/space-service-types";

export type ApiSettings = {
  endpoint: string;
  secret?: string;
};

export async function apiGet<P extends keyof GetRoutes>(
  settings: ApiSettings,
  path: P,
  signal: AbortSignal | null = null,
): Promise<GetRoutes[P]["out"]> {
  const res = await fetch(settings.endpoint + path, {
    method: "GET",
    signal,
  });

  const response: Response<GetRoutes[P]["out"]> | null = await res
    .json()
    .catch(() => null);

  if (!res.ok || !response?.success) {
    let message = `apiGet: failed with "${res.status}"`;
    if (!response?.success) {
      message += ` and error "${response?.error}"`;
    }
    throw new Error(message);
  }

  return response.payload;
}

export async function apiPost<P extends keyof PostRoutes>(
  settings: ApiSettings,
  path: P,
  data: PostRoutes[P]["in"],
  signal: AbortSignal | null = null,
): Promise<PostRoutes[P]["out"]> {
  const res = await fetch(settings.endpoint + path, {
    method: "POST",
    body: JSON.stringify(data),
    signal,
  });

  const response: Response<
    PostRoutes[P]["out"]
  > | null = await res.json().catch(() => null);

  if (!res.ok || !response?.success) {
    let message = `apiPost: failed with "${res.status}"`;
    if (!response?.success) {
      message += ` and error "${response?.error}"`;
    }
    throw new Error(message);
  }

  return response.payload;
}
