import type { ISpace } from "../model";
import type {
  AdminImageUploadRoute,
  AdminSpaceListRoute,
  AdminSpaceRemoveRoute,
  AdminSpaceUpdateRoute,
} from "./admin/admin";
import type { GetRoute, PostRoute } from "./common";

export * from "./admin";
export * from "./common";

export interface SpacesPayload {
  spaces: ISpace[];
}

export interface RestrictedReq {
  token: string;
}

export interface ManagePermissionRemove extends RestrictedReq {
  spaceId: string;
  userEmail: string;
}

export type PublicGetRoutes = {
  list: GetRoute<SpacesPayload>;
};

export type AdminGetRoutes = {
  // no-op
};

export interface GetSpaceReq {
  slug: string;
  token: null | string;
}

export interface GetSpacePayload {
  space: ISpace | null;
  private: boolean;
}

export type GetRoutes = PublicGetRoutes & AdminGetRoutes;

export type PublicPostRoutes = {
  // no-op
  get: PostRoute<GetSpaceReq, GetSpacePayload>;
  "manage/space/list": PostRoute<RestrictedReq, SpacesPayload>;
};

export type AdminPostRoutes = {
  "admin/image/upload": AdminImageUploadRoute;
  "admin/space/update": AdminSpaceUpdateRoute;
  "admin/space/remove": AdminSpaceRemoveRoute;
  "admin/space": AdminSpaceListRoute;
};

export type PostRoutes = PublicPostRoutes & AdminPostRoutes;
