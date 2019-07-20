import { NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status';

export class TodoError extends Error {
  constructor(status = 500, message = 'Internal server error') {
    super(message);
    this.status = status;
  }

  toJSON() {
    return {
      status: this.status,
      errors: {
        messages: [this.message],
      },
    };
  }
}

export const NotFoundError = new TodoError(NOT_FOUND, 'Not found');
export const InternalServerError = new TodoError(
  INTERNAL_SERVER_ERROR,
  'Internal server error',
);
export const UnAuthorizedError = new TodoError(
  UNAUTHORIZED,
  'Missing or invalid auth token',
);
