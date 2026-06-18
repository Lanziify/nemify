type BaseError = {
  code: string;
  message: string;
};

export type ApiSuccessResponse<T> = { data: T; error: null };
export type ApiErrorResponse<E> = { data: null; error: E };
export type ApiResponse<T, E extends BaseError> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse<E>;
