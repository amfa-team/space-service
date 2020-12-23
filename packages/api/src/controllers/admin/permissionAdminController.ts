import type {
  AdminListData,
  IPermission,
  PaginationPayload,
  PermissionRemoveReq,
  PermissionUpdateReq,
} from "@amfa-team/space-service-types";
import { JsonDecoder } from "ts.data.json";
import { PermissionModel } from "../../mongo/model/permission";
import type { HandlerResult } from "../../services/io/types";

export async function handleAdminPermissionList(
  data: AdminListData,
): Promise<HandlerResult<PaginationPayload<IPermission>>> {
  const { pageSize, pageIndex } = data.pagination;
  const [count, entities] = await Promise.all([
    PermissionModel.countDocuments({}),
    PermissionModel.find({}, null, {
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

export const adminPermissionUpdateDecoder = JsonDecoder.object<
  PermissionUpdateReq
>(
  {
    permission: JsonDecoder.object(
      {
        spaceId: JsonDecoder.string,
        userId: JsonDecoder.string,
        role: JsonDecoder.oneOf([JsonDecoder.isExactly("admin")], "role"),
      },
      "permission",
    ),
    secret: JsonDecoder.string,
  },
  "adminPermissionUpdateDecoder",
);

export async function handleAdminPermissionUpdate(
  data: PermissionUpdateReq,
): Promise<HandlerResult<IPermission>> {
  const {
    permission: { spaceId, userId, role },
  } = data;
  const permission = await PermissionModel.findOneAndUpdate(
    { spaceId, userId },
    { role },
    {
      upsert: true,
      new: true,
    },
  );

  if (permission === null) {
    throw new Error("handleAdminPermissionUpdate: failed");
  }

  return {
    payload: permission,
  };
}

export const adminPermissionRemoveDecoder = JsonDecoder.object(
  {
    spaceId: JsonDecoder.string,
    userId: JsonDecoder.string,
    secret: JsonDecoder.string,
  },
  "adminPermissionUpdateDecoder",
);

export async function handleAdminPermissionRemove(
  data: PermissionRemoveReq,
): Promise<HandlerResult<null>> {
  const { spaceId, userId } = data;
  await PermissionModel.findOneAndRemove({ spaceId, userId });

  return {
    payload: null,
  };
}
