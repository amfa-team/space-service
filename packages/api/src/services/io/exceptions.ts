/* eslint-disable max-classes-per-file */

export class InvalidRequestError extends Error {
  readonly code: 400 | 403;

  constructor(message = "invalid request", code: 400 | 403 = 400) {
    super(message);
    this.code = code;
  }
}

export class ForbiddenError extends InvalidRequestError {
  constructor() {
    super("Forbidden", 403);
  }
}
