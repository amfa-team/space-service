import type { Context } from "aws-lambda";
import mongoose from "mongoose";
import type { Mongoose } from "mongoose";
import { logger } from "../services/io/logger";
import { getEnv, getEnvName } from "../utils/env";

const cachedClientMap: Map<string, Promise<Mongoose>> = new Map();

function discardClient(url: string, client?: Mongoose) {
  cachedClientMap.delete(url);
  if (client) {
    setTimeout(() => {
      // Do not discard immediately to not fail currently running operations
      client.disconnect().catch((e) => {
        logger.error(e, "[mongo/client:discardClient]: disconnect failed");
      });
    }, 30_000);
  }
}

async function getClient(url: string): Promise<Mongoose> {
  logger.info("[mongo/client:getClient]: connecting to mongodb");

  let cachedClient = cachedClientMap.get(url) ?? null;
  if (cachedClient) {
    const client: Promise<Mongoose> = cachedClient
      .then((c) => {
        if (c.connection.readyState === 1) {
          return c;
        }
        discardClient(url, c);
        return getClient(url);
      })
      .catch(async (e) => {
        logger.error(e, "[mongo/client:connect]: cache failed");
        discardClient(url);
        return getClient(url);
      });
    logger.info("[mongo/client:getClient]: using cached mongodb client");
    return client;
  }

  try {
    const instance = new mongoose.Mongoose();
    cachedClient = instance.connect(url, {
      appname: `user-service-${getEnvName()}`,
      useNewUrlParser: true,
      // https://github.com/Automattic/mongoose/issues/9262
      useUnifiedTopology: false,
      connectTimeoutMS: 10_000,
      poolSize: 5, // Maintain up to 5 socket connections
      serverSelectionTimeoutMS: 5_000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 600_000, // Close sockets after 10 minutes of inactivity
      keepAlive: true,
      keepAliveInitialDelay: 30_000,
      useFindAndModify: false,
      useCreateIndex: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
    });

    cachedClientMap.set(url, cachedClient);

    const client: Mongoose = await cachedClient;

    logger.info("[mongo/client:connect]: connected to mongodb", {
      url,
    });

    client.connection.on("error", (err) => {
      logger.error(err, "[mongo/client:event]: error");
      cachedClientMap.delete(url);
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("reconnectFailed", (err) => {
      logger.error(err, "[mongo/client:event]: reconnectFailed");
      cachedClientMap.delete(url);
      client.disconnect().catch((e) => logger.error(e));
    });

    client.connection.on("disconnected", () => {
      logger.warn("[mongo/client:event]: disconnected");
    });

    client.connection.on("connected", () => {
      logger.info("[mongo/client:event]: connected");
    });

    client.connection.on("reconnected", () => {
      logger.warn("[mongo/client:event]: reconnected");
    });

    client.connection.on("reconnectTries", () => {
      logger.warn("[mongo/client:event]: reconnectTries");
    });

    client.connection.on("close", () => {
      logger.warn("[mongo/client:event]: close");
      discardClient(url, client);
    });

    return client;
  } catch (e) {
    const message = "[mongo/client:connect]: unable to connect to mongodb";
    logger.error(e, message);
    throw new Error(message);
  }
}

export async function connect(context?: Context | null): Promise<Mongoose> {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = false;
  }
  mongoose.set("debug", true);

  return getClient(getEnv("MONGO_DB_URL"));
}

export function close(context?: Context | null) {
  if (context) {
    // eslint-disable-next-line no-param-reassign
    context.callbackWaitsForEmptyEventLoop = true;
  }
}
