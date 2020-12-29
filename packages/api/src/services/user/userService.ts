import jwt from "jsonwebtoken";
import { getEnv } from "../../utils/env";

const USER_SERVICE_API_SECRET: string = getEnv("USER_SERVICE_API_SECRET");

const ISSUER = "user-service";

interface IPublicUser {
  id: string;
  registered: boolean;
}

export function parseUserServiceToken(token: string): IPublicUser {
  return jwt.verify(token, USER_SERVICE_API_SECRET, {
    issuer: ISSUER,
  }) as IPublicUser;
}
