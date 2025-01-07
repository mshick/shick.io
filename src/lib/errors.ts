export type FetchErrorOptions = ErrorOptions & {
  status: number;
  info: unknown;
};

export class FetchError extends Error {
  readonly status: number;
  readonly info: unknown;

  constructor(message: string, { cause, ...options }: FetchErrorOptions) {
    super(message, { cause });
    this.status = options.status;
    this.info = options.info;
  }
}
