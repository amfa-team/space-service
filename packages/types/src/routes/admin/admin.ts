import type { ISpace } from "../../model";
import type { PostRoute } from "../common";

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

export interface ImageUploadPayload {
  uploadUrl: string;
}

export type AdminImageUploadRoute = PostRoute<
  ImageUploadReq,
  ImageUploadPayload
>;

export type AdminSpaceUpdateRoute = PostRoute<SpaceUpdateReq, ISpace>;

export type AdminSpaceRemoveRoute = PostRoute<SpaceRemoveReq, null>;

export type AdminSpaceListRoute = PostRoute<
  AdminListData,
  PaginationPayload<ISpace>
>;
