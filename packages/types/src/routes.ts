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

export interface HelloData {
  name: string | null;
}

export interface HelloPayload {
  message: string;
}

export type GetRoutes = {
  hello: GetRoute<HelloPayload>;
};

export type PostRoutes = {
  hello: PostRoute<HelloData, HelloPayload>;
};
