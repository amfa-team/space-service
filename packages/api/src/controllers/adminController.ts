import type {
  AdminListData,
  ISpace,
  ImageUploadPayload,
  ImageUploadReq,
  PaginationPayload,
  SpaceUpdateReq,
} from "@amfa-team/space-service-types";
import { Endpoint, S3 } from "aws-sdk";
import { JsonDecoder } from "ts.data.json";
import { SpaceModel } from "../mongo/model/space";
import type { HandlerResult } from "../services/io/types";
import { getEnv } from "../utils/env";

const S3_CONFIG = process.env.IS_OFFLINE
  ? {
      region: "eu-west-1",
      s3ForcePathStyle: true,
      accessKeyId: "S3RVER", // This specific key is required when working offline
      secretAccessKey: "S3RVER",
      endpoint: new Endpoint("http://localhost:4569"),
    }
  : {};

export const adminImageUploadDecoder = JsonDecoder.object<ImageUploadReq>(
  {
    secret: JsonDecoder.string,
    name: JsonDecoder.string,
  },
  "adminImageUploadDecoder",
);

export const paginationDecoder = JsonDecoder.object(
  {
    pageSize: JsonDecoder.number,
    pageIndex: JsonDecoder.number,
  },
  "paginationDecoder",
);

export const adminListDecoder = JsonDecoder.object(
  {
    pagination: paginationDecoder,
    secret: JsonDecoder.string,
  },
  "adminListDecoder",
);

export async function handleAdminImageUpload(
  req: ImageUploadReq,
): Promise<HandlerResult<ImageUploadPayload>> {
  const s3 = new S3(S3_CONFIG);

  const s3Params = {
    Bucket: getEnv("S3_IMAGE_BUCKET"),
    Key: `${req.name}.jpg`,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  return {
    payload: { uploadUrl: s3.getSignedUrl("putObject", s3Params) },
  };
}

export async function handleAdminSpaces(
  data: AdminListData,
): Promise<HandlerResult<PaginationPayload<ISpace>>> {
  const { pageSize, pageIndex } = data.pagination;
  const [count, entities] = await Promise.all([
    SpaceModel.countDocuments({}),
    SpaceModel.find({}, null, {
      sort: { _id: 1 },
      limit: pageSize,
      skip: pageIndex * pageSize,
    }),
  ]);

  return {
    payload: {
      pagination: {
        pageSize,
        pageIndex,
        pageCount: Math.ceil(count / pageSize),
        count,
      },
      page: entities.map((entity) => entity.toJSON()),
    },
  };
}

export const adminSpaceUpdateDecoder = JsonDecoder.object(
  {
    space: JsonDecoder.object(
      {
        _id: JsonDecoder.string,
        name: JsonDecoder.string,
        enabled: JsonDecoder.boolean,
        imageUrl: JsonDecoder.nullable(JsonDecoder.string),
        home: JsonDecoder.boolean,
        random: JsonDecoder.boolean,
        order: JsonDecoder.number,
      },
      "space",
    ),
    secret: JsonDecoder.string,
  },
  "adminSpaceUpdateDecoder",
);

export async function handleAdminSpaceUpdate(
  data: SpaceUpdateReq,
): Promise<HandlerResult<ISpace>> {
  const { space } = data;
  await SpaceModel.findOneAndUpdate({ _id: space._id }, space, {
    upsert: true,
  });

  return {
    payload: space,
  };
}
