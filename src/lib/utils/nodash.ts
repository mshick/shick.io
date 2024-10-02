export function keyBy<T extends Record<string, unknown>, K extends keyof T>(
  array: T[],
  key: K
) {
  const map = new Map<T[K], T>()

  for (const value of array) {
    if (value[key] !== undefined) {
      map.set(value[key], value)
    }
  }

  return map

}
