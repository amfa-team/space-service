import type { Context } from "aws-lambda";
import mongoose from "mongoose";
import type { Mongoose } from "mongoose";
import { logger } from "../services/io/logger";
import { getEnv, getEnvName } from "../utils/env";

const cachedClientMap: Map<string, Promise<Mongoose>> = new Map();
let closing = false;

async function getClient(url: string): Promise<Mongoose> {
  logger.info("[mongo/client:getClient]: connecting to mongodb");

  let cachedClient = cachedClientMap.get(url) ?? null;
  if (cachedClient) {
    logger.info("[mongo/client:getClient]: using cached mongodb client");
    return cachedClient;
  }

  try {
    cachedClient = mongoose.connect(url, {
      appname: `room-service-${getEnvName()}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10_000,
      socketTimeoutMS: 30_000,
      keepAlive: true,
      keepAliveInitialDelay: 300_000,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    cachedClientMap.set(url, cachedClient);

    const client: Mongoose = await cachedClient;

    logger.info("[mongo/client:connect]: connected to mongodb", {
      url,
    });

    client.connection.on("error", (err) => {
      logger.error(err, "[mongo/client:event]: error");
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("reconnectFailed", (err) => {
      logger.error(err, "[mongo/client:event]: reconnectFailed");
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("disconnected", () => {
      logger.error(new Error("[mongo/client:event]: disconnected"));
    });

    client.connection.on("connected", () => {
      logger.info("[mongo/client:event]: connected");
    });

    client.connection.on("reconnected", () => {
      logger.warn("[mongo/client:event]: reconnected");
    });

    client.connection.on("close", () => {
      logger.warn("[mongo/client:event]: close");
      cachedClientMap.delete(url);
      if (!closing) {
        getClient(url).catch((e) => logger.error(e));
      }
    });

    return client;
  } catch (e) {
    const message = "[mongo/client:connect]: unable to connect to mongodb";
    logger.error(e, message);
    throw new Error(message);
  }
}

export async function connect(context: Context | null): Promise<Mongoose> {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false;
  }
  // mongoose.set("debug", true);

  return getClient(getEnv("MONGO_DB_URL"));
}

export function close(context: Context | null) {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = true;
  }
  closing = true;
}
