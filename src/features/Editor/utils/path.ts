export function getPathParent(path: string) {
  return path.split('/').slice(0, -1).join('/')
}

export function getPathFilename(path: string) {
  return path.split('/').slice(-1)[0]
}
