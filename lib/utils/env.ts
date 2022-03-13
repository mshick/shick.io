export const getEnv = (
  name: string,
  defaultValue?: string
): string | undefined => {
  return process.env[name] ?? defaultValue
}

export const assertEnv = (name: string, defaultValue?: string): string => {
  const value = getEnv(name, defaultValue)
  if (value === undefined) {
    throw new Error(`process.env.${name} is not set`)
  }
  return value
}
