import { Endpoint, S3 } from "aws-sdk";

const S3_CONFIG = process.env.IS_OFFLINE
  ? {
      region: "eu-west-1",
      s3ForcePathStyle: true,
      accessKeyId: "S3RVER", // This specific key is required when working offline
      secretAccessKey: "S3RVER",
      endpoint: new Endpoint("http://localhost:4569"),
    }
  : {};

let client: S3 | null = null;

export function getS3Client() {
  if (client) {
    return client;
  }

  client = new S3(S3_CONFIG);
  return client;
}
