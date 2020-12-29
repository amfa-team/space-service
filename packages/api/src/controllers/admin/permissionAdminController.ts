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
        userEmail: JsonDecoder.string,
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
    permission: { spaceId, userEmail, role },
  } = data;
  const permission = await PermissionModel.findOneAndUpdate(
    { spaceId, userEmail },
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
    userEmail: JsonDecoder.string,
    secret: JsonDecoder.string,
  },
  "adminPermissionUpdateDecoder",
);

export async function handleAdminPermissionRemove(
  data: PermissionRemoveReq,
): Promise<HandlerResult<null>> {
  const { spaceId, userEmail } = data;
  await PermissionModel.findOneAndRemove({ spaceId, userEmail });

  return {
    payload: null,
  };
}
