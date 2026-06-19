import { Result, BaseError } from '@/types/api-response';

export async function safeCatch<T, E extends BaseError>(
  fn: () => Promise<T>,
  options?: {
    parser: (error: E) => E;
  }
): Promise<Result<T, E>> {
  try {
    return { data: await fn(), error: null };
  } catch (error) {
    return {
      data: null,
      error: options ? options.parser(error as E) : (error as E),
    };
  }
}
