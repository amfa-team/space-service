import { logger } from "../services/io/logger";

export function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`getEnv: missing env-var "${key}"`);
  }

  return value;
}

export function getOptionalEnv(
  key: string,
  defaultValue: string,
): string | null {
  const value = process.env[key] ?? null;

  if (!value) {
    logger.warn(
      `getOptionalEnv: missing env-var "${key}", using default value "${defaultValue}"`,
    );

    return defaultValue;
  }

  return value;
}

export function getEnvName(): string {
  return getEnv("SENTRY_ENVIRONMENT");
}
