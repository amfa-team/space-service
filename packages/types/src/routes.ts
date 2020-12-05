import type { ISpace } from "./model";

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

export type GetRoutes = {
  list: GetRoute<SpacesPayload>;
};

export type PostRoutes = {
  // no-op
};
