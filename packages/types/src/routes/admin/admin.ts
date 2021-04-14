import type { ISpace } from "../../model";
import type { IPoll, IVoter } from "../../vote/voteModel";
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

export interface AdminPollCreateReq extends AdminData {
  poll: Omit<IPoll, "events" | "status" | "_id">;
}

export interface AdminPollUpdateReq extends AdminData {
  id: string;
  poll: Partial<Omit<IPoll, "events" | "spaceSlug">>;
}

export interface AdminPollRemoveReq extends AdminData {
  id: string;
}

export interface AdminVoterCreateReq extends AdminData {
  voter: Partial<Omit<IVoter, "_id">>;
}

export interface AdminVoterUpdateReq extends AdminData {
  id: string;
  voter: Partial<IVoter>;
}

export interface AdminVoterRemoveReq extends AdminData {
  id: string;
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

export type AdminPollCreateRoute = PostRoute<AdminPollCreateReq, IPoll>;
export type AdminPollUpdateRoute = PostRoute<AdminPollUpdateReq, IPoll>;
export type AdminPollRemoveRoute = PostRoute<AdminPollRemoveReq, null>;

export type AdminVoterCreateRoute = PostRoute<AdminVoterCreateReq, IVoter>;
export type AdminVoterUpdateRoute = PostRoute<AdminVoterUpdateReq, IVoter>;
export type AdminVoterRemoveRoute = PostRoute<AdminVoterRemoveReq, null>;

export type AdminSpaceUpdateRoute = PostRoute<SpaceUpdateReq, ISpace>;

export type AdminSpaceRemoveRoute = PostRoute<SpaceRemoveReq, null>;

export type AdminSpaceListRoute = PostRoute<
  AdminListData,
  PaginationPayload<ISpace>
>;
