import { JsonDecoder } from "ts.data.json";

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
