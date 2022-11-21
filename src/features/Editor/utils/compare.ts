export function shallowEquals(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): boolean {
  for (const key of Object.keys(a)) {
    if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}
