/* eslint-disable max-classes-per-file */

export class InvalidRequestError extends Error {
  readonly code: 400 | 403 | 404;

  constructor(message = "invalid request", code: 400 | 403 | 404 = 400) {
    super(message);
    this.code = code;
  }
}

export class ForbiddenError extends InvalidRequestError {
  constructor() {
    super("Forbidden", 403);
  }
}

export class NotFoundError extends InvalidRequestError {
  constructor() {
    super("NotFound", 404);
  }
}
