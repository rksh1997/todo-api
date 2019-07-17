import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';

export class TodoError extends Error {
  constructor(status = 500, message = 'Internal server error') {
    super(message);
    this.status = status;
  }

  toJSON() {
    return {
      status: this.status,
      response: {
        message: this.message,
      },
    };
  }
}

export const NotFoundError = new TodoError(NOT_FOUND, 'Not found');
export const InternalServerError = new TodoError(
  INTERNAL_SERVER_ERROR,
  'Internal server error',
);
