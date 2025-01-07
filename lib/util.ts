type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type RemoveNull<T> = ExpandRecursively<{
  [K in keyof T]: Exclude<RemoveNull<T[K]>, null>;
}>;

export function makeSparse<T extends Record<string, unknown>>(
  obj: T,
): RemoveNull<T> {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => {
      return value === null || value === '' ? undefined : value;
    }),
  );
}

export function safeParseJsonString(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}
