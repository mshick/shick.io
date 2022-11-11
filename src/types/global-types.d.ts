declare module '*.txt' {
  const content: any
  export default content
}

interface Error {
  status?: number
  info?: any
}
