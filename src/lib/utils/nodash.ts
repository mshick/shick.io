export function keyBy<T extends Record<string, unknown>, K extends keyof T>(
  array: T[],
  key: K,
) {
  const map = new Map<T[K], T>();

  for (const value of array) {
    if (value[key] !== undefined) {
      map.set(value[key], value);
    }
  }

  return map;
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys?: K[],
): { [P in K]: T[P] } {
  if (keys == null) {
    return obj;
  }

  return Object.fromEntries(keys.map((k) => [k, obj[k]])) as { [P in K]: T[P] };
}

export function intersection(arr: string[], ...args: string[][]) {
  return arr.filter((item) => args.every((arr) => arr.includes(item)));
}
