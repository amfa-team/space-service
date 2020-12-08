import type {
  AdminListData,
  ISpace,
  ImageUploadPayload,
  ImageUploadReq,
  PaginationPayload,
  SpaceUpdateReq,
} from "@amfa-team/space-service-types";
import type { PutObjectRequest } from "aws-sdk/clients/s3";
import { JsonDecoder } from "ts.data.json";
import { SpaceModel } from "../mongo/model/space";
import type { HandlerResult } from "../services/io/types";
import { getS3Client } from "../services/s3/s3Client";
import { getEnv } from "../utils/env";

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
  const s3 = getS3Client();

  const s3Params: PutObjectRequest = {
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
