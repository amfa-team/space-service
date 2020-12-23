import type { IPermission, ISpace } from "./model";

export interface SuccessResponse<T> {
  success: true;
  payload: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;

export enum METHODS {
  post = "POST",
  get = "GET",
}

export type GetRoute<O> = {
  out: O;
};

export type PostRoute<I, O> = {
  in: I;
  out: O;
};

export interface SpacesPayload {
  spaces: ISpace[];
}

export interface AdminData {
  secret: string;
}

export interface PaginationData {
  pageIndex: number;
  pageSize: number;
}

export interface AdminListData extends AdminData {
  pagination: PaginationData;
}

export interface PaginationContext extends PaginationData {
  pageCount: number;
  count: number;
}

export interface PaginationPayload<T> {
  pagination: PaginationContext;
  page: T[];
}

export interface ImageUploadReq extends AdminData {
  name: string;
}

export interface SpaceUpdateReq extends AdminData {
  space: ISpace;
}

export interface SpaceRemoveReq extends AdminData {
  slug: string;
}

export type PermissionUpdateData = Pick<
  IPermission,
  Exclude<keyof IPermission, "_id">
>;

export interface PermissionUpdateReq extends AdminData {
  permission: PermissionUpdateData;
}

export interface PermissionRemoveReq extends AdminData {
  spaceId: string;
  userId: string;
}

export interface ImageUploadPayload {
  uploadUrl: string;
}

export type PublicGetRoutes = {
  list: GetRoute<SpacesPayload>;
};

export type AdminGetRoutes = {
  // no-op
};

export interface GetSpaceReq {
  slug: string;
}

export type GetRoutes = PublicGetRoutes & AdminGetRoutes;

export type PublicPostRoutes = {
  // no-op
  get: PostRoute<GetSpaceReq, ISpace | null>;
};

export type AdminPostRoutes = {
  "admin/image/upload": PostRoute<ImageUploadReq, ImageUploadPayload>;
  "admin/space/update": PostRoute<SpaceUpdateReq, ISpace>;
  "admin/space/remove": PostRoute<SpaceRemoveReq, null>;
  "admin/space": PostRoute<AdminListData, PaginationPayload<ISpace>>;
  "admin/permission": PostRoute<AdminListData, PaginationPayload<IPermission>>;
  "admin/permission/update": PostRoute<PermissionUpdateReq, IPermission>;
  "admin/permission/remove": PostRoute<PermissionRemoveReq, null>;
};

export type PostRoutes = PublicPostRoutes & AdminPostRoutes;
