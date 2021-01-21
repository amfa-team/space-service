import type { ISpace } from "@amfa-team/space-service-types";
import fetch from "node-fetch";

export async function getSpace(
  slug: string,
  token: null | string,
): Promise<ISpace | null> {
  const endpoint = process.env.SPACE_SERVICE_API_ENDPOINT;

  const res = await fetch(`${endpoint}admin/ban/check`, {
    method: "POST",
    body: JSON.stringify({ slug, token }),
  });

  const result = await res.json();

  if (!result.success) {
    throw new Error("[space-service-node/getSpace]: unexpected error");
  }

  return result.payload.space;
}
