export type BaseError = {
  code: string;
  message: string;
  details?: Record<string, unknown> | unknown;
};

export type Success<T> = { data: T; error: null };
export type Error<E> = { data: null; error: E };
export type Result<T, E extends BaseError> = Success<T> | Error<E>;
