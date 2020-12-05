import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  handleHello,
  handleHelloYou,
  helloYouDecoder,
} from "./hello/helloController";
import { handlePublicGET, handlePublicPOST } from "./services/io/io";

export async function hello(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  return handlePublicGET<"hello">(event, handleHello);
}

export async function helloYou(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  return handlePublicPOST<"hello">(event, handleHelloYou, helloYouDecoder);
}
