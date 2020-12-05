import { helloWorld } from "@amfa-team/space-service-shared";
import type { HelloData, HelloPayload } from "@amfa-team/space-service-types";
import { JsonDecoder } from "ts.data.json";
import { InvalidRequestError } from "../services/io/exceptions";
import type { HandlerResult } from "../services/io/types";
// @ts-ignore
import { messages } from "./message";

export async function handleHello(): Promise<HandlerResult<HelloPayload>> {
  return { payload: { message: helloWorld(null, "Api") } };
}

export const helloYouDecoder = JsonDecoder.object(
  {
    name: JsonDecoder.oneOf(
      [JsonDecoder.isExactly(null), JsonDecoder.string],
      "name",
    ),
  },
  "helloYouDecoder",
);

export async function handleHelloYou(
  data: HelloData,
): Promise<HandlerResult<HelloPayload>> {
  if (data.name === null) {
    throw new InvalidRequestError(messages.missingName, 400);
  }

  return { payload: { message: helloWorld(data.name, "Api") } };
}
